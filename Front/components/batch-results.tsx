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
  diseaseData,
  diseaseSeverityRank,
  isHealthyDisease,
  type DiseaseInfo,
} from "@/lib/disease-data"
import { cn } from "@/lib/utils"

interface BatchResultsProps {
  groups: BatchResultGroup[]
}

type GroupSortMode = "infected" | "severity"

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

function getSoftStatusClasses(disease: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return "border-primary/20 bg-primary/8 text-primary"
  }
  if (disease.severity === "critical") {
    return "border-destructive/20 bg-destructive/8 text-destructive"
  }
  if (disease.severity === "high") {
    return "border-warning/20 bg-warning/10 text-warning"
  }
  if (disease.severity === "medium") {
    return "border-yellow-400/25 bg-yellow-400/10 text-yellow-600"
  }
  return "border-primary/20 bg-primary/8 text-primary"
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

function formatAlternativePredictions(group: BatchResultGroup, activeIndex: number) {
  const alternativePredictions =
    group.images[activeIndex]?.predictions
      .slice(1)
      .filter((prediction) => prediction.confidence >= 0.01)
      .slice(0, 2) ?? []

  if (alternativePredictions.length === 0) {
    return "No hay clases alternativas disponibles."
  }

  return `Tambien pudo ser: ${alternativePredictions
    .map((prediction) => `${diseaseData[prediction.className]?.name ?? prediction.className} ${prediction.confidence.toFixed(1)}%`)
    .join(" | ")}`
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

function InfoQuadrant({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border/70 bg-background/70 px-2.5 py-2", className)}>
      <h4 className="text-[12px] font-semibold text-foreground">{title}</h4>
      <div className="mt-1">{children}</div>
    </div>
  )
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
  const confidenceHoverText = formatAlternativePredictions(group, activeIndex)

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? group.images.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current === group.images.length - 1 ? 0 : current + 1))
  }

  return (
    <Card className="mx-auto max-w-[65rem] overflow-hidden border-border py-2 shadow-xl">
      <CardContent className="px-3 py-2.5 sm:px-3.5 sm:py-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="rounded-xl border border-border/70 bg-background/70 px-2.5 py-2">
            <div className="space-y-2">
              <div className="relative isolate aspect-[17/9] w-full overflow-hidden rounded-lg bg-background/70">
                <img
                  src={activeImage.preview}
                  alt={`Foto ${activeImage.index}: ${activeImage.name}`}
                  className="block h-full w-full rounded-lg object-cover"
                />
                <div className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                  Foto {activeImage.index}
                </div>
                <div className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                  {activeIndex + 1} de {group.images.length}
                </div>

                {hasMultipleImages && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-1.5 top-1/2 h-6.5 w-6.5 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-1.5 top-1/2 h-6.5 w-6.5 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur-sm"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="rounded-lg border border-border/70 px-2.5 py-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Confianza de la foto
                  </p>
                  <p
                    title={confidenceHoverText}
                    className={cn(
                      "cursor-help whitespace-nowrap text-[14px] font-bold underline decoration-dotted underline-offset-4",
                      getStatusColor(group.disease),
                    )}
                  >
                    {activeImage.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2.5">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(group.disease)}
                    <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Grupo detectado
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {batchShare.toFixed(1)}% del lote
                  </span>
                </div>
                <h3 className={cn("text-[1.12rem] font-bold leading-tight sm:text-[1.35rem]", getStatusColor(group.disease))}>
                  Se detecto {group.disease.name.toLowerCase()}
                </h3>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-medium text-muted-foreground">Confianza promedio</span>
                  <span className={cn("text-[15px] font-bold", getStatusColor(group.disease))}>
                    {group.confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={group.confidence}
                  className={cn("h-1.5", getProgressColor(group.disease))}
                />
              </div>

              <div className="space-y-1.5 border-t border-border pt-2">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                  <Images className="h-3 w-3" />
                  {group.images.length} {group.images.length === 1 ? "foto asignada" : "fotos asignadas"}
                </div>
                <p className="text-[12px] leading-relaxed text-foreground/80">
                  {formatPhotoList(group)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:col-span-2">
            <InfoQuadrant title="Que es">
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {group.disease.description}
              </p>
            </InfoQuadrant>

            <InfoQuadrant title="Sintomas comunes">
              <ul className="space-y-1">
                {group.disease.symptoms.slice(0, 4).map((symptom) => (
                  <li key={symptom} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </InfoQuadrant>

            <InfoQuadrant title="Que Hacer">
              <ul className="space-y-1">
                {group.disease.recommendations.slice(0, 4).map((recommendation, index) => (
                  <li key={recommendation} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </InfoQuadrant>

            <InfoQuadrant
              title="Importante"
              className={getSoftStatusClasses(group.disease)}
            >
              <p className="text-[12px] leading-relaxed text-foreground">
                {group.disease.important}
              </p>
            </InfoQuadrant>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BatchResults({ groups }: BatchResultsProps) {
  const [sortMode, setSortMode] = useState<GroupSortMode>("severity")
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
      <Card className="mx-auto max-w-[65rem] border-border/70 py-2 shadow-sm">
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
              variant={sortMode === "severity" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode("severity")}
            >
              Mayor severidad
            </Button>
            <Button
              type="button"
              variant={sortMode === "infected" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortMode("infected")}
            >
              Mas infectadas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-[65rem] border-primary/20 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/45 py-2 shadow-lg">
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
