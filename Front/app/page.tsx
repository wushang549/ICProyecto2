"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"
import { AboutSection } from "@/components/about-section"
import { AnalysisProgress } from "@/components/analysis-progress"
import { BatchResults } from "@/components/batch-results"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsCard } from "@/components/results-card"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/upload-zone"
import {
  createInitialAnalysisProgress,
  type AnalysisProgressState,
  type BatchAnalysisOutcome,
  type UploadedImage,
} from "@/lib/batch-analysis"
import { analyzeTomatoBatch, preloadTomatoModel, resetTomatoModelSession } from "@/lib/tomato-inference"

type ModelStatus = "loading" | "ready" | "error"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return "Ocurrio un problema inesperado al preparar la inferencia."
}

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgressState>(
    createInitialAnalysisProgress(0),
  )
  const [analysisOutcome, setAnalysisOutcome] = useState<BatchAnalysisOutcome | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [modelStatus, setModelStatus] = useState<ModelStatus>("loading")
  const [modelStatusMessage, setModelStatusMessage] = useState(
    "Cargando el modelo ONNX directamente en el navegador.",
  )

  const loadModel = useCallback(async () => {
    setModelStatus("loading")
    setModelStatusMessage("Cargando el modelo ONNX directamente en el navegador.")

    try {
      await preloadTomatoModel()
      setModelStatus("ready")
      setModelStatusMessage("Modelo listo para inferencia local sin backend.")
    } catch (error) {
      setModelStatus("error")
      setModelStatusMessage(getErrorMessage(error))
    }
  }, [])

  useEffect(() => {
    void loadModel()
  }, [loadModel])

  const handleImageSelect = useCallback((images: UploadedImage[]) => {
    setSelectedImages(images)
    setAnalysisOutcome(null)
    setAnalysisError(null)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedImages([])
    setAnalysisOutcome(null)
    setAnalysisError(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (selectedImages.length === 0) {
      return
    }

    setIsAnalyzing(true)
    setAnalysisOutcome(null)
    setAnalysisError(null)
    setAnalysisProgress(createInitialAnalysisProgress(selectedImages.length))

    try {
      const outcome = await analyzeTomatoBatch(selectedImages, setAnalysisProgress)

      setAnalysisOutcome(outcome)
      setModelStatus("ready")
      setModelStatusMessage("Modelo listo para inferencia local sin backend.")
    } catch (error) {
      setAnalysisError(getErrorMessage(error))
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedImages])

  const handleUploadAnother = useCallback(() => {
    setSelectedImages([])
    setAnalysisOutcome(null)
    setAnalysisError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleRetryModelLoad = useCallback(() => {
    resetTomatoModelSession()
    setAnalysisError(null)
    void loadModel()
  }, [loadModel])

  const singleImageResult = analysisOutcome?.imageResults.length === 1
    ? analysisOutcome.imageResults[0]
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Tomate Sano
                <span className="block text-primary">Detecta enfermedades a tiempo</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                Sube imagenes de hojas de tomate para clasificarlas por enfermedad o
                confirmar si las hojas estan sanas.
              </p>

              {selectedImages.length === 0 && !analysisOutcome && (
                <div className="mt-8 flex justify-center">
                  <a
                    href="#upload"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Comenzar
                    <ArrowDown className="h-4 w-4 animate-bounce" />
                  </a>
                </div>
              )}
            </div>

            <div id="upload" className="mt-12 scroll-mt-24 sm:mt-16">
              {isAnalyzing ? (
                <AnalysisProgress
                  images={selectedImages}
                  progressState={analysisProgress}
                />
              ) : !analysisOutcome ? (
                <UploadZone
                  onImageSelect={handleImageSelect}
                  selectedImages={selectedImages}
                  onClear={handleClear}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                  modelStatus={modelStatus}
                  modelStatusMessage={modelStatusMessage}
                  analysisError={analysisError}
                  onRetryModelLoad={handleRetryModelLoad}
                />
              ) : (
                <div className="space-y-8">
                  {singleImageResult ? (
                    <ResultsCard
                      imagePreview={singleImageResult.preview}
                      predictions={singleImageResult.predictions}
                    />
                  ) : (
                    <BatchResults groups={analysisOutcome.groups} />
                  )}

                  <div className="flex justify-center">
                    <Button
                      onClick={handleUploadAnother}
                      size="lg"
                      variant="outline"
                      className="px-8"
                    >
                      Subir otro lote
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <AboutSection />
      </main>

      <Footer />
    </div>
  )
}
