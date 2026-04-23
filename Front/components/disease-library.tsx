import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { diseaseList, type DiseaseInfo } from "@/lib/disease-data"
import { cn } from "@/lib/utils"

function getSeverityLabel(severity: DiseaseInfo["severity"]) {
  if (severity === "healthy") {
    return "Sano"
  }
  if (severity === "high") {
    return "Atención alta"
  }
  return "Atención media"
}

function getSeverityIcon(severity: DiseaseInfo["severity"]) {
  if (severity === "healthy") {
    return <CheckCircle2 className="h-4 w-4" />
  }
  if (severity === "high") {
    return <AlertCircle className="h-4 w-4" />
  }
  return <AlertTriangle className="h-4 w-4" />
}

function getSeverityClass(severity: DiseaseInfo["severity"]) {
  if (severity === "healthy") {
    return "bg-primary/10 text-primary"
  }
  if (severity === "high") {
    return "bg-destructive/10 text-destructive"
  }
  return "bg-warning/15 text-warning"
}

export function DiseaseLibrary() {
  return (
    <section id="diseases" className="border-t border-border bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Catálogo preparado
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Enfermedades y estados que cubrirá Tomate Sano
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Esta información queda lista para mostrarse junto con cada clase del conjunto
            de datos cuando conectes el análisis real.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {diseaseList.map((disease) => (
            <Card key={disease.id} className="border-border shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {disease.category}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">
                      {disease.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                      getSeverityClass(disease.severity),
                    )}
                  >
                    {getSeverityIcon(disease.severity)}
                    {getSeverityLabel(disease.severity)}
                  </span>
                </div>

                <p className="leading-relaxed text-muted-foreground">
                  {disease.description}
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Síntomas</h4>
                    <ul className="mt-3 space-y-2">
                      {disease.symptoms.map((symptom) => (
                        <li key={symptom} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Qué hacer</h4>
                    <ul className="mt-3 space-y-2">
                      {disease.recommendations.map((recommendation) => (
                        <li key={recommendation} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warning" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/60 p-4">
                  <h4 className="text-sm font-semibold text-foreground">Importante</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {disease.important}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
