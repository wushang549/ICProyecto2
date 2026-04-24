import * as ort from "onnxruntime-web"
import {
  createBatchAnalysisOutcome,
  type AnalysisProgressState,
  type BatchAnalysisOutcome,
  type ImageAnalysisResult,
  type PredictionEntry,
  type UploadedImage,
} from "@/lib/batch-analysis"
import { assetPath } from "@/lib/asset-path"

const MODEL_INPUT_SIZE = 224
const MODEL_INPUT_DIMS = [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE] as const
const MODEL_MEAN = [0.485, 0.456, 0.406] as const
const MODEL_STD = [0.229, 0.224, 0.225] as const
const MODEL_URL = assetPath("/models/best_model_project_2.onnx")
const MODEL_EXTERNAL_DATA_URL = assetPath("/models/best_model_project_2.onnx.data")
const MODEL_EXTERNAL_DATA_PATH = "best_model_project_2.onnx.data"
const WASM_ASSET_PREFIX = assetPath("/ort/")
const MODEL_CLASS_ORDER = [
  "Tomato_Bacterial_spot",
  "Tomato_Early_blight",
  "Tomato_Late_blight",
  "Tomato_Leaf_Mold",
  "Tomato_Septoria_leaf_spot",
  "Tomato_Spider_mites_Two_spotted_spider_mite",
  "Tomato__Target_Spot",
  "Tomato__Tomato_YellowLeaf__Curl_Virus",
  "Tomato__Tomato_mosaic_virus",
  "Tomato_healthy",
] as const

let sessionPromise: Promise<ort.InferenceSession> | null = null

function configureOrt() {
  ort.env.wasm.wasmPaths = WASM_ASSET_PREFIX
  ort.env.wasm.numThreads = 1
}

function createProgressState(
  totalImages: number,
  phase: AnalysisProgressState["phase"],
  statusLabel: string,
  overrides: Partial<Omit<AnalysisProgressState, "phase" | "totalImages" | "statusLabel">> = {},
): AnalysisProgressState {
  return {
    phase,
    totalImages,
    statusLabel,
    progress: 0,
    processedCount: 0,
    activeImageIndex: null,
    ...overrides,
  }
}

function softmax(values: number[]) {
  const maxValue = Math.max(...values)
  const exponentials = values.map((value) => Math.exp(value - maxValue))
  const sum = exponentials.reduce((total, value) => total + value, 0)

  return exponentials.map((value) => value / sum)
}

function toTopPredictions(logits: number[]) {
  const probabilities = softmax(logits)

  return MODEL_CLASS_ORDER.map((className, index) => ({
    className,
    confidence: probabilities[index] * 100,
  }))
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 3)
}

async function loadImageBitmap(file: File) {
  return createImageBitmap(file)
}

function imageBitmapToTensor(imageBitmap: ImageBitmap) {
  const canvas = document.createElement("canvas")
  canvas.width = MODEL_INPUT_SIZE
  canvas.height = MODEL_INPUT_SIZE

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("No se pudo preparar el lienzo para inferencia.")
  }

  context.drawImage(imageBitmap, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE)

  const { data } = context.getImageData(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE)
  const channelSize = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE
  const tensorData = new Float32Array(3 * channelSize)

  for (let pixelIndex = 0; pixelIndex < channelSize; pixelIndex += 1) {
    const rgbaOffset = pixelIndex * 4
    const red = data[rgbaOffset] / 255
    const green = data[rgbaOffset + 1] / 255
    const blue = data[rgbaOffset + 2] / 255

    tensorData[pixelIndex] = (red - MODEL_MEAN[0]) / MODEL_STD[0]
    tensorData[channelSize + pixelIndex] = (green - MODEL_MEAN[1]) / MODEL_STD[1]
    tensorData[channelSize * 2 + pixelIndex] = (blue - MODEL_MEAN[2]) / MODEL_STD[2]
  }

  return new ort.Tensor("float32", tensorData, [...MODEL_INPUT_DIMS])
}

async function inferSingleImage(
  session: ort.InferenceSession,
  image: UploadedImage,
): Promise<ImageAnalysisResult> {
  const imageBitmap = await loadImageBitmap(image.file)

  try {
    const inputTensor = imageBitmapToTensor(imageBitmap)
    const outputs = await session.run({
      [session.inputNames[0]]: inputTensor,
    })
    const outputTensor = outputs[session.outputNames[0]]

    if (!outputTensor) {
      throw new Error("El modelo no devolvio resultados.")
    }

    const logits = Array.from(outputTensor.data as Float32Array)
    const predictions = toTopPredictions(logits)
    const [mainPrediction] = predictions

    return {
      ...image,
      diseaseId: mainPrediction.className,
      confidence: mainPrediction.confidence,
      predictions,
    }
  } finally {
    imageBitmap.close()
  }
}

async function createInferenceSession() {
  configureOrt()

  return ort.InferenceSession.create(MODEL_URL, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    externalData: [
      {
        path: MODEL_EXTERNAL_DATA_PATH,
        data: MODEL_EXTERNAL_DATA_URL,
      },
    ],
  })
}

async function getInferenceSession() {
  if (!sessionPromise) {
    sessionPromise = createInferenceSession().catch((error) => {
      sessionPromise = null
      throw error
    })
  }

  return sessionPromise
}

export async function preloadTomatoModel() {
  return getInferenceSession()
}

export function resetTomatoModelSession() {
  sessionPromise = null
}

export async function analyzeTomatoBatch(
  images: UploadedImage[],
  onProgress?: (progress: AnalysisProgressState) => void,
): Promise<BatchAnalysisOutcome> {
  if (images.length === 0) {
    return createBatchAnalysisOutcome([])
  }

  onProgress?.(
    createProgressState(images.length, "model-loading", "Cargando modelo ONNX", {
      progress: 4,
    }),
  )

  const session = await getInferenceSession()
  const imageProgressWeight = 90 / images.length
  const results: ImageAnalysisResult[] = []

  for (const [index, image] of images.entries()) {
    const baseProgress = 5 + imageProgressWeight * index

    onProgress?.(
      createProgressState(
        images.length,
        "preprocessing",
        `Preparando foto ${index + 1} de ${images.length}`,
        {
          activeImageIndex: index,
          processedCount: results.length,
          progress: Math.min(94, baseProgress + imageProgressWeight * 0.35),
        },
      ),
    )

    onProgress?.(
      createProgressState(
        images.length,
        "inferencing",
        `Ejecutando inferencia en foto ${index + 1} de ${images.length}`,
        {
          activeImageIndex: index,
          processedCount: results.length,
          progress: Math.min(96, baseProgress + imageProgressWeight * 0.65),
        },
      ),
    )

    const analyzedImage = await inferSingleImage(session, image)
    results.push(analyzedImage)

    onProgress?.(
      createProgressState(
        images.length,
        "inferencing",
        `Inferencia completada para foto ${index + 1} de ${images.length}`,
        {
          activeImageIndex: index,
          processedCount: results.length,
          progress: Math.min(97, baseProgress + imageProgressWeight),
        },
      ),
    )
  }

  onProgress?.(
    createProgressState(images.length, "grouping", "Agrupando resultados reales", {
      processedCount: results.length,
      progress: 98,
    }),
  )

  const outcome = createBatchAnalysisOutcome(results)

  onProgress?.(
    createProgressState(images.length, "completed", "Resultados listos", {
      processedCount: results.length,
      progress: 100,
    }),
  )

  return outcome
}
