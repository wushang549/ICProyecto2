"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  ImageIcon,
  LoaderCircle,
  ScanLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { UploadedImage } from "@/lib/batch-analysis"

interface AnalysisProgressProps {
  images: UploadedImage[]
}

const ANALYSIS_DURATION = 7000
const PROGRESS_INTERVAL = 100
const THUMBNAILS_PER_PAGE = 12

const analysisSteps = [
  "Preparando lote",
  "Procesando imágenes",
  "Comparando patrones foliares",
  "Generando resultados",
]

export function AnalysisProgress({
  images,
}: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)

    const startedAt = Date.now()

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt

      const next = Math.min(
        99,
        Math.round(
          (elapsed / ANALYSIS_DURATION) * 100,
        ),
      )

      setProgress(next)
    }, PROGRESS_INTERVAL)

    return () => window.clearInterval(interval)
  }, [images])

  const progressRatio = progress / 100

  const activeStepIndex = Math.min(
    analysisSteps.length - 1,
    Math.floor(
      progressRatio * analysisSteps.length,
    ),
  )

  const activeImageIndex = useMemo(() => {
    if (!images.length) return 0

    return Math.min(
      images.length - 1,
      Math.floor(progressRatio * images.length),
    )
  }, [images.length, progressRatio])

  const activeImage = images[activeImageIndex]

  const processedCount = useMemo(() => {
    if (!images.length) return 0

    return Math.min(
      images.length,
      Math.floor(progressRatio * images.length),
    )
  }, [images.length, progressRatio])

  const queueCount = Math.max(
    images.length - processedCount - 1,
    0,
  )

  const getImageStatus = (
    index: number,
  ): "done" | "active" | "queued" => {
    if (index < activeImageIndex) return "done"
    if (index === activeImageIndex)
      return "active"
    return "queued"
  }

  const currentPage = Math.floor(
    activeImageIndex / THUMBNAILS_PER_PAGE,
  )

  const totalPages = Math.ceil(
    images.length / THUMBNAILS_PER_PAGE,
  )

  const pageStart =
    currentPage * THUMBNAILS_PER_PAGE

  const pageEnd =
    pageStart + THUMBNAILS_PER_PAGE

  const visibleImages = images.slice(
    pageStart,
    pageEnd,
  )

  if (!images.length) return null

  return (
    <>
      <style jsx>{`
        @keyframes scanVertical {
          0% {
            top: 0%;
            opacity: 0.65;
          }

          50% {
            top: calc(100% - 3px);
            opacity: 1;
          }

          100% {
            top: 0%;
            opacity: 0.65;
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-140%)
              rotate(12deg);
          }

          100% {
            transform: translateX(220%)
              rotate(12deg);
          }
        }

        @keyframes borderPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0
              rgba(34, 197, 94, 0.12);
          }

          50% {
            box-shadow: 0 0 0 8px
              rgba(34, 197, 94, 0.06);
          }
        }

        .scan-line {
          animation: scanVertical 2.6s
            ease-in-out infinite;
        }

        .image-shimmer {
          animation: shimmerSweep 2.8s
            linear infinite;
        }

        .active-image-pulse {
          animation: borderPulse 1.8s
            ease-in-out infinite;
        }
      `}</style>

      <Card className="mx-auto max-w-6xl overflow-hidden border-border shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="bg-secondary/30 p-5 md:p-6">
              <div className="space-y-4">
                <div className="active-image-pulse relative isolate aspect-square w-full overflow-hidden rounded-2xl border border-primary/20 bg-background/80">
                  <img
                    src={activeImage.preview}
                    alt={`Analizando foto ${activeImage.index}`}
                    className="block h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/10" />

                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10" />

                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-x-0 h-[3px] rounded-full bg-primary/85 shadow-[0_0_18px_hsl(var(--primary))] scan-line" />

                    <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-white/10 blur-2xl image-shimmer" />
                  </div>

                  <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                    Foto {activeImage.index}
                  </div>

                  <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium flex items-center gap-2">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                    Analizando
                  </div>
                </div>

                {images.length > 1 && (
                  <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Lote {currentPage + 1} de{" "}
                        {totalPages}
                      </div>

                      <div>
                        Mostrando{" "}
                        {pageStart + 1}-
                        {Math.min(
                          pageEnd,
                          images.length,
                        )}{" "}
                        de {images.length}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {visibleImages.map(
                        (
                          image,
                          localIndex,
                        ) => {
                          const realIndex =
                            pageStart +
                            localIndex

                          const status =
                            getImageStatus(
                              realIndex,
                            )

                          return (
                            <div
                              key={`${image.index}-${realIndex}`}
                              className={cn(
                                "relative overflow-hidden rounded-xl border bg-background transition-all",
                                status ===
                                  "done" &&
                                  "border-emerald-500/40",
                                status ===
                                  "active" &&
                                  "border-primary shadow-md scale-[1.02]",
                                status ===
                                  "queued" &&
                                  "border-border opacity-80",
                              )}
                            >
                              <div className="relative aspect-square overflow-hidden">
                                <img
                                  src={
                                    image.preview
                                  }
                                  alt={`Miniatura ${image.index}`}
                                  className="h-full w-full object-cover"
                                />

                                <div className="absolute right-2 top-2">
                                  {status ===
                                  "done" ? (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </span>
                                  ) : status ===
                                    "active" ? (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                                      <LoaderCircle className="h-4 w-4 animate-spin" />
                                    </span>
                                  ) : (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow">
                                      <Clock3 className="h-4 w-4" />
                                    </span>
                                  )}
                                </div>

                                <div className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-1 text-[11px] font-medium">
                                  Foto{" "}
                                  {image.index}
                                </div>
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Cambio automático
                        por lote de 12
                        imágenes
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </>
                )}
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

                  <h3 className="text-2xl font-bold sm:text-3xl">
                    Revisando{" "}
                    {images.length}{" "}
                    {images.length === 1
                      ? "foto"
                      : "fotos"}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    El sistema está
                    procesando cada imagen y
                    comparando patrones
                    asociados a enfermedades
                    foliares del tomate.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {
                        analysisSteps[
                          activeStepIndex
                        ]
                      }
                    </span>

                    <span className="text-lg font-bold text-primary">
                      {progress}%
                    </span>
                  </div>

                  <Progress
                    value={progress}
                    className="h-3"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-sm font-semibold">
                      Completadas
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                      {processedCount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-sm font-semibold">
                      En análisis
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                      {progress < 100
                        ? 1
                        : 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-sm font-semibold">
                      En espera
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                      {queueCount}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analysisSteps.map(
                    (step, index) => (
                      <div
                        key={step}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                          index <
                            activeStepIndex &&
                            "bg-primary/10",
                          index ===
                            activeStepIndex &&
                            "bg-primary/15",
                          index >
                            activeStepIndex &&
                            "text-muted-foreground",
                        )}
                      >
                        {index <
                        activeStepIndex ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : index ===
                          activeStepIndex ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border-2 border-muted-foreground/35" />
                        )}

                        {step}
                      </div>
                    ),
                  )}
                </div>

                <div className="rounded-xl border bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">
                    Imagen actual:
                    <span className="ml-2 font-medium text-foreground">
                      Foto{" "}
                      {activeImage.index}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}