import { Space_Grotesk } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

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
      <body className="font-space bg-black text-white antialiased selection:bg-[#bfa0e0] selection:text-white relative overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
