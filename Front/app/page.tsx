"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { UploadZone } from "@/components/upload-zone"
import { ResultsCard } from "@/components/results-card"
import { AboutSection } from "@/components/about-section"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getRandomPrediction } from "@/lib/disease-data"
import { ArrowDown } from "lucide-react"

interface Prediction {
  class: string
  confidence: number
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<Prediction[] | null>(null)

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedImage(preview)
    setResults(null)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedImage(null)
    setResults(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const prediction = getRandomPrediction()
    setResults(prediction.predictions)
    setIsAnalyzing(false)
  }, [])

  const handleUploadAnother = useCallback(() => {
    setSelectedImage(null)
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
                <span className="block text-primary">Detecta enfermedades en hojas de tomate a tiempo</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                Sube una imagen de una hoja de tomate para identificar posibles enfermedades
                o confirmar si la hoja está sana.
              </p>

              {!selectedImage && !results && (
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
              {!results ? (
                <UploadZone
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                />
              ) : (
                <div className="space-y-8">
                  <ResultsCard
                    imagePreview={selectedImage!}
                    predictions={results}
                  />

                  <div className="flex justify-center">
                    <Button
                      onClick={handleUploadAnother}
                      size="lg"
                      variant="outline"
                      className="px-8"
                    >
                      Subir otra imagen
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
