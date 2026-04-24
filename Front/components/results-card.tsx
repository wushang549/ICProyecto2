"use client"

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PredictionEntry } from "@/lib/batch-analysis"
import { cn } from "@/lib/utils"
import { diseaseData, isHealthyDisease, type DiseaseInfo } from "@/lib/disease-data"

interface ResultsCardProps {
  imagePreview: string
  predictions: PredictionEntry[]
}

function formatDiseaseName(className: string): string {
  const fallbackName = className
    .replace(/^Tomato_+/, "")
    .replace(/_/g, " ")
    .trim()

  return diseaseData[className]?.name ?? fallbackName
}

function formatAlternativePredictions(predictions: PredictionEntry[]) {
  const alternativePredictions = predictions
    .slice(1)
    .filter((prediction) => prediction.confidence >= 0.01)
    .slice(0, 2)

  if (alternativePredictions.length === 0) {
    return "No hay clases alternativas disponibles."
  }

  return `Tambien pudo ser: ${alternativePredictions
    .map((prediction) => `${formatDiseaseName(prediction.className)} ${prediction.confidence.toFixed(1)}%`)
    .join(" | ")}`
}

function getStatusIcon(disease?: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return <CheckCircle2 className="h-6 w-6 text-primary" />
  }
  if (disease?.severity === "critical") {
    return <AlertCircle className="h-6 w-6 text-destructive" />
  }
  if (disease?.severity === "high") {
    return <AlertCircle className="h-6 w-6 text-warning" />
  }
  if (disease?.severity === "medium") {
    return <AlertTriangle className="h-6 w-6 text-yellow-500" />
  }
  return <AlertTriangle className="h-6 w-6 text-primary" />
}

function getStatusColor(disease?: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return "text-primary"
  }
  if (disease?.severity === "critical") {
    return "text-destructive"
  }
  if (disease?.severity === "high") {
    return "text-warning"
  }
  if (disease?.severity === "medium") {
    return "text-yellow-500"
  }
  return "text-primary"
}

function getProgressColor(disease?: DiseaseInfo) {
  if (isHealthyDisease(disease)) {
    return "[&>div]:bg-primary"
  }
  if (disease?.severity === "critical") {
    return "[&>div]:bg-destructive"
  }
  if (disease?.severity === "high") {
    return "[&>div]:bg-warning"
  }
  if (disease?.severity === "medium") {
    return "[&>div]:bg-yellow-400"
  }
  return "[&>div]:bg-primary"
}

export function ResultsCard({ imagePreview, predictions }: ResultsCardProps) {
  const mainPrediction = predictions[0]

  if (!mainPrediction) {
    return null
  }

  const mainDisease = diseaseData[mainPrediction.className]
  const confidenceHoverText = formatAlternativePredictions(predictions)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="mx-auto max-w-6xl overflow-hidden border-border shadow-xl">
        <CardContent className="p-0">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative bg-secondary/30 p-6 md:py-6 md:pl-6 md:pr-0">
              <div className="relative isolate aspect-square w-full overflow-hidden rounded-lg bg-background/70">
                <img
                  src={imagePreview}
                  alt="Hoja de tomate analizada"
                  className="block h-full w-full rounded-lg object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
                  Imagen subida
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(mainDisease)}
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Diagnostico
                    </span>
                  </div>
                  <h3 className={cn("text-2xl font-bold sm:text-3xl", getStatusColor(mainDisease))}>
                    {isHealthyDisease(mainDisease)
                      ? mainDisease.name
                      : `Se detecto ${formatDiseaseName(mainPrediction.className).toLowerCase()}`}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confianza</span>
                    <span
                      title={confidenceHoverText}
                      className={cn(
                        "cursor-help text-lg font-bold underline decoration-dotted underline-offset-4",
                        getStatusColor(mainDisease),
                      )}
                    >
                      {mainPrediction.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={mainPrediction.confidence}
                    className={cn("h-3", getProgressColor(mainDisease))}
                  />
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-sm font-medium text-muted-foreground">Otras posibilidades</span>
                  <div className="space-y-2">
                    {predictions.slice(1).map((prediction) => (
                      <div
                        key={prediction.className}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground/80">
                          {formatDiseaseName(prediction.className)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={prediction.confidence}
                            className="h-1.5 w-20 [&>div]:bg-muted-foreground/40"
                          />
                          <span className="w-12 text-right text-muted-foreground">
                            {prediction.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {mainDisease && (
        <Card className="mx-auto max-w-6xl border-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-foreground">Que es</h4>
                  <p className="leading-relaxed text-muted-foreground">
                    {mainDisease.description}
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-foreground">Sintomas comunes</h4>
                  <ul className="space-y-2">
                    {mainDisease.symptoms.map((symptom) => (
                      <li key={symptom} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Que hacer</h4>
                <ul className="space-y-3">
                  {mainDisease.recommendations.map((recommendation, index) => (
                    <li key={recommendation} className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-muted-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg bg-secondary/60 p-4">
                  <h4 className="text-sm font-semibold text-foreground">Importante</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {mainDisease.important}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
