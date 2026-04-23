"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ImageIcon, Layers3, ScanLine } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { UploadedImage } from "@/lib/batch-analysis"
import { cn } from "@/lib/utils"

interface AnalysisProgressProps {
  images: UploadedImage[]
}

const ANALYSIS_DURATION = 5000
const PROGRESS_INTERVAL = 100

const analysisSteps = [
  "Preparando lote",
  "Analizando imágenes",
  "Comparando patrones",
  "Agrupando resultados",
]

export function AnalysisProgress({ images }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)
  const activeImage = images[Math.min(
    images.length - 1,
    Math.floor((progress / 100) * Math.max(1, images.length)),
  )]
  const activeStepIndex = Math.min(
    analysisSteps.length - 1,
    Math.floor((progress / 100) * analysisSteps.length),
  )

  const scannedCount = useMemo(() => {
    return Math.min(images.length, Math.max(1, Math.ceil((progress / 100) * images.length)))
  }, [images.length, progress])

  useEffect(() => {
    setProgress(0)

    const startedAt = Date.now()
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min(99, Math.round((elapsed / ANALYSIS_DURATION) * 100))

      setProgress(nextProgress)
    }, PROGRESS_INTERVAL)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [images])

  return (
    <Card className="mx-auto max-w-6xl overflow-hidden border-border shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-0">
        <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="bg-secondary/30 p-6 md:py-6 md:pl-6 md:pr-0">
            <div className="relative isolate aspect-square w-full overflow-hidden rounded-lg bg-background/70">
              {activeImage && (
                <img
                  src={activeImage.preview}
                  alt={`Analizando foto ${activeImage.index}`}
                  className="block h-full w-full rounded-lg object-cover"
                />
              )}
              <div className="absolute inset-0 bg-foreground/10" />
              <div className="absolute inset-x-6 top-0 h-24 animate-pulse rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-primary/70 shadow-[0_0_22px_var(--primary)]" />
              <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                Foto {activeImage?.index ?? 1}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="space-y-7">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ScanLine className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Análisis en progreso
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Revisando {images.length} {images.length === 1 ? "foto" : "fotos"} del lote
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {analysisSteps[activeStepIndex]}
                  </span>
                  <span className="text-lg font-bold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Fotos analizadas
                  </div>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    {scannedCount}/{images.length}
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Layers3 className="h-4 w-4 text-primary" />
                    Modo mock
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Simulando clasificación con las primeras 4 enfermedades.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, index) => (
                  <div
                    key={step}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      index <= activeStepIndex ? "bg-primary/10 text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {index < activeStepIndex ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-2",
                          index === activeStepIndex ? "border-primary" : "border-muted-foreground/40",
                        )}
                      />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
