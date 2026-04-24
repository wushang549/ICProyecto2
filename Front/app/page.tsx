"use client"

import { useCallback, useState } from "react"
import { ArrowDown } from "lucide-react"
import { AboutSection } from "@/components/about-section"
import { AnalysisProgress } from "@/components/analysis-progress"
import { BatchResults } from "@/components/batch-results"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/upload-zone"
import { getMockBatchResults, type BatchResultGroup, type UploadedImage } from "@/lib/batch-analysis"

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<BatchResultGroup[] | null>(null)

  const handleImageSelect = useCallback((images: UploadedImage[]) => {
    setSelectedImages(images)
    setResults(null)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedImages([])
    setResults(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (selectedImages.length === 0) {
      return
    }

    setIsAnalyzing(true)

    await new Promise((resolve) => setTimeout(resolve, 8000))

    setResults(getMockBatchResults(selectedImages))
    setIsAnalyzing(false)
  }, [selectedImages])

  const handleUploadAnother = useCallback(() => {
    setSelectedImages([])
    setResults(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

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
                Sube imágenes de hojas de tomate para clasificarlas por enfermedad
                o confirmar si las hojas están sanas.
              </p>

              {selectedImages.length === 0 && !results && (
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
                <AnalysisProgress images={selectedImages} />
              ) : !results ? (
                <UploadZone
                  onImageSelect={handleImageSelect}
                  selectedImages={selectedImages}
                  onClear={handleClear}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                />
              ) : (
                <div className="space-y-8">
                  <BatchResults groups={results} />

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
