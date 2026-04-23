"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ImageIcon, Images, Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadedImage } from "@/lib/batch-analysis"
import { cn } from "@/lib/utils"

const COMPACT_IMAGES_PER_PAGE = 3
const DESKTOP_IMAGES_PER_PAGE = 12

interface UploadZoneProps {
  onImageSelect: (images: UploadedImage[]) => void
  selectedImages: UploadedImage[]
  onClear: () => void
  isAnalyzing: boolean
  onAnalyze: () => void
}

export function UploadZone({
  onImageSelect,
  selectedImages,
  onClear,
  isAnalyzing,
  onAnalyze,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [imagesPerPage, setImagesPerPage] = useState(DESKTOP_IMAGES_PER_PAGE)
  const pageCount = Math.max(1, Math.ceil(selectedImages.length / imagesPerPage))
  const visibleImages = selectedImages.slice(
    pageIndex * imagesPerPage,
    pageIndex * imagesPerPage + imagesPerPage,
  )
  const hasMultiplePages = selectedImages.length > imagesPerPage
  const visibleImageCount = visibleImages.length
  const desktopGridClass =
    visibleImageCount === 1
      ? "md:grid-cols-1 md:max-w-xl"
      : visibleImageCount === 2
        ? "md:grid-cols-2 md:max-w-3xl"
        : visibleImageCount === 3
          ? "md:grid-cols-3 md:max-w-4xl"
          : "md:grid-cols-4 md:max-w-4xl"

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateImagesPerPage = () => {
      setImagesPerPage(mediaQuery.matches ? DESKTOP_IMAGES_PER_PAGE : COMPACT_IMAGES_PER_PAGE)
    }

    updateImagesPerPage()
    mediaQuery.addEventListener("change", updateImagesPerPage)

    return () => {
      mediaQuery.removeEventListener("change", updateImagesPerPage)
    }
  }, [])

  useEffect(() => {
    setPageIndex((currentPage) => Math.min(currentPage, pageCount - 1))
  }, [pageCount])

  const reindexImages = useCallback((images: UploadedImage[]) => {
    return images.map((image, index) => ({
      ...image,
      index: index + 1,
    }))
  }, [])

  const readImageFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      return
    }

    Promise.all(
      imageFiles.map(
        (file, index) =>
          new Promise<UploadedImage>((resolve) => {
            const reader = new FileReader()

            reader.onload = (event) => {
              resolve({
                id: `${file.name}-${file.lastModified}-${selectedImages.length}-${index}`,
                name: file.name,
                preview: event.target?.result as string,
                index: selectedImages.length + index + 1,
              })
            }

            reader.readAsDataURL(file)
          }),
      ),
    ).then((newImages) => {
      onImageSelect(reindexImages([...selectedImages, ...newImages]))
      setPageIndex(Math.floor((selectedImages.length + newImages.length - 1) / imagesPerPage))
    })
  }, [imagesPerPage, onImageSelect, reindexImages, selectedImages])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    readImageFiles(e.dataTransfer.files)
  }, [readImageFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      readImageFiles(e.target.files)
      e.target.value = ""
    }
  }, [readImageFiles])

  const handleRemoveImage = useCallback((imageId: string) => {
    const nextImages = reindexImages(selectedImages.filter((image) => image.id !== imageId))

    onImageSelect(nextImages)
    setPageIndex((currentPage) => {
      const nextPageCount = Math.max(1, Math.ceil(nextImages.length / imagesPerPage))
      return Math.min(currentPage, nextPageCount - 1)
    })
  }, [imagesPerPage, onImageSelect, reindexImages, selectedImages])

  const goToPreviousPage = useCallback(() => {
    setPageIndex((currentPage) => Math.max(0, currentPage - 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageIndex((currentPage) => Math.min(pageCount - 1, currentPage + 1))
  }, [pageCount])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  if (selectedImages.length > 0) {
    return (
      <div className="space-y-6">
        <div className="relative mx-auto max-w-4xl">
          <div className={cn("mx-auto grid gap-3", desktopGridClass)}>
            {visibleImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg"
              >
                <img
                  src={image.preview}
                  alt={`Foto ${image.index}: ${image.name}`}
                  className="block h-full w-full rounded-2xl object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  Foto {image.index}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background shadow-lg transition-transform hover:scale-110"
                  aria-label={`Quitar foto ${image.index}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

        </div>

        {hasMultiplePages && (
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={goToPreviousPage}
              disabled={pageIndex === 0}
              className="rounded-full bg-background/90 shadow-md"
              aria-label="Ver fotos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
              Mostrando {pageIndex * imagesPerPage + 1}-{Math.min((pageIndex + 1) * imagesPerPage, selectedImages.length)} de {selectedImages.length}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={goToNextPage}
              disabled={pageIndex === pageCount - 1}
              className="rounded-full bg-background/90 shadow-md"
              aria-label="Ver más fotos"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            size="lg"
            className="w-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analizando...
              </>
            ) : (
              `Analizar ${selectedImages.length === 1 ? "hoja" : "lote"}`
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full cursor-pointer sm:w-auto"
          >
            <label htmlFor="add-batch-images">
              <Plus className="mr-2 h-4 w-4" />
              Añadir imagen
            </label>
          </Button>
          <input
            id="add-batch-images"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleFileInput}
            className="sr-only"
            aria-label="Añadir imágenes al lote"
          />

          <Button
            onClick={onClear}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            Limpiar lote
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative mx-auto max-w-4xl cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12",
        isDragOver
          ? "scale-[1.02] border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
      )}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Subir imágenes de hojas de tomate"
      />

      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "rounded-full p-4 transition-colors duration-300",
          isDragOver ? "bg-primary/10" : "bg-secondary",
        )}>
          {isDragOver ? (
            <Upload className="h-10 w-10 text-primary" />
          ) : (
            <Images className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragOver ? "Suelta las imágenes aquí" : "Arrastra imágenes de hojas de tomate"}
          </p>
          <p className="text-sm text-muted-foreground">
            o haz clic para buscarlas en tu dispositivo
          </p>
        </div>

        <Button variant="outline" className="mt-2">
          <ImageIcon className="mr-2 h-4 w-4" />
          Elegir imágenes
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Formatos permitidos: JPG, PNG, JPEG
        </p>
      </div>
    </div>
  )
}
