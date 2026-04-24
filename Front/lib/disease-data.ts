export type DiseaseSeverity = "low" | "medium" | "high" | "critical"

export interface DiseaseInfo {
  id: string
  name: string
  category: string
  severity: DiseaseSeverity
  description: string
  symptoms: string[]
  recommendations: string[]
  important: string
}

export const diseaseSeverityRank: Record<DiseaseSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

export function isHealthyDisease(
  disease?: Pick<DiseaseInfo, "id" | "category"> | null,
) {
  return disease?.id === "Tomato_healthy" || disease?.category === "Estado saludable"
}

export const diseaseList: DiseaseInfo[] = [
  {
    id: "Tomato_Bacterial_spot",
    name: "Mancha bacteriana",
    category: "Bacteria",
    severity: "high",
    description:
      "Es una enfermedad bacteriana que afecta principalmente las hojas y, en algunos casos, también frutos y tallos del tomate. Suele propagarse con mayor facilidad en ambientes húmedos y con salpicaduras de agua.",
    symptoms: [
      "Pequeñas manchas oscuras en las hojas",
      "Lesiones con apariencia húmeda al inicio",
      "Manchas que se agrandan con el tiempo",
      "Amarillamiento alrededor de algunas lesiones",
      "Daño visible también en frutos en casos avanzados",
    ],
    recommendations: [
      "Retira las hojas más afectadas para reducir la propagación.",
      "Evita mojar el follaje al regar.",
      "Mejora la ventilación entre plantas.",
      "Desinfecta herramientas de poda y trabajo.",
      "Elimina residuos vegetales infectados al final del ciclo.",
    ],
    important:
      "La humedad constante favorece mucho esta enfermedad, por lo que el manejo del riego y la ventilación es clave para su prevención.",
  },
  {
    id: "Tomato_Early_blight",
    name: "Tizón temprano",
    category: "Hongo",
    severity: "high",
    description:
      "Es una enfermedad fúngica frecuente en tomate que afecta sobre todo hojas viejas, aunque también puede presentarse en tallos y frutos. Suele aparecer cuando hay humedad alta y la planta se encuentra estresada.",
    symptoms: [
      "Manchas oscuras o marrones en las hojas",
      "Anillos concéntricos dentro de las lesiones",
      "Amarillamiento alrededor de las manchas",
      "Secado progresivo de hojas inferiores",
      "Caída de hojas si la infección avanza",
    ],
    recommendations: [
      "Retira hojas enfermas en cuanto detectes los primeros síntomas.",
      "Evita acumulación de humedad en el follaje.",
      "Mantén buena separación entre plantas.",
      "Retira restos de cultivo del suelo.",
      "Vigila con frecuencia las hojas inferiores, donde suele iniciar.",
    ],
    important:
      "Puede confundirse con otras enfermedades foliares, pero las lesiones en forma de “anillos” suelen ser una señal característica.",
  },
  {
    id: "Tomato_Late_blight",
    name: "Tizón tardío",
    category: "Oomiceto",
    severity: "critical",
    description:
      "Es una enfermedad muy agresiva que puede avanzar rápidamente en condiciones de alta humedad y temperaturas frescas a templadas. Puede afectar hojas, tallos y frutos, causando pérdidas severas si no se detecta a tiempo.",
    symptoms: [
      "Manchas grandes e irregulares de color oscuro",
      "Apariencia húmeda o marchita en zonas afectadas",
      "Bordes difusos en las lesiones",
      "Colapso rápido de hojas y tallos",
      "Deterioro acelerado de la planta completa",
    ],
    recommendations: [
      "Aísla o retira las partes muy afectadas lo antes posible.",
      "Evita riego por aspersión o exceso de humedad.",
      "Revisa constantemente plantas cercanas.",
      "Mejora circulación de aire en el cultivo.",
      "Elimina residuos infectados para reducir reinfección.",
    ],
    important:
      "Es una de las enfermedades más destructivas del tomate y puede avanzar muy rápido, por lo que la detección temprana es especialmente importante.",
  },
  {
    id: "Tomato_Leaf_Mold",
    name: "Moho de la hoja",
    category: "Hongo",
    severity: "medium",
    description:
      "Es una enfermedad fúngica que se desarrolla principalmente en ambientes con alta humedad y poca ventilación, especialmente en cultivos protegidos o invernaderos. Afecta sobre todo las hojas.",
    symptoms: [
      "Manchas amarillentas en la parte superior de la hoja",
      "Moho o recubrimiento en la parte inferior",
      "Lesiones que se expanden con el tiempo",
      "Hojas que se secan gradualmente",
      "Pérdida de vigor si la infección aumenta",
    ],
    recommendations: [
      "Reduce la humedad ambiental en lo posible.",
      "Mejora la ventilación entre plantas.",
      "Retira hojas con daño severo.",
      "Evita exceso de follaje denso.",
      "Monitorea con más cuidado las hojas interiores y bajas.",
    ],
    important:
      "La ventilación deficiente favorece mucho su aparición, así que el manejo del ambiente puede hacer una gran diferencia.",
  },
  {
    id: "Tomato_Septoria_leaf_spot",
    name: "Mancha foliar por septoria",
    category: "Hongo",
    severity: "high",
    description:
      "Es una enfermedad fúngica que afecta principalmente las hojas del tomate y suele comenzar en las partes bajas de la planta. Es común en condiciones húmedas y puede causar defoliación importante.",
    symptoms: [
      "Muchas manchas pequeñas y redondas",
      "Centro gris o claro en algunas lesiones",
      "Bordes oscuros bien definidos",
      "Amarillamiento de hojas afectadas",
      "Caída de hojas inferiores conforme progresa",
    ],
    recommendations: [
      "Retira hojas infectadas desde etapas tempranas.",
      "Evita salpicaduras de agua desde el suelo.",
      "Mantén limpio el entorno del cultivo.",
      "Mejora la ventilación entre plantas.",
      "Retira residuos vegetales después de la cosecha.",
    ],
    important:
      "Puede confundirse con otras manchas foliares, pero suele presentar lesiones más pequeñas y numerosas que se concentran primero en hojas bajas.",
  },
  {
    id: "Tomato_Spider_mites_Two_spotted_spider_mite",
    name: "Daño por araña roja",
    category: "Plaga",
    severity: "medium",
    description:
      "No se trata de un hongo o virus, sino de una plaga de ácaros que se alimentan del tejido de la hoja. Su presencia suele aumentar en ambientes secos y cálidos.",
    symptoms: [
      "Punteado claro o amarillento en la hoja",
      "Aspecto deslavado o bronceado",
      "Pérdida progresiva de color verde",
      "Presencia de finas telarañas en infestaciones severas",
      "Debilitamiento general de la planta",
    ],
    recommendations: [
      "Revisa con frecuencia el envés de las hojas.",
      "Retira hojas muy afectadas si la infestación es fuerte.",
      "Reduce el estrés de la planta por calor o sequedad extrema.",
      "Aísla plantas muy infestadas si es posible.",
      "Mantén monitoreo constante para actuar temprano.",
    ],
    important:
      "Como es una plaga y no una enfermedad, su manejo se enfoca más en control y monitoreo del insecto que en lesiones infecciosas.",
  },
  {
    id: "Tomato__Target_Spot",
    name: "Mancha objetivo",
    category: "Hongo",
    severity: "medium",
    description:
      "Es una enfermedad que afecta las hojas del tomate y produce lesiones redondas que pueden parecerse a otras manchas foliares. Suele desarrollarse con humedad alta y condiciones favorables para la infección.",
    symptoms: [
      "Manchas circulares en las hojas",
      "Anillos concéntricos tipo diana",
      "Lesiones que aumentan de tamaño",
      "Amarillamiento alrededor de algunas manchas",
      "Defoliación si el daño progresa",
    ],
    recommendations: [
      "Retira hojas con lesiones severas.",
      "Evita humedad persistente sobre el follaje.",
      "Mejora ventilación y entrada de luz.",
      "Desinfecta herramientas de poda.",
      "Retira residuos vegetales al terminar el ciclo.",
    ],
    important:
      "Puede confundirse con tizón temprano u otras manchas foliares, por lo que conviene interpretar el resultado del modelo como apoyo y no como diagnóstico absoluto.",
  },
  {
    id: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    name: "Virus del rizado amarillo de la hoja",
    category: "Virus",
    severity: "critical",
    description:
      "Es una enfermedad viral que afecta gravemente el desarrollo del tomate. Suele estar asociada a insectos vectores y puede reducir notablemente el crecimiento y la producción de la planta.",
    symptoms: [
      "Hojas amarillentas o pálidas",
      "Enrollamiento hacia arriba",
      "Deformación en hojas nuevas",
      "Crecimiento reducido de la planta",
      "Menor desarrollo general y menor producción",
    ],
    recommendations: [
      "Retira plantas muy afectadas para evitar mayor dispersión.",
      "Monitorea y controla insectos vectores en el cultivo.",
      "Revisa con frecuencia brotes tiernos y hojas nuevas.",
      "Mantén limpio el entorno de malezas hospederas.",
      "Aísla focos de infección cuando sea posible.",
    ],
    important:
      "Las enfermedades virales no suelen revertirse una vez establecidas, por lo que la prevención y el control temprano del vector son fundamentales.",
  },
  {
    id: "Tomato__Tomato_mosaic_virus",
    name: "Virus del mosaico del tomate",
    category: "Virus",
    severity: "high",
    description:
      "Es una enfermedad viral que altera la apariencia y el desarrollo normal de la planta. Puede afectar hojas, crecimiento y producción, y suele persistir si no se toman medidas de higiene.",
    symptoms: [
      "Patrón irregular de manchas verdes y amarillas",
      "Apariencia de mosaico en las hojas",
      "Deformación o arrugamiento",
      "Crecimiento desigual o reducido",
      "Menor vigor de la planta",
    ],
    recommendations: [
      "Retira plantas o partes muy afectadas.",
      "Lava y desinfecta herramientas y manos al manipular plantas.",
      "Evita mover material infectado entre plantas sanas.",
      "Revisa frecuentemente síntomas en hojas jóvenes.",
      "Mantén buenas prácticas de higiene durante el manejo del cultivo.",
    ],
    important:
      "Los virus pueden propagarse por contacto mecánico, así que la higiene durante poda, trasplante y revisión del cultivo es muy importante.",
  },
  {
    id: "Tomato_healthy",
    name: "Hoja saludable",
    category: "Estado saludable",
    severity: "low",
    description:
      "Corresponde a una hoja de tomate sin señales visibles de enfermedad o daño importante. Una hoja saludable suele indicar que la planta se encuentra en buen estado general.",
    symptoms: [
      "Color verde uniforme",
      "Superficie sin manchas relevantes",
      "Bordes normales y sin deformaciones",
      "Buena textura y firmeza",
      "Ausencia de moho, mosaicos o necrosis",
    ],
    recommendations: [
      "Mantén riego adecuado sin exceso de humedad.",
      "Revisa periódicamente hojas nuevas y viejas.",
      "Conserva buena ventilación entre plantas.",
      "Limpia herramientas antes y después de usarlas.",
      "Retira hojas secas o residuos para prevenir enfermedades futuras.",
    ],
    important:
      "Aunque la hoja se vea sana, es recomendable seguir monitoreando la planta, ya que algunas enfermedades pueden comenzar con síntomas muy leves.",
  },
]

export const diseaseData = Object.fromEntries(
  diseaseList.map((disease) => [disease.id, disease]),
) as Record<string, DiseaseInfo>

export const mockPredictions = [
  {
    id: "Tomato_healthy",
    predictions: [
      { class: "Tomato_healthy", confidence: 96.8 },
      { class: "Tomato_Early_blight", confidence: 1.9 },
      { class: "Tomato_Septoria_leaf_spot", confidence: 0.8 },
    ],
  },
  {
    id: "Tomato_Bacterial_spot",
    predictions: [
      { class: "Tomato_Bacterial_spot", confidence: 89.7 },
      { class: "Tomato_Septoria_leaf_spot", confidence: 6.4 },
      { class: "Tomato_Early_blight", confidence: 2.8 },
    ],
  },
  {
    id: "Tomato_Early_blight",
    predictions: [
      { class: "Tomato_Early_blight", confidence: 91.5 },
      { class: "Tomato_Septoria_leaf_spot", confidence: 5.2 },
      { class: "Tomato__Target_Spot", confidence: 2.1 },
    ],
  },
  {
    id: "Tomato_Late_blight",
    predictions: [
      { class: "Tomato_Late_blight", confidence: 94.2 },
      { class: "Tomato_Early_blight", confidence: 3.1 },
      { class: "Tomato_Leaf_Mold", confidence: 1.8 },
    ],
  },
  {
    id: "Tomato_Leaf_Mold",
    predictions: [
      { class: "Tomato_Leaf_Mold", confidence: 88.4 },
      { class: "Tomato_Septoria_leaf_spot", confidence: 6.9 },
      { class: "Tomato_Late_blight", confidence: 2.6 },
    ],
  },
  {
    id: "Tomato_Septoria_leaf_spot",
    predictions: [
      { class: "Tomato_Septoria_leaf_spot", confidence: 90.1 },
      { class: "Tomato_Early_blight", confidence: 4.8 },
      { class: "Tomato_Bacterial_spot", confidence: 3.2 },
    ],
  },
  {
    id: "Tomato_Spider_mites_Two_spotted_spider_mite",
    predictions: [
      { class: "Tomato_Spider_mites_Two_spotted_spider_mite", confidence: 87.6 },
      { class: "Tomato_healthy", confidence: 5.5 },
      { class: "Tomato_Leaf_Mold", confidence: 3.4 },
    ],
  },
  {
    id: "Tomato__Target_Spot",
    predictions: [
      { class: "Tomato__Target_Spot", confidence: 86.9 },
      { class: "Tomato_Early_blight", confidence: 7.2 },
      { class: "Tomato_Septoria_leaf_spot", confidence: 3.9 },
    ],
  },
  {
    id: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    predictions: [
      { class: "Tomato__Tomato_YellowLeaf__Curl_Virus", confidence: 92.7 },
      { class: "Tomato__Tomato_mosaic_virus", confidence: 3.8 },
      { class: "Tomato_healthy", confidence: 1.7 },
    ],
  },
  {
    id: "Tomato__Tomato_mosaic_virus",
    predictions: [
      { class: "Tomato__Tomato_mosaic_virus", confidence: 90.8 },
      { class: "Tomato__Tomato_YellowLeaf__Curl_Virus", confidence: 4.1 },
      { class: "Tomato_healthy", confidence: 2.4 },
    ],
  },
]

export function getRandomPrediction() {
  const randomIndex = Math.floor(Math.random() * mockPredictions.length)
  return mockPredictions[randomIndex]
}
