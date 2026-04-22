import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { assetPath } from '@/lib/asset-path'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tomate Sano',
  description: 'Sube una imagen de una hoja de tomate para identificar posibles enfermedades o confirmar si la hoja esta sana.',
  icons: {
    icon: assetPath('/tomato-logo.png'),
    shortcut: assetPath('/tomato-logo.png'),
    apple: assetPath('/tomato-logo.png'),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
