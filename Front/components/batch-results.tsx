"use client"

import { useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
  Biohazard,
  Bug,
  ChevronLeft,
  ChevronRight,
  Images,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BatchResultGroup } from "@/lib/batch-analysis"
import {
  diseaseSeverityRank,
  isHealthyDisease,
  type DiseaseInfo,
} from "@/lib/disease-data"
import { cn } from "@/lib/utils"

interface BatchResultsProps {
  groups: BatchResultGroup[]
}

type GroupSortMode = "default" | "infected" | "severity"

function CategoryIcon({
  src,
  label,
  className,
}: {
  src: string
  label: string
  className: string
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("inline-block h-5 w-5 bg-current", className)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  )
}

function getStatusColor(disease: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return "text-primary"
  }
  if (disease.severity === "critical") {
    return "text-destructive"
  }
  if (disease.severity === "high") {
    return "text-warning"
  }
  if (disease.severity === "medium") {
    return "text-yellow-500"
  }
  return "text-primary"
}

function getProgressColor(disease: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return "[&>div]:bg-primary"
  }
  if (disease.severity === "critical") {
    return "[&>div]:bg-destructive"
  }
  if (disease.severity === "high") {
    return "[&>div]:bg-warning"
  }
  if (disease.severity === "medium") {
    return "[&>div]:bg-yellow-400"
  }
  return "[&>div]:bg-primary"
}

function getStatusIcon(disease: DiseaseInfo) {
  const colorClass = getStatusColor(disease)

  if (isHealthyDisease(disease)) {
    return <Leaf className={cn("h-5 w-5", colorClass)} />
  }
  if (disease.category === "Plaga") {
    return <Bug className={cn("h-5 w-5", colorClass)} />
  }
  if (disease.category === "Virus") {
    return <Biohazard className={cn("h-5 w-5", colorClass)} />
  }
  if (disease.category === "Bacteria") {
    return <CategoryIcon src="/bacteria2.svg" label="Bacteria" className={colorClass} />
  }
  if (disease.category === "Hongo") {
    return <CategoryIcon src="/mushrooms.svg" label="Hongo" className={colorClass} />
  }
  if (disease.category === "Oomiceto") {
    return <CategoryIcon src="/ameba.svg" label="Oomiceto" className={colorClass} />
  }
  if (disease.severity === "critical") {
    return <AlertCircle className="h-5 w-5 text-destructive" />
  }
  if (disease.severity === "high") {
    return <AlertCircle className="h-5 w-5 text-warning" />
  }
  if (disease.severity === "medium") {
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }
  return <AlertTriangle className="h-5 w-5 text-primary" />
}

function formatPhotoList(group: BatchResultGroup) {
  return group.images.map((image) => `Foto ${image.index}`).join(", ")
}

function getInfectedImageCount(group: BatchResultGroup) {
  return isHealthyDisease(group.disease) ? 0 : group.images.length
}

function sortGroups(groups: BatchResultGroup[], sortMode: GroupSortMode) {
  if (sortMode === "infected") {
    return [...groups].sort((a, b) => {
      const infectedDifference = getInfectedImageCount(b) - getInfectedImageCount(a)

      if (infectedDifference !== 0) {
        return infectedDifference
      }

      const severityDifference =
        diseaseSeverityRank[b.disease.severity] - diseaseSeverityRank[a.disease.severity]

      if (severityDifference !== 0) {
        return severityDifference
      }

      return b.confidence - a.confidence
    })
  }

  if (sortMode === "severity") {
    return [...groups].sort((a, b) => {
      const severityDifference =
        diseaseSeverityRank[b.disease.severity] - diseaseSeverityRank[a.disease.severity]

      if (severityDifference !== 0) {
        return severityDifference
      }

      const infectedDifference = getInfectedImageCount(b) - getInfectedImageCount(a)

      if (infectedDifference !== 0) {
        return infectedDifference
      }

      return b.confidence - a.confidence
    })
  }

  return groups
}

function BatchGroupCard({
  group,
  totalImages,
}: {
  group: BatchResultGroup
  totalImages: number
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = group.images[activeIndex]
  const hasMultipleImages = group.images.length > 1
  const batchShare = totalImages > 0 ? (group.images.length / totalImages) * 100 : 0

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? group.images.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current === group.images.length - 1 ? 0 : current + 1))
  }

  return (
    <Card className="mx-auto max-w-[65rem] overflow-hidden border-border shadow-xl">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="p-5 lg:py-5 lg:pl-5 lg:pr-0">
            <div className="space-y-2.5">
              <div className="relative isolate aspect-square w-full overflow-hidden rounded-lg bg-background/70">
                <img
                  src={activeImage.preview}
                  alt={`Foto ${activeImage.index}: ${activeImage.name}`}
                  className="block h-full w-full rounded-lg object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
                  Foto {activeImage.index}
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
                  {activeIndex + 1} de {group.images.length}
                </div>

                {hasMultipleImages && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-2.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-2.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-border/70 px-3.5 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Confianza de la foto
                </p>
                <p className={cn("mt-1 text-base font-bold", getStatusColor(group.disease))}>
                  {activeImage.confidence.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-7">
            <div className="space-y-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(group.disease)}
                    <span className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
                      Grupo detectado
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {batchShare.toFixed(1)}% del lote
                  </span>
                </div>
                <h3 className={cn("text-[1.35rem] font-bold sm:text-[1.7rem]", getStatusColor(group.disease))}>
                  Se detecto {group.disease.name.toLowerCase()}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] font-medium text-muted-foreground">Confianza promedio</span>
                  <span className={cn("text-base font-bold", getStatusColor(group.disease))}>
                    {group.confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={group.confidence}
                  className={cn("h-2.5", getProgressColor(group.disease))}
                />
              </div>

              <div className="space-y-2.5 border-t border-border pt-3.5">
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                  <Images className="h-3.5 w-3.5" />
                  {group.images.length} {group.images.length === 1 ? "foto asignada" : "fotos asignadas"}
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/80">
                  {formatPhotoList(group)}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-[13px] font-semibold text-foreground">Que es</h4>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {group.disease.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[13px] font-semibold text-foreground">Sintomas comunes</h4>
                  <ul className="mt-1.5 space-y-1.5">
                    {group.disease.symptoms.slice(0, 3).map((symptom) => (
                      <li key={symptom} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-semibold text-foreground">Que hacer</h4>
                <ul className="mt-1.5 grid gap-1.5 md:grid-cols-2">
                  {group.disease.recommendations.slice(0, 4).map((recommendation, index) => (
                    <li key={recommendation} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <span className="flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-secondary/60 p-3.5">
                <h4 className="text-[13px] font-semibold text-foreground">Importante</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
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
  const [sortMode, setSortMode] = useState<GroupSortMode>("default")
  const displayGroups = sortGroups(groups, sortMode)
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
      <Card className="mx-auto max-w-[65rem] border-border/70 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Organizar grupos
            </p>
            <p className="text-sm text-muted-foreground">
              Ordena por hojas afectadas o por severidad del grupo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={sortMode === "default" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode("default")}
            >
              Vista original
            </Button>
            <Button
              type="button"
              variant={sortMode === "infected" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode("infected")}
            >
              Mas infectadas
            </Button>
            <Button
              type="button"
              variant={sortMode === "severity" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode("severity")}
            >
              Mayor severidad
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-[65rem] border-primary/20 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/45 shadow-lg">
        <CardContent className="p-2.5">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2 sm:p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Grupos
              </p>
              <p className="mt-1 text-lg font-bold leading-none text-foreground sm:text-[1.35rem]">
                {groups.length}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2 sm:p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <span className="sm:hidden">Fotos</span>
                <span className="hidden sm:inline">Fotos analizadas</span>
              </p>
              <p className="mt-1 text-lg font-bold leading-none text-foreground sm:text-[1.35rem]">
                {totalImages}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2 sm:p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Clase dominante
              </p>
              <p className="mt-1 text-[13px] font-bold leading-tight text-foreground sm:text-sm md:text-[15px]">
                {dominantGroup?.disease.name ?? "Sin resultados"}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-border/70 bg-background/85 p-2 sm:p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Confianza lote
              </p>
              <p className="mt-1 text-lg font-bold leading-none text-primary sm:text-[1.35rem]">
                {averageBatchConfidence.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {displayGroups.map((group) => (
        <BatchGroupCard key={group.disease.id} group={group} totalImages={totalImages} />
      ))}
    </div>
  )
}
