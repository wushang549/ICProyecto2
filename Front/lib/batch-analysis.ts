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

const mockDiseasePool = diseaseList.slice(0, 4)

function randomConfidence() {
  return 82 + Math.random() * 16
}

export function getMockBatchResults(images: UploadedImage[]): BatchResultGroup[] {
  const groupedResults = new Map<string, BatchImageResult[]>()

  images.forEach((image) => {
    const disease = mockDiseasePool[Math.floor(Math.random() * mockDiseasePool.length)]
    const result: BatchImageResult = {
      ...image,
      diseaseId: disease.id,
      confidence: randomConfidence(),
    }

    groupedResults.set(disease.id, [...(groupedResults.get(disease.id) ?? []), result])
  })

  return mockDiseasePool
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
