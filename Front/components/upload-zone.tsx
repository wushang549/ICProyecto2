"use client"

import { useCallback, useEffect, useState } from "react"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Images,
  LoaderCircle,
  Plus,
  RefreshCw,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadedImage } from "@/lib/batch-analysis"
import { cn } from "@/lib/utils"

const COMPACT_IMAGES_PER_PAGE = 3
const DESKTOP_IMAGES_PER_PAGE = 12

type ModelStatus = "loading" | "ready" | "error"

interface UploadZoneProps {
  onImageSelect: (images: UploadedImage[]) => void
  selectedImages: UploadedImage[]
  onClear: () => void
  isAnalyzing: boolean
  onAnalyze: () => void
  modelStatus: ModelStatus
  modelStatusMessage: string
  analysisError: string | null
  onRetryModelLoad: () => void
}

function ModelStatusBanner({
  modelStatus,
  modelStatusMessage,
  onRetryModelLoad,
}: {
  modelStatus: ModelStatus
  modelStatusMessage: string
  onRetryModelLoad: () => void
}) {
  if (modelStatus === "ready") {
    return null
  }

  if (modelStatus === "error") {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">No se pudo cargar el modelo</p>
              <p className="text-sm text-muted-foreground">{modelStatusMessage}</p>
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={onRetryModelLoad}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3">
      <div className="flex items-start gap-3">
        <LoaderCircle className="mt-0.5 h-5 w-5 animate-spin text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Cargando modelo local</p>
          <p className="text-sm text-muted-foreground">{modelStatusMessage}</p>
        </div>
      </div>
    </div>
  )
}

export function UploadZone({
  onImageSelect,
  selectedImages,
  onClear,
  isAnalyzing,
  onAnalyze,
  modelStatus,
  modelStatusMessage,
  analysisError,
  onRetryModelLoad,
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
                file,
                preview: event.target?.result as string,
                index: selectedImages.length + index + 1,
              })
            }

            reader.readAsDataURL(file)
          }),
      ),
    ).then((newImages) => {
      onImageSelect(reindexImages([...selectedImages, ...newImages]))
    })
  }, [onImageSelect, reindexImages, selectedImages])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    readImageFiles(event.dataTransfer.files)
  }, [readImageFiles])

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      readImageFiles(event.target.files)
      event.target.value = ""
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

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  if (selectedImages.length > 0) {
    return (
      <div className="space-y-6">
        <ModelStatusBanner
          modelStatus={modelStatus}
          modelStatusMessage={modelStatusMessage}
          onRetryModelLoad={onRetryModelLoad}
        />

        {analysisError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No se pudo completar el analisis</p>
                <p className="text-sm text-muted-foreground">{analysisError}</p>
              </div>
            </div>
          </div>
        )}

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
              Mostrando {pageIndex * imagesPerPage + 1}-
              {Math.min((pageIndex + 1) * imagesPerPage, selectedImages.length)} de {selectedImages.length}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={goToNextPage}
              disabled={pageIndex === pageCount - 1}
              className="rounded-full bg-background/90 shadow-md"
              aria-label="Ver mas fotos"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || modelStatus === "error"}
            size="lg"
            className="w-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
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
              Anadir imagen
            </label>
          </Button>
          <input
            id="add-batch-images"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleFileInput}
            className="sr-only"
            suppressHydrationWarning
            aria-label="Anadir imagenes al lote"
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
    <div className="space-y-5">
      <ModelStatusBanner
        modelStatus={modelStatus}
        modelStatusMessage={modelStatusMessage}
        onRetryModelLoad={onRetryModelLoad}
      />

      {analysisError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">No se pudo completar el analisis</p>
              <p className="text-sm text-muted-foreground">{analysisError}</p>
            </div>
          </div>
        </div>
      )}

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
          suppressHydrationWarning
          aria-label="Subir imagenes de hojas de tomate"
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
              {isDragOver ? "Suelta las imagenes aqui" : "Arrastra imagenes de hojas de tomate"}
            </p>
            <p className="text-sm text-muted-foreground">
              o haz clic para buscarlas en tu dispositivo
            </p>
          </div>

          <Button variant="outline" className="mt-2">
            <ImageIcon className="mr-2 h-4 w-4" />
            Elegir imagenes
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            Formatos permitidos: JPG, PNG, JPEG
          </p>
        </div>
      </div>
    </div>
  )
}
