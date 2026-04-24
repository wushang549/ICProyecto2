import { diseaseData, diseaseList, type DiseaseInfo } from "@/lib/disease-data"

export interface UploadedImage {
  id: string
  name: string
  file: File
  preview: string
  index: number
}

export interface PredictionEntry {
  className: string
  confidence: number
}

export interface ImageAnalysisResult extends UploadedImage {
  diseaseId: string
  confidence: number
  predictions: PredictionEntry[]
}

export interface BatchResultGroup {
  disease: DiseaseInfo
  images: ImageAnalysisResult[]
  confidence: number
}

export type AnalysisPhase =
  | "model-loading"
  | "preprocessing"
  | "inferencing"
  | "grouping"
  | "completed"

export interface AnalysisProgressState {
  phase: AnalysisPhase
  progress: number
  processedCount: number
  activeImageIndex: number | null
  totalImages: number
  statusLabel: string
}

export interface BatchAnalysisOutcome {
  imageResults: ImageAnalysisResult[]
  groups: BatchResultGroup[]
}

export const INITIAL_ANALYSIS_PROGRESS: Omit<AnalysisProgressState, "totalImages"> = {
  phase: "model-loading",
  progress: 0,
  processedCount: 0,
  activeImageIndex: null,
  statusLabel: "Preparando analisis",
}

export function createInitialAnalysisProgress(totalImages: number): AnalysisProgressState {
  return {
    ...INITIAL_ANALYSIS_PROGRESS,
    totalImages,
  }
}

export function buildBatchResultGroups(imageResults: ImageAnalysisResult[]): BatchResultGroup[] {
  const groupedResults = new Map<string, ImageAnalysisResult[]>()

  imageResults.forEach((imageResult) => {
    groupedResults.set(imageResult.diseaseId, [
      ...(groupedResults.get(imageResult.diseaseId) ?? []),
      imageResult,
    ])
  })

  return diseaseList
    .map((disease) => {
      const groupedImages = groupedResults.get(disease.id) ?? []
      const confidence =
        groupedImages.reduce((total, image) => total + image.confidence, 0) /
        groupedImages.length

      return {
        disease,
        images: groupedImages,
        confidence,
      }
    })
    .filter((group) => group.images.length > 0)
}

export function createBatchAnalysisOutcome(
  imageResults: ImageAnalysisResult[],
): BatchAnalysisOutcome {
  return {
    imageResults,
    groups: buildBatchResultGroups(imageResults),
  }
}

export function getDiseaseInfo(diseaseId: string) {
  return diseaseData[diseaseId]
}
