import type {
  BatchAnalysisOutcome,
  BatchResultGroup,
  ImageAnalysisResult,
  PredictionEntry,
} from "@/lib/batch-analysis"
import { diseaseData, diseaseSeverityRank, isHealthyDisease } from "@/lib/disease-data"

const REPORT_MARGIN = 18
const REPORT_LINE_HEIGHT = 6
const REPORT_SECTION_GAP = 8

const severityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
} as const

function formatConfidence(value: number) {
  return `${value.toFixed(1)}%`
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value)
}

function sanitizeText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .trim()
}

function sortGroupsForReport(groups: BatchResultGroup[]) {
  return [...groups].sort((a, b) => {
    const severityDifference =
      diseaseSeverityRank[b.disease.severity] - diseaseSeverityRank[a.disease.severity]

    if (severityDifference !== 0) {
      return severityDifference
    }

    if (b.images.length !== a.images.length) {
      return b.images.length - a.images.length
    }

    return b.confidence - a.confidence
  })
}

function sortImagesForReport(images: ImageAnalysisResult[]) {
  return [...images].sort((a, b) => a.index - b.index)
}

function getDominantGroup(groups: BatchResultGroup[]) {
  return groups.reduce<BatchResultGroup | null>((current, group) => {
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
}

function getAverageBatchConfidence(outcome: BatchAnalysisOutcome) {
  if (outcome.imageResults.length === 0) {
    return 0
  }

  const totalConfidence = outcome.imageResults.reduce(
    (total, image) => total + image.confidence,
    0,
  )

  return totalConfidence / outcome.imageResults.length
}

function getTopAlternatives(predictions: PredictionEntry[]) {
  return predictions
    .slice(1)
    .filter((prediction) => prediction.confidence >= 0.01)
    .slice(0, 3)
}

function createReportFileName(createdAt: Date) {
  const datePart = [
    createdAt.getFullYear(),
    String(createdAt.getMonth() + 1).padStart(2, "0"),
    String(createdAt.getDate()).padStart(2, "0"),
  ].join("-")

  const timePart = [
    String(createdAt.getHours()).padStart(2, "0"),
    String(createdAt.getMinutes()).padStart(2, "0"),
  ].join("-")

  return `reporte-analisis-tomate-${datePart}-${timePart}.pdf`
}

export async function generateAnalysisReportPdf(outcome: BatchAnalysisOutcome) {
  const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js")

  const createdAt = new Date()
  const sortedGroups = sortGroupsForReport(outcome.groups)
  const sortedImages = sortImagesForReport(outcome.imageResults)
  const dominantGroup = getDominantGroup(sortedGroups)
  const averageBatchConfidence = getAverageBatchConfidence(outcome)
  const diseaseById = new Map(sortedGroups.map((group) => [group.disease.id, group.disease]))
  const healthyCount = sortedImages.filter((image) =>
    isHealthyDisease(diseaseById.get(image.diseaseId)),
  ).length
  const affectedCount = sortedImages.length - healthyCount
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - REPORT_MARGIN * 2
  let cursorY = REPORT_MARGIN

  const ensureSpace = (requiredHeight: number) => {
    if (cursorY + requiredHeight <= pageHeight - REPORT_MARGIN) {
      return
    }

    doc.addPage()
    cursorY = REPORT_MARGIN
  }

  const addParagraph = (text: string, options?: { size?: number; color?: [number, number, number] }) => {
    const size = options?.size ?? 11
    const color = options?.color ?? [60, 60, 60]
    const lines = doc.splitTextToSize(sanitizeText(text), contentWidth)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(size)
    doc.setTextColor(...color)
    ensureSpace(lines.length * REPORT_LINE_HEIGHT)
    doc.text(lines, REPORT_MARGIN, cursorY)
    cursorY += lines.length * REPORT_LINE_HEIGHT
  }

  const addLabelValue = (label: string, value: string) => {
    addParagraph(`${label}: ${value}`, { size: 11, color: [45, 45, 45] })
  }

  const addSectionTitle = (title: string, accent?: [number, number, number]) => {
    const color = accent ?? [28, 109, 71]
    ensureSpace(16)
    doc.setDrawColor(...color)
    doc.setLineWidth(0.8)
    doc.line(REPORT_MARGIN, cursorY, REPORT_MARGIN + 24, cursorY)
    cursorY += 5

    doc.setFont("helvetica", "bold")
    doc.setFontSize(15)
    doc.setTextColor(...color)
    doc.text(sanitizeText(title), REPORT_MARGIN, cursorY)
    cursorY += REPORT_SECTION_GAP
  }

  const addBulletList = (items: string[]) => {
    items.forEach((item) => {
      const bulletLines = doc.splitTextToSize(`- ${sanitizeText(item)}`, contentWidth)
      ensureSpace(bulletLines.length * REPORT_LINE_HEIGHT)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10.5)
      doc.setTextColor(65, 65, 65)
      doc.text(bulletLines, REPORT_MARGIN, cursorY)
      cursorY += bulletLines.length * REPORT_LINE_HEIGHT
    })
  }

  doc.setFillColor(232, 246, 237)
  doc.roundedRect(REPORT_MARGIN, cursorY, contentWidth, 34, 4, 4, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(28, 109, 71)
  doc.text("Reporte de analisis de hojas de tomate", REPORT_MARGIN + 4, cursorY + 12)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(70, 70, 70)
  doc.text(`Generado el ${formatDate(createdAt)}`, REPORT_MARGIN + 4, cursorY + 21)
  doc.text("Tomate Sano", REPORT_MARGIN + 4, cursorY + 28)
  cursorY += 42

  addSectionTitle("Resumen general")
  addLabelValue("Fotos analizadas", String(sortedImages.length))
  addLabelValue("Grupos detectados", String(sortedGroups.length))
  addLabelValue("Clase dominante", dominantGroup?.disease.name ?? "Sin resultados")
  addLabelValue("Confianza promedio del lote", formatConfidence(averageBatchConfidence))
  addLabelValue("Hojas saludables", String(healthyCount))
  addLabelValue("Hojas con hallazgos", String(affectedCount))
  cursorY += 3

  addSectionTitle("Resultados agrupados")

  sortedGroups.forEach((group, index) => {
    ensureSpace(28)
    doc.setFillColor(248, 250, 248)
    doc.roundedRect(REPORT_MARGIN, cursorY, contentWidth, 12, 3, 3, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.setTextColor(32, 32, 32)
    doc.text(`${index + 1}. ${sanitizeText(group.disease.name)}`, REPORT_MARGIN + 3, cursorY + 7.5)
    cursorY += 17

    addLabelValue("Categoria", group.disease.category)
    addLabelValue("Severidad", severityLabels[group.disease.severity])
    addLabelValue("Confianza promedio", formatConfidence(group.confidence))
    addLabelValue(
      "Fotos dentro del grupo",
      `${group.images.length} (${group.images.map((image) => `Foto ${image.index}`).join(", ")})`,
    )
    addParagraph(group.disease.description)

    addParagraph("Sintomas comunes", { size: 11, color: [28, 109, 71] })
    addBulletList(group.disease.symptoms)
    cursorY += 2

    addParagraph("Recomendaciones", { size: 11, color: [28, 109, 71] })
    addBulletList(group.disease.recommendations)
    cursorY += 2

    addLabelValue("Importante", group.disease.important)
    cursorY += 5
  })

  addSectionTitle("Detalle por imagen", [43, 87, 151])

  sortedImages.forEach((image, index) => {
    const group = sortedGroups.find((item) => item.disease.id === image.diseaseId)
    const alternatives = getTopAlternatives(image.predictions)

    ensureSpace(32)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(35, 35, 35)
    doc.text(`${index + 1}. Foto ${image.index} - ${sanitizeText(image.name)}`, REPORT_MARGIN, cursorY)
    cursorY += 7

    addLabelValue("Resultado principal", group?.disease.name ?? image.diseaseId)
    addLabelValue("Confianza", formatConfidence(image.confidence))

    if (alternatives.length > 0) {
      addLabelValue(
        "Otras posibilidades",
        alternatives
          .map((prediction) => {
            const predictionName =
              diseaseData[prediction.className]?.name ??
              prediction.className.replace(/^Tomato_+/, "").replace(/_/g, " ")

            return `${predictionName} ${formatConfidence(prediction.confidence)}`
          })
          .join(" | "),
      )
    } else {
      addLabelValue("Otras posibilidades", "No se registraron alternativas relevantes.")
    }

    cursorY += 3
  })

  doc.save(createReportFileName(createdAt))
}
