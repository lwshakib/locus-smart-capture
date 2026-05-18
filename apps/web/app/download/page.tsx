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
import { DOWNLOAD_URLS } from "@/lib/constants"

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
          name: "Locus-Smart-Capture-Windows-1.0.0-Setup.exe",
          url: DOWNLOAD_URLS.windows,
          icon: <Monitor className="h-5 w-5" />,
        }
      case "macOS":
        return {
          name: "Locus-Smart-Capture-Mac-1.0.0.dmg",
          url: DOWNLOAD_URLS.mac,
          icon: <Laptop className="h-5 w-5" />,
        }
      case "Linux":
        return {
          name: "Locus-Smart-Capture-Linux-1.0.0.AppImage",
          url: DOWNLOAD_URLS.linux,
          icon: <Terminal className="h-5 w-5" />,
        }
      default:
        return {
          name: "Locus-Smart-Capture-Windows-1.0.0-Setup.exe",
          url: DOWNLOAD_URLS.windows,
          icon: <Download className="h-5 w-5" />,
        }
    }
  }

  const currentInfo = getDownloadInfo(detectedOS)

  return (
    <div className="font-space relative min-h-screen overflow-x-hidden bg-white pb-32 text-zinc-950 transition-colors duration-300 selection:bg-[#bfa0e0] selection:text-zinc-950 dark:bg-black dark:text-white dark:selection:text-white">
      {/* Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden opacity-20 dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient Glow */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 z-0 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bfa0e0] opacity-10 blur-[180px]" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Locus
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-light tracking-wide text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bfa0e0]/30 bg-[#bfa0e0]/5 px-3 py-1 font-mono text-[10px] tracking-widest text-[#bfa0e0]">
                <Zap className="h-3 w-3" />
                System Identified:{" "}
                {mounted
                  ? detectedOS === "Unknown"
                    ? "Universal"
                    : detectedOS
                  : "Scanning..."}
              </div>
              <h1 className="text-5xl font-normal tracking-tight md:text-7xl">
                Get <span className="text-[#bfa0e0]">Locus</span>
              </h1>
              <p className="mx-auto max-w-xl text-xl leading-relaxed font-light text-zinc-600 dark:text-zinc-400">
                Initialize the ultimate visual capture suite on your
                workstation. Pixel precision, zero friction.
              </p>
            </div>

            {/* Main Download Box */}
            <div className="group relative w-full overflow-hidden border border-zinc-200 bg-zinc-50/50 p-8 md:p-12 dark:border-white/10 dark:bg-zinc-950/50">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#bfa0e0] opacity-5 blur-3xl transition-opacity group-hover:opacity-10"></div>

              <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/5">
                  <Download
                    className="h-10 w-10 text-[#bfa0e0]"
                    strokeWidth={1.2}
                  />
                </div>

                <div className="w-full space-y-4">
                  <a
                    href={mounted ? currentInfo.url : "#"}
                    className="flex w-full transform items-center justify-center gap-3 border border-transparent bg-[#bfa0e0] py-5 text-base font-medium tracking-[0.2em] text-zinc-950 transition-all hover:bg-zinc-950 hover:text-white active:scale-[0.98] dark:border-white/10 dark:hover:bg-white dark:hover:text-zinc-950"
                  >
                    Download for {mounted ? detectedOS : "Desktop"}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                  <p className="font-mono text-xs tracking-widest text-zinc-400 dark:text-zinc-600">
                    Build: {mounted ? currentInfo.name : "Initializing..."}
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-8 border-t border-zinc-100 pt-8 text-zinc-400 md:grid-cols-3 dark:border-white/5 dark:text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest">
                      Verified Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest">
                      Direct Setup
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-mono text-[9px] tracking-widest">
                      Offline First
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. All Platforms Section */}
          <div className="w-full space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-px bg-gradient-to-b from-transparent to-zinc-200 dark:to-white/20"></div>
              <h2 className="font-mono text-xs tracking-[0.4em] text-zinc-500">
                All Platforms
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Windows */}
              <div className="group flex flex-col gap-6 border border-zinc-200 bg-zinc-50/30 p-8 transition-all hover:border-zinc-400 dark:border-white/5 dark:bg-zinc-950/30 hover:dark:border-white/20">
                <div className="flex items-center justify-between">
                  <Monitor className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-950 dark:text-zinc-500 group-hover:dark:text-white" />
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
                    v1.0.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal">Windows</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-600 dark:text-zinc-500">
                    Integrated setup installer optimized for Windows 10 & 11
                    workstations.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <a
                    href={DOWNLOAD_URLS.windows}
                    className="flex w-full justify-center bg-zinc-900/5 py-3 text-[10px] font-medium tracking-widest text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-zinc-950"
                  >
                    Download Setup (.exe)
                  </a>
                </div>
              </div>

              {/* macOS */}
              <div className="group flex flex-col gap-6 border border-zinc-200 bg-zinc-50/30 p-8 transition-all hover:border-zinc-400 dark:border-white/5 dark:bg-zinc-950/30 hover:dark:border-white/20">
                <div className="flex items-center justify-between">
                  <Laptop className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-950 dark:text-zinc-500 group-hover:dark:text-white" />
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
                    v1.0.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal">macOS</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-600 dark:text-zinc-500">
                    Premium universal DMG build optimized for Apple Silicon &
                    Intel.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <a
                    href={DOWNLOAD_URLS.mac}
                    className="flex w-full justify-center bg-zinc-900/5 py-3 text-[10px] font-medium tracking-widest text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-zinc-950"
                  >
                    Download Disk Image (.dmg)
                  </a>
                </div>
              </div>

              {/* Linux */}
              <div className="group flex flex-col gap-6 border border-zinc-200 bg-zinc-50/30 p-8 transition-all hover:border-zinc-400 dark:border-white/5 dark:bg-zinc-950/30 hover:dark:border-white/20">
                <div className="flex items-center justify-between">
                  <Terminal className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-950 dark:text-zinc-500 group-hover:dark:text-white" />
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
                    v1.0.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal">Linux</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-600 dark:text-zinc-500">
                    Stable, sandboxed AppImage for major Linux distributions.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <a
                    href={DOWNLOAD_URLS.linux}
                    className="flex w-full justify-center bg-zinc-900/5 py-3 text-[10px] font-medium tracking-widest text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-zinc-950"
                  >
                    Download AppImage
                  </a>
                </div>
              </div>

              {/* Chrome Extension */}
              <div className="group flex flex-col gap-6 border border-zinc-200 bg-zinc-50/30 p-8 transition-all hover:border-zinc-400 dark:border-white/5 dark:bg-zinc-950/30 hover:dark:border-white/20">
                <div className="flex items-center justify-between">
                  <Globe className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-zinc-950 dark:text-zinc-500 group-hover:dark:text-white" />
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-700">
                    v1.0.0
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal">Chrome Extension</h3>
                  <p className="text-sm leading-relaxed font-light text-zinc-600 dark:text-zinc-500">
                    Sleek browser extension with DevTools-style element
                    snapping.
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <a
                    href={DOWNLOAD_URLS.chrome}
                    className="flex w-full justify-center bg-zinc-900/5 py-3 text-[10px] font-medium tracking-widest text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-zinc-950"
                  >
                    Download Ext (.zip)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Release info summary */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs tracking-[0.3em] text-zinc-400 dark:text-zinc-700">
              System Integrity Checked
            </span>
            <span className="text-sm font-light tracking-widest text-zinc-600 italic dark:text-zinc-500">
              "Simulate with precision, capture with purpose."
            </span>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/10"></div>
      <div className="fixed bottom-8 left-12 hidden lg:block">
        <span className="vertical-text font-mono text-[10px] tracking-[0.5em] text-zinc-300 dark:text-zinc-800">
          Access Authorized
        </span>
      </div>
    </div>
  )
}
