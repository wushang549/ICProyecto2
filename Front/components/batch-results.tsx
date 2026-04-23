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
          <div className="bg-secondary/30 p-6 lg:py-6 lg:pl-6 lg:pr-0">
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
                  Se detectó {group.disease.name.toLowerCase()}
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
                  <h4 className="text-sm font-semibold text-foreground">Qué es</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {group.disease.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground">Síntomas comunes</h4>
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
                <h4 className="text-sm font-semibold text-foreground">Qué hacer</h4>
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Análisis por lote
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {totalImages} {totalImages === 1 ? "foto clasificada" : "fotos clasificadas"} en {groups.length}{" "}
              {groups.length === 1 ? "grupo" : "grupos"}
            </h2>
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <BatchGroupCard key={group.disease.id} group={group} />
      ))}
    </div>
  )
}
