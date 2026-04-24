import { diseaseList, type DiseaseInfo } from "@/lib/disease-data"

export interface UploadedImage {
  id: string
  name: string
  preview: string
  index: number
}

export interface BatchImageResult extends UploadedImage {
  diseaseId: string
  confidence: number
}

export interface BatchResultGroup {
  disease: DiseaseInfo
  images: BatchImageResult[]
  confidence: number
}

const mockDiseasePool = diseaseList
const groupedMockBuckets: string[][] = [
  ["Estado saludable"],
  ["Plaga"],
  ["Virus"],
  ["Bacteria"],
  ["Hongo"],
  ["Oomiceto"],
]

function randomConfidence() {
  return 82 + Math.random() * 16
}

function getRandomDisease(diseases: DiseaseInfo[]) {
  return diseases[Math.floor(Math.random() * diseases.length)]
}

function getMockDiseasesForBatch(imageCount: number) {
  if (imageCount < groupedMockBuckets.length) {
    return Array.from({ length: imageCount }, () => getRandomDisease(mockDiseasePool))
  }

  const representativeDiseases = groupedMockBuckets.map((categories) =>
    getRandomDisease(
      mockDiseasePool.filter((disease) => categories.includes(disease.category)),
    ),
  )

  const remainingDiseases = Array.from(
    { length: imageCount - representativeDiseases.length },
    () => getRandomDisease(representativeDiseases),
  )

  return [...representativeDiseases, ...remainingDiseases].sort(() => Math.random() - 0.5)
}

export function getMockBatchResults(images: UploadedImage[]): BatchResultGroup[] {
  const groupedResults = new Map<string, BatchImageResult[]>()
  const assignedDiseases = getMockDiseasesForBatch(images.length)

  images.forEach((image, index) => {
    const disease = assignedDiseases[index]
    const result: BatchImageResult = {
      ...image,
      diseaseId: disease.id,
      confidence: randomConfidence(),
    }

    groupedResults.set(disease.id, [...(groupedResults.get(disease.id) ?? []), result])
  })

  return diseaseList
    .map((disease) => {
      const groupedImages = groupedResults.get(disease.id) ?? []
      const confidence =
        groupedImages.reduce((total, image) => total + image.confidence, 0) / groupedImages.length

      return {
        disease,
        images: groupedImages,
        confidence,
      }
    })
    .filter((group) => group.images.length > 0)
}
