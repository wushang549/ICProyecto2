"use client"

import { useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BatchResultGroup } from "@/lib/batch-analysis"
import type { DiseaseInfo } from "@/lib/disease-data"
import { cn } from "@/lib/utils"

interface BatchResultsProps {
  groups: BatchResultGroup[]
}

function getStatusIcon(disease: DiseaseInfo) {
  if (disease.severity === "healthy") {
    return <CheckCircle2 className="h-6 w-6 text-primary" />
  }
  if (disease.severity === "high") {
    return <AlertCircle className="h-6 w-6 text-destructive" />
  }
  return <AlertTriangle className="h-6 w-6 text-warning" />
}

function getStatusColor(disease: DiseaseInfo) {
  if (disease.severity === "healthy") {
    return "text-primary"
  }
  if (disease.severity === "high") {
    return "text-destructive"
  }
  return "text-warning"
}

function getProgressColor(disease: DiseaseInfo) {
  if (disease.severity === "healthy") {
    return "[&>div]:bg-primary"
  }
  if (disease.severity === "high") {
    return "[&>div]:bg-destructive"
  }
  return "[&>div]:bg-warning"
}

function formatPhotoList(group: BatchResultGroup) {
  return group.images.map((image) => `Foto ${image.index}`).join(", ")
}

function BatchGroupCard({ group }: { group: BatchResultGroup }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = group.images[activeIndex]
  const hasMultipleImages = group.images.length > 1

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? group.images.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current === group.images.length - 1 ? 0 : current + 1))
  }

  return (
    <Card className="mx-auto max-w-6xl overflow-hidden border-border shadow-xl">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="p-6 lg:py-6 lg:pl-6 lg:pr-0">
            <div className="space-y-3">
              <div className="relative isolate aspect-square w-full overflow-hidden rounded-lg bg-background/70">
                <img
                  src={activeImage.preview}
                  alt={`Foto ${activeImage.index}: ${activeImage.name}`}
                  className="block h-full w-full rounded-lg object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                  Foto {activeImage.index}
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                  {activeIndex + 1} de {group.images.length}
                </div>

                {hasMultipleImages && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-border/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Confianza de la foto
                </p>
                <p className={cn("mt-1 text-lg font-bold", getStatusColor(group.disease))}>
                  {activeImage.confidence.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(group.disease)}
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Grupo detectado
                  </span>
                </div>
                <h3 className={cn("text-2xl font-bold sm:text-3xl", getStatusColor(group.disease))}>
                  Se detecto {group.disease.name.toLowerCase()}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Confianza promedio</span>
                  <span className={cn("text-lg font-bold", getStatusColor(group.disease))}>
                    {group.confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={group.confidence}
                  className={cn("h-3", getProgressColor(group.disease))}
                />
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Images className="h-4 w-4" />
                  {group.images.length} {group.images.length === 1 ? "foto asignada" : "fotos asignadas"}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {formatPhotoList(group)}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Que es</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {group.disease.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground">Sintomas comunes</h4>
                  <ul className="mt-2 space-y-2">
                    {group.disease.symptoms.slice(0, 3).map((symptom) => (
                      <li key={symptom} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">Que hacer</h4>
                <ul className="mt-2 grid gap-2 md:grid-cols-2">
                  {group.disease.recommendations.slice(0, 4).map((recommendation, index) => (
                    <li key={recommendation} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-secondary/60 p-4">
                <h4 className="text-sm font-semibold text-foreground">Importante</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.disease.important}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BatchResults({ groups }: BatchResultsProps) {
  const totalImages = groups.reduce((total, group) => total + group.images.length, 0)
  const totalConfidence = groups.reduce(
    (total, group) => total + group.confidence * group.images.length,
    0,
  )
  const averageBatchConfidence = totalImages > 0 ? totalConfidence / totalImages : 0
  const dominantGroup = groups.reduce<BatchResultGroup | null>((current, group) => {
    if (!current) {
      return group
    }

    if (group.images.length > current.images.length) {
      return group
    }

    if (group.images.length === current.images.length && group.confidence > current.confidence) {
      return group
    }

    return current
  }, null)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="mx-auto max-w-6xl border-primary/20 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/45 shadow-lg">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2.5 sm:p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Grupos
              </p>
              <p className="mt-1 text-xl font-bold leading-none text-foreground sm:text-2xl">
                {groups.length}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2.5 sm:p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <span className="sm:hidden">Fotos</span>
                <span className="hidden sm:inline">Fotos analizadas</span>
              </p>
              <p className="mt-1 text-xl font-bold leading-none text-foreground sm:text-2xl">
                {totalImages}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2.5 sm:p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Clase dominante
              </p>
              <p className="mt-1 text-sm font-bold leading-tight text-foreground sm:text-[15px] md:text-base">
                {dominantGroup?.disease.name ?? "Sin resultados"}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2.5 sm:p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Confianza lote
              </p>
              <p className="mt-1 text-xl font-bold leading-none text-primary sm:text-2xl">
                {averageBatchConfidence.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {groups.map((group) => (
        <BatchGroupCard key={group.disease.id} group={group} />
      ))}
    </div>
  )
}
