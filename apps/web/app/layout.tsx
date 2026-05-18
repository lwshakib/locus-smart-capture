import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

export const metadata: Metadata = {
  title: "Locus | Smart Capture Ecosystem",
  description:
    "Premium, pixel-perfect, high-fidelity capture helper and browser extension suite.",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/favicon_io/site.webmanifest",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicon_io/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/favicon_io/android-chrome-512x512.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", spaceGrotesk.variable)}
    >
      <body className="font-space relative overflow-x-hidden bg-white text-zinc-950 antialiased transition-colors duration-300 selection:bg-[#bfa0e0] selection:text-white dark:bg-black dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
