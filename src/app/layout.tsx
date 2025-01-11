import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Art Prompt Collector',
  description: 'Collect and organize art prompts for AI image generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen p-4 md:p-8`}>
        <main className="container mx-auto max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
}
