"use client"

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { diseaseData, type DiseaseInfo } from "@/lib/disease-data"

interface Prediction {
  class: string
  confidence: number
}

interface ResultsCardProps {
  imagePreview: string
  predictions: Prediction[]
}

function formatDiseaseName(className: string): string {
  const fallbackName = className
    .replace(/^Tomato_+/, "")
    .replace(/_/g, " ")
    .trim()

  return diseaseData[className]?.name ?? fallbackName
}

function getStatusIcon(disease?: DiseaseInfo) {
  if (disease?.severity === "healthy") {
    return <CheckCircle2 className="h-6 w-6 text-primary" />
  }
  if (disease?.severity === "high") {
    return <AlertCircle className="h-6 w-6 text-destructive" />
  }
  return <AlertTriangle className="h-6 w-6 text-warning" />
}

function getStatusColor(disease?: DiseaseInfo) {
  if (disease?.severity === "healthy") {
    return "text-primary"
  }
  if (disease?.severity === "high") {
    return "text-destructive"
  }
  return "text-warning"
}

function getProgressColor(disease?: DiseaseInfo) {
  if (disease?.severity === "healthy") {
    return "[&>div]:bg-primary"
  }
  if (disease?.severity === "high") {
    return "[&>div]:bg-destructive"
  }
  return "[&>div]:bg-warning"
}

export function ResultsCard({ imagePreview, predictions }: ResultsCardProps) {
  const mainPrediction = predictions[0]
  const mainDisease = diseaseData[mainPrediction.class]

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
                      Diagnóstico
                    </span>
                  </div>
                  <h3 className={cn("text-2xl font-bold sm:text-3xl", getStatusColor(mainDisease))}>
                    {mainDisease?.severity === "healthy"
                      ? mainDisease.name
                      : `Se detectó ${formatDiseaseName(mainPrediction.class).toLowerCase()}`}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confianza</span>
                    <span className={cn("text-lg font-bold", getStatusColor(mainDisease))}>
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
                    {predictions.slice(1).map((pred) => (
                      <div key={pred.class} className="flex items-center justify-between text-sm">
                        <span className="text-foreground/80">{formatDiseaseName(pred.class)}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={pred.confidence}
                            className="h-1.5 w-20 [&>div]:bg-muted-foreground/40"
                          />
                          <span className="w-12 text-right text-muted-foreground">
                            {pred.confidence.toFixed(1)}%
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
                  <h4 className="mb-2 text-lg font-semibold text-foreground">Qué es</h4>
                  <p className="leading-relaxed text-muted-foreground">
                    {mainDisease.description}
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-foreground">Síntomas comunes</h4>
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
                <h4 className="text-lg font-semibold text-foreground">Qué hacer</h4>
                <ul className="space-y-3">
                  {mainDisease.recommendations.map((rec, index) => (
                    <li key={rec} className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-muted-foreground">{rec}</span>
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
