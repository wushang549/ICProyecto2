import Image from "next/image"
import { assetPath } from "@/lib/asset-path"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src={assetPath("/tomato-logo.png")}
            alt="Logo de Tomate Sano"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-lg font-semibold text-foreground">
            Tomate Sano
          </span>
        </div>
        <nav className="hidden items-center gap-6 sm:flex">
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Acerca de
          </a>
        </nav>
      </div>
    </header>
  )
}
