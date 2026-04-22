export type DiseaseSeverity = "healthy" | "moderate" | "high"

export interface DiseaseInfo {
  id: string
  name: string
  category: string
  severity: DiseaseSeverity
  description: string
  symptoms: string[]
  recommendations: string[]
}

export const diseaseList: DiseaseInfo[] = [
  {
    id: "Tomato_healthy",
    name: "Hoja sana",
    category: "Estado saludable",
    severity: "healthy",
    description:
      "La hoja se ve en buen estado: mantiene coloracion uniforme, estructura firme y no muestra manchas, lesiones ni deformaciones importantes.",
    symptoms: [
      "Color verde uniforme",
      "Sin manchas, lesiones ni moho visible",
      "Forma y textura normales",
      "Sin marchitamiento, enrollamiento o decoloracion fuerte",
    ],
    recommendations: [
      "Mantener riego regular sin encharcar el suelo",
      "Revisar hojas y tallos cada semana",
      "Favorecer buena ventilacion entre plantas",
      "Retirar hojas viejas o danadas para reducir focos de infeccion",
    ],
  },
  {
    id: "Tomato_Bacterial_spot",
    name: "Mancha bacteriana",
    category: "Bacteria",
    severity: "moderate",
    description:
      "Enfermedad causada por bacterias del genero Xanthomonas. Produce lesiones pequenas y oscuras en hojas, tallos y frutos, y suele propagarse por salpicaduras de agua.",
    symptoms: [
      "Puntos pequenos, oscuros y de aspecto humedo",
      "Manchas que pueden volverse cafes o negras",
      "Halos amarillos alrededor de algunas lesiones",
      "Marcas rugosas o costrosas en frutos",
    ],
    recommendations: [
      "Evitar mojar las hojas al regar",
      "Retirar hojas muy afectadas y desecharlas fuera del cultivo",
      "Desinfectar herramientas despues de podar",
      "Usar semillas o plantulas certificadas cuando sea posible",
      "Aplicar productos a base de cobre solo siguiendo la etiqueta",
    ],
  },
  {
    id: "Tomato_Early_blight",
    name: "Tizon temprano",
    category: "Hongo",
    severity: "moderate",
    description:
      "Enfermedad fungica causada por Alternaria solani. Normalmente inicia en hojas viejas y genera manchas con anillos concentricos, parecidas a una diana.",
    symptoms: [
      "Manchas cafes con anillos concentricos",
      "Halos amarillos alrededor de las manchas",
      "Inicio frecuente en hojas inferiores o viejas",
      "Caida prematura de hojas si avanza",
    ],
    recommendations: [
      "Retirar hojas infectadas lo antes posible",
      "Regar en la base para mantener seco el follaje",
      "Mejorar la separacion entre plantas",
      "Usar acolchado para evitar salpicaduras de tierra",
      "Rotar cultivos y evitar sembrar tomate repetidamente en el mismo sitio",
    ],
  },
  {
    id: "Tomato_Late_blight",
    name: "Tizon tardio",
    category: "Oomiceto",
    severity: "high",
    description:
      "Enfermedad agresiva causada por Phytophthora infestans. Puede avanzar rapido en ambientes frescos y humedos, afectando hojas, tallos y frutos.",
    symptoms: [
      "Manchas grandes de apariencia humeda",
      "Bordes gris verdoso o cafe oscuro",
      "Moho blanquecino en el reverso de hojas con alta humedad",
      "Deterioro rapido de hojas, tallos o frutos",
    ],
    recommendations: [
      "Aislar o retirar plantas muy afectadas",
      "Eliminar material infectado y no compostarlo",
      "Reducir humedad y mejorar ventilacion",
      "Evitar riego por aspersion",
      "Consultar tratamiento local si el avance es rapido",
    ],
  },
  {
    id: "Tomato_Leaf_Mold",
    name: "Moho de hoja",
    category: "Hongo",
    severity: "moderate",
    description:
      "Enfermedad causada por Passalora fulva. Es comun en lugares con alta humedad y poca circulacion de aire, especialmente invernaderos.",
    symptoms: [
      "Manchas verde palido o amarillas en la parte superior",
      "Moho velloso verde olivo o cafe en el reverso",
      "Hojas que se enrollan o marchitan",
      "Mayor presencia en ambientes cerrados y humedos",
    ],
    recommendations: [
      "Aumentar ventilacion de inmediato",
      "Reducir humedad, sobre todo en invernadero",
      "Retirar hojas afectadas",
      "Separar plantas para mejorar flujo de aire",
      "Evitar mojar las hojas durante el riego",
    ],
  },
  {
    id: "Tomato_Septoria_leaf_spot",
    name: "Mancha foliar por Septoria",
    category: "Hongo",
    severity: "moderate",
    description:
      "Enfermedad fungica causada por Septoria lycopersici. Produce muchas manchas pequenas, circulares, con bordes oscuros y centros claros.",
    symptoms: [
      "Manchas pequenas y circulares",
      "Bordes oscuros con centro gris o beige",
      "Puntos negros diminutos en el centro de algunas manchas",
      "Amarillamiento y caida de hojas inferiores",
    ],
    recommendations: [
      "Retirar hojas bajas infectadas",
      "Mantener hojas lejos del suelo con tutores",
      "Regar solo en la base",
      "Mejorar ventilacion y espaciamiento",
      "Aplicar fungicida preventivo si aparece de forma recurrente",
    ],
  },
  {
    id: "Tomato_Spider_mites_Two_spotted_spider_mite",
    name: "Arana roja de dos puntos",
    category: "Plaga",
    severity: "moderate",
    description:
      "Plaga causada por acaros muy pequenos. Se alimentan de la savia de la hoja y suelen aumentar en condiciones secas y calurosas.",
    symptoms: [
      "Punteado amarillo o blanquecino en la hoja",
      "Hojas opacas, secas o bronceadas",
      "Telaranas finas en el reverso o entre hojas",
      "Debilitamiento general de la planta",
    ],
    recommendations: [
      "Revisar el reverso de las hojas con frecuencia",
      "Lavar suavemente hojas afectadas si la infestacion es baja",
      "Reducir polvo y estres hidrico",
      "Retirar hojas muy infestadas",
      "Usar control biologico o acaricida adecuado segun la etiqueta",
    ],
  },
  {
    id: "Tomato__Target_Spot",
    name: "Mancha diana",
    category: "Hongo",
    severity: "moderate",
    description:
      "Enfermedad causada por Corynespora cassiicola. Genera manchas circulares con zonas concentricas que pueden confundirse con tizon temprano.",
    symptoms: [
      "Manchas circulares con centro claro u oscuro",
      "Anillos concentricos tipo diana",
      "Lesiones que se agrandan y se unen",
      "Defoliacion si la infeccion avanza",
    ],
    recommendations: [
      "Retirar hojas infectadas",
      "Evitar humedad persistente en el follaje",
      "Mejorar ventilacion y exposicion a luz",
      "Desinfectar herramientas de poda",
      "Rotar cultivos y retirar residuos vegetales al final del ciclo",
    ],
  },
  {
    id: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    name: "Virus del rizado amarillo de la hoja",
    category: "Virus",
    severity: "high",
    description:
      "Enfermedad viral transmitida principalmente por mosca blanca. Puede frenar el crecimiento y reducir mucho la produccion si no se controla el vector.",
    symptoms: [
      "Hojas amarillas, pequenas o deformadas",
      "Enrollamiento hacia arriba",
      "Crecimiento detenido o planta achaparrada",
      "Floracion y produccion reducidas",
    ],
    recommendations: [
      "Controlar mosca blanca con trampas y manejo integrado",
      "Retirar plantas severamente afectadas",
      "Eliminar malezas que puedan hospedar el vector",
      "Usar mallas o barreras en semilleros",
      "Preferir variedades resistentes si estan disponibles",
    ],
  },
  {
    id: "Tomato__Tomato_mosaic_virus",
    name: "Virus del mosaico del tomate",
    category: "Virus",
    severity: "high",
    description:
      "Enfermedad viral muy contagiosa que puede transmitirse por contacto, herramientas, manos o material vegetal contaminado.",
    symptoms: [
      "Patron de mosaico verde claro y oscuro",
      "Hojas arrugadas o deformadas",
      "Crecimiento reducido",
      "Frutos con maduracion irregular o manchas",
    ],
    recommendations: [
      "Retirar plantas muy afectadas para reducir contagio",
      "Lavarse manos antes de manipular plantas",
      "Desinfectar herramientas y charolas",
      "Evitar trabajar con plantas cuando estan mojadas",
      "Usar semilla certificada y variedades resistentes cuando sea posible",
    ],
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
