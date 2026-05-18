"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  Zap,
  ShieldCheck,
  Globe,
  Monitor,
  Laptop,
  Terminal,
  ArrowRight,
} from "lucide-react"
import { Logo } from "@/components/logo"

type OSType = "Windows" | "macOS" | "Linux" | "Unknown"

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<OSType>("Windows")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const ua = window.navigator.userAgent
    if (ua.indexOf("Win") !== -1) setDetectedOS("Windows")
    else if (ua.indexOf("Mac") !== -1) setDetectedOS("macOS")
    else if (ua.indexOf("Linux") !== -1) setDetectedOS("Linux")
    else setDetectedOS("Unknown")
  }, [])

  const getDownloadInfo = (os: OSType) => {
    switch (os) {
      case "Windows":
        return {
          name: "Locus_v1.2.0_x64.exe",
          icon: <Monitor className="h-5 w-5" />,
        }
      case "macOS":
        return {
          name: "Locus_v1.2.0_Universal.dmg",
          icon: <Laptop className="h-5 w-5" />,
        }
      case "Linux":
        return {
          name: "Locus-v1.2.0.AppImage",
          icon: <Terminal className="h-5 w-5" />,
        }
      default:
        return {
          name: "Locus_v1.2.0_Setup.zip",
          icon: <Download className="h-5 w-5" />,
        }
    }
  }

  const currentInfo = getDownloadInfo(detectedOS)

  return (
    <div className="font-space relative min-h-screen overflow-x-hidden bg-black pb-32 text-white selection:bg-[#bfa0e0] selection:text-white">
      {/* Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient Glow */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 z-0 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bfa0e0] opacity-10 blur-[180px]" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-medium tracking-tight text-zinc-100 uppercase">
              Locus
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-light tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Base
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 pt-40">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-24">
          {/* 1. Primary Download Section */}
          <div className="flex max-w-3xl flex-col items-center gap-12 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bfa0e0]/30 bg-[#bfa0e0]/5 px-3 py-1 font-mono text-[10px] tracking-widest text-[#bfa0e0] uppercase">
                <Zap className="h-3 w-3" />
                System Identified:{" "}
                {mounted
                  ? detectedOS === "Unknown"
                    ? "Universal"
                    : detectedOS
                  : "Scanning..."}
              </div>
              <h1 className="text-5xl font-normal tracking-tight uppercase md:text-7xl">
                Get <span className="text-[#bfa0e0]">Locus</span>
              </h1>
              <p className="mx-auto max-w-xl text-xl leading-relaxed font-light text-zinc-400">
                Initialize the ultimate visual capture suite on your
                workstation. Pixel precision, zero friction.
              </p>
            </div>

            {/* Main Download Box */}
            <div className="group relative w-full overflow-hidden border border-white/10 bg-zinc-950/50 p-8 md:p-12">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#bfa0e0] opacity-5 blur-3xl transition-opacity group-hover:opacity-10"></div>

              <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Download
                    className="h-10 w-10 text-[#bfa0e0]"
                    strokeWidth={1.2}
                  />
                </div>

                <div className="w-full space-y-4">
                  <button className="flex w-full transform items-center justify-center gap-3 bg-[#bfa0e0] py-5 text-base font-medium tracking-[0.2em] text-zinc-950 uppercase transition-all hover:bg-white active:scale-[0.98]">
                    Download for {mounted ? detectedOS : "Desktop"}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <p className="font-mono text-xs tracking-widest text-zinc-600 uppercase">
                    Build: {mounted ? currentInfo.name : "Initializing..."}
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-8 border-t border-white/5 pt-8 text-zinc-500 md:grid-cols-3">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">
                      Verified Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">
                      Direct Setup
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">
                      Cloud Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. All Platforms Section */}
          <div className="w-full space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-px bg-gradient-to-b from-transparent to-white/20"></div>
              <h2 className="font-mono text-xs tracking-[0.4em] text-zinc-500 uppercase">
                All Platforms
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Windows */}
              <div className="group flex flex-col gap-6 border border-white/5 bg-zinc-950/30 p-8 transition-all hover:border-white/20">
                <div className="flex items-center justify-between">
                  <Monitor className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
                  <span className="font-mono text-[10px] text-zinc-700">
                    v1.2.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">Windows</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-500">
                    Integrated setup for Windows 10/11 with native hooks.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full bg-white/5 py-3 text-[10px] font-medium tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black">
                    Download .exe
                  </button>
                  <button className="w-full border border-white/10 py-3 text-[10px] font-medium tracking-widest text-zinc-500 uppercase transition-all hover:text-white">
                    Download .msi
                  </button>
                </div>
              </div>

              {/* macOS */}
              <div className="group flex flex-col gap-6 border border-white/5 bg-zinc-950/30 p-8 transition-all hover:border-white/20">
                <div className="flex items-center justify-between">
                  <Laptop className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
                  <span className="font-mono text-[10px] text-zinc-700">
                    v1.2.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">macOS</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-500">
                    Universal build optimized for M1/M2/M3 and Intel chips.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full bg-white/5 py-3 text-[10px] font-medium tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black">
                    Apple Silicon
                  </button>
                  <button className="w-full border border-white/10 py-3 text-[10px] font-medium tracking-widest text-zinc-500 uppercase transition-all hover:text-white">
                    Intel Version
                  </button>
                </div>
              </div>

              {/* Linux */}
              <div className="group flex flex-col gap-6 border border-white/5 bg-zinc-950/30 p-8 transition-all hover:border-white/20">
                <div className="flex items-center justify-between">
                  <Terminal className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
                  <span className="font-mono text-[10px] text-zinc-700">
                    v1.2.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">Linux</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-500">
                    Stable distribution for Debian and Ubuntu based systems.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full bg-white/5 py-3 text-[10px] font-medium tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black">
                    Download .AppImage
                  </button>
                  <button className="w-full border border-white/10 py-3 text-[10px] font-medium tracking-widest text-zinc-500 uppercase transition-all hover:text-white">
                    Download .deb
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Release info summary */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs tracking-[0.3em] text-zinc-700 uppercase">
              System Integrity Checked
            </span>
            <span className="text-sm font-light tracking-widest text-zinc-500 italic">
              "Simulate with precision, capture with purpose."
            </span>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="fixed bottom-8 left-12 hidden lg:block">
        <span className="vertical-text font-mono text-[10px] tracking-[0.5em] text-zinc-800 uppercase">
          Access Authorized
        </span>
      </div>
    </div>
  )
}
