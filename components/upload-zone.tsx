"use client"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onImageSelect: (file: File, preview: string) => void
  selectedImage: string | null
  onClear: () => void
  isAnalyzing: boolean
  onAnalyze: () => void
}

export function UploadZone({
  onImageSelect,
  selectedImage,
  onClear,
  isAnalyzing,
  onAnalyze
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImageSelect(file, event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImageSelect(file, event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  if (selectedImage) {
    return (
      <div className="space-y-6">
        <div className="relative mx-auto max-w-md">
          <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
            <img 
              src={selectedImage} 
              alt="Hoja de tomate seleccionada"
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
          <button
            onClick={onClear}
            className="absolute -right-2 -top-2 rounded-full bg-foreground p-1.5 text-background shadow-lg transition-transform hover:scale-110"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
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
              "Analizar hoja"
            )}
          </Button>
          <Button
            onClick={onClear}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Elegir otra imagen
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
        "relative mx-auto max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12",
        isDragOver 
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Subir imagen de hoja de tomate"
      />

      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "rounded-full p-4 transition-colors duration-300",
          isDragOver ? "bg-primary/10" : "bg-secondary"
        )}>
          {isDragOver ? (
            <Upload className="h-10 w-10 text-primary" />
          ) : (
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragOver ? "Suelta la imagen aquí" : "Arrastra una imagen de una hoja de tomate"}
          </p>
          <p className="text-sm text-muted-foreground">
            o haz clic para buscarla en tu dispositivo
          </p>
        </div>

        <Button variant="outline" className="mt-2">
          <Upload className="mr-2 h-4 w-4" />
          Elegir imagen
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Formatos permitidos: JPG, PNG, JPEG
        </p>
      </div>
    </div>
  )
}
