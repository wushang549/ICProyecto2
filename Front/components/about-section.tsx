import Image from "next/image"
import { assetPath } from "@/lib/asset-path"
import { diseaseList } from "@/lib/disease-data"

const trackedDiseases = diseaseList.filter((disease) => disease.severity !== "healthy")
const healthyState = diseaseList.find((disease) => disease.severity === "healthy")

const features = [
  {
    image: "/microscopio.png",
    imageAlt: "Microscopio",
    title: "Análisis visual",
    description: "Revisa patrones visibles en la hoja para orientar una primera evaluación.",
  },
  {
    image: "/hoja.png",
    imageAlt: "Hoja de tomate",
    title: "Enfoque agrícola",
    description: "Presenta síntomas y recomendaciones útiles para el cuidado de plantas de tomate.",
  },
  {
    image: "/escudo.png",
    imageAlt: "Escudo de protección",
    title: "Detección temprana",
    description: "Ayuda a tomar decisiones antes de que una enfermedad avance en el cultivo.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Acerca de Tomate Sano
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Tomate Sano es una herramienta para apoyar la revisión de hojas de tomate
              y reconocer posibles señales de enfermedad a partir de una imagen.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              La detección temprana puede ayudar a proteger el cultivo, reducir pérdidas y decidir
              qué acciones tomar antes de que el problema se extienda.
            </p>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-foreground">
                Enfermedades consideradas
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {trackedDiseases.map((disease) => (
                  <li key={disease.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {disease.name}
                  </li>
                ))}
              </ul>
              {healthyState && (
                <p className="mt-4 text-sm text-muted-foreground">
                  También contempla el estado: <span className="font-medium text-foreground">{healthyState.name}</span>.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-background p-6 ring-1 ring-border transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10">
                    <Image
                      src={assetPath(feature.image)}
                      alt={feature.imageAlt}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
