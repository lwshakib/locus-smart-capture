"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Menu,
  ArrowRight,
  Network,
  Cpu,
  Gamepad2,
  MapPin,
  Ticket,
  Link as LinkIcon,
  Mail,
  Zap,
  MousePointer2,
  Layers,
  Download,
} from "lucide-react"
import { Logo } from "@/components/logo"

export default function Page() {
  return (
    <div className="relative">
      {/* Subtle Abstract Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top Gradient Glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 z-0 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full bg-[#bfa0e0] opacity-10 blur-[150px]" />

      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo Custom Implementation */}
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-2xl leading-none font-medium tracking-tight text-zinc-100">
              Locus
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-light tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="text-sm font-light tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
            >
              Workflow
            </a>
            <a
              href="#location"
              className="text-sm font-light tracking-wide text-zinc-400 uppercase transition-colors hover:text-white"
            >
              Coordinates
            </a>
            <Link
              href="/download"
              className="flex items-center gap-1 text-sm font-normal tracking-wide text-[#bfa0e0] uppercase transition-colors hover:text-white"
            >
              Download <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="text-zinc-400 hover:text-white md:hidden">
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main className="relative z-10">
        {/* 2. Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-white/10 px-6 pt-20 md:px-12">
          <div className="z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#bfa0e0]"></span>
              <span className="text-xs font-normal tracking-widest text-zinc-300 uppercase">
                v1.2.0 Stable
              </span>
            </div>

            {/* Massive Headline */}
            <h1 className="flex flex-col text-6xl leading-[0.9] font-medium tracking-tight uppercase md:text-8xl lg:text-9xl">
              <span className="text-zinc-500">Smart</span>
              <span className="text-white">Visual</span>
              <span className="text-[#bfa0e0]">Capture</span>
            </h1>

            {/* Sub-headline */}
            <div className="mt-4 flex flex-col gap-4 border-l-2 border-[#bfa0e0] pl-4 md:mt-8 md:flex-row md:items-center md:gap-8 md:pl-6">
              <p className="max-w-2xl text-lg font-light tracking-tight text-zinc-400 md:text-2xl">
                The ultimate desktop utility for precise window selection,
                instant exports, and seamless team collaboration.
              </p>
              <div className="flex items-center gap-4 text-sm font-normal tracking-widest text-white uppercase">
                <span>macOS</span>
                <span className="text-zinc-700">|</span>
                <span>Windows</span>
                <span className="text-zinc-700">|</span>
                <span>Linux</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/download"
                className="group flex w-full items-center justify-center gap-2 bg-[#bfa0e0] px-8 py-4 text-sm font-medium tracking-widest text-zinc-950 uppercase transition-all hover:bg-white sm:w-auto"
              >
                Download for Desktop
                <Download
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
              <a
                href="#features"
                className="flex w-full items-center justify-center border border-white/10 bg-white/5 px-8 py-4 text-center text-sm font-light tracking-widest text-white uppercase transition-all hover:bg-white/10 sm:w-auto"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Hero Abstract Elements */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 h-1/2 w-1/2 opacity-30 mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #bfa0e0 0, #bfa0e0 1px, transparent 1px, transparent 10px)",
            }}
          />
        </section>

        {/* 3. Features Section */}
        <section
          id="features"
          className="border-b border-white/10 px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
            <div className="lg:col-span-4">
              <h2 className="sticky top-32 text-3xl font-normal tracking-tight uppercase md:text-5xl">
                Why
                <br />
                <span className="text-zinc-500">Choose</span>
                <br />
                Locus?
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:col-span-8">
              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <MousePointer2
                  className="h-8 w-8 text-[#bfa0e0]"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                  Precision Selection
                </h3>
                <p className="text-lg leading-relaxed font-light text-zinc-400">
                  No more manual cropping. Our advanced hover-detection engine
                  identifies window boundaries automatically for a perfect
                  capture every time.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <Zap className="h-8 w-8 text-[#bfa0e0]" strokeWidth={1.5} />
                <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                  Instant Workflow
                </h3>
                <p className="text-lg leading-relaxed font-light text-zinc-400">
                  Capture, annotate, and share in seconds. Integrated clipboard
                  sync and cloud uploads keep your team in the loop without the
                  friction.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <Layers className="h-8 w-8 text-[#bfa0e0]" strokeWidth={1.5} />
                <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                  Multi-Layer Support
                </h3>
                <p className="text-lg leading-relaxed font-light text-zinc-400">
                  Switch between active windows, child elements, or full-screen
                  captures with a single shortcut. Total control at your
                  fingertips.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <Network className="h-8 w-8 text-[#bfa0e0]" strokeWidth={1.5} />
                <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                  Team Sync
                </h3>
                <p className="text-lg leading-relaxed font-light text-zinc-400">
                  Organize captures into shared spaces. Collaborate with your
                  team by adding context directly to every visual asset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Workflow Section */}
        <section
          id="workflow"
          className="border-b border-white/10 bg-zinc-950/50 px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-center text-4xl font-normal tracking-tight uppercase md:mb-24 md:text-6xl">
              How it Works<span className="text-[#bfa0e0]">.</span>
            </h2>

            <div className="relative ml-4 border-l border-white/10 md:ml-0">
              {/* Step 1 */}
              <div className="group relative pb-16 pl-8 md:pl-12">
                <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full border border-black bg-zinc-800 transition-colors group-hover:bg-[#bfa0e0]"></div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-12">
                  <div className="flex-shrink-0 md:w-32">
                    <span className="font-mono text-base tracking-widest text-zinc-500 transition-colors group-hover:text-white">
                      BOOT
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                      Initialize System
                    </h3>
                    <p className="mt-2 text-base font-light tracking-wide text-zinc-400">
                      Launch Locus. It lives in your system tray, always ready
                      to capture the next moment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative pb-16 pl-8 md:pl-12">
                <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full border border-black bg-zinc-800 transition-colors group-hover:bg-[#bfa0e0]"></div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-12">
                  <div className="flex-shrink-0 md:w-32">
                    <span className="font-mono text-base tracking-widest text-zinc-500 transition-colors group-hover:text-white">
                      SELECT
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                      Hover & Detect
                    </h3>
                    <p className="mt-2 text-base font-light tracking-wide text-zinc-400">
                      Simply hover over any window. Locus automatically
                      highlights the active element with pixel precision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative pb-16 pl-8 md:pl-12">
                <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full border border-black bg-zinc-800 transition-colors group-hover:bg-[#bfa0e0]"></div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-12">
                  <div className="flex-shrink-0 md:w-32">
                    <span className="font-mono text-base tracking-widest text-zinc-500 transition-colors group-hover:text-white">
                      CAPTURE
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                      Click to Snap
                    </h3>
                    <p className="mt-2 text-base font-light tracking-wide text-zinc-400">
                      Click to capture. Your screenshot is instantly saved,
                      copied to the clipboard, and ready to share.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative pl-8 md:pl-12">
                <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full border border-black bg-zinc-800 shadow-[0_0_10px_#bfa0e0] transition-colors group-hover:bg-[#bfa0e0]"></div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-12">
                  <div className="flex-shrink-0 md:w-32">
                    <span className="font-mono text-base tracking-widest text-zinc-500 transition-colors group-hover:text-white">
                      SYNC
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-normal tracking-tight uppercase md:text-2xl">
                      Collaborate & Export
                    </h3>
                    <p className="mt-2 text-base font-light tracking-wide text-zinc-400">
                      Add notes and tags. Sync with your team workspace to keep
                      everyone aligned on the vision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Partnership Section (Repurposed as "Trusted Tools") */}
        <section className="border-b border-white/10 bg-zinc-950/30 px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-center text-base font-normal tracking-widest text-zinc-500 uppercase">
              Seamless Integration
            </h2>

            {/* Integration Grid */}
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4 lg:grid-cols-6">
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  Slack
                </span>
              </div>
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  GitHub
                </span>
              </div>
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  Figma
                </span>
              </div>
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  Linear
                </span>
              </div>
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  Jira
                </span>
              </div>
              <div className="flex h-24 items-center justify-center bg-black p-4">
                <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">
                  Notion
                </span>
              </div>
            </div>

            {/* Side Quests / Gamification */}
            <div className="relative mt-16 flex flex-col items-start justify-between gap-8 overflow-hidden border border-[#bfa0e0]/30 bg-[#bfa0e0]/5 p-8 md:flex-row md:items-center md:p-12">
              {/* Tech accent */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#bfa0e0] opacity-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 m-4 h-8 w-8 border-b-2 border-l-2 border-[#bfa0e0] opacity-50"></div>
              <div className="absolute top-0 right-0 m-4 h-8 w-8 border-t-2 border-r-2 border-[#bfa0e0] opacity-50"></div>

              <div className="relative z-10 max-w-xl">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-[#bfa0e0]" strokeWidth={1.5} />
                  <span className="font-mono text-xs tracking-widest text-[#bfa0e0] uppercase">
                    Power Up Activated
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-normal tracking-tight uppercase md:text-3xl">
                  Pro Features Available
                </h3>
                <p className="text-base leading-relaxed font-light text-zinc-400">
                  Upgrade to{" "}
                  <strong className="font-normal text-white">Locus Plus</strong>{" "}
                  for unlimited cloud storage, team permissions, and advanced
                  OCR capabilities.
                </p>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 md:h-32 md:w-32">
                  <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-[#bfa0e0] border-t-transparent"></div>
                  <span className="font-mono text-sm tracking-widest">
                    PRO+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Location Section */}
        <section
          id="location"
          className="border-b border-white/10 px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col gap-8">
              <h2 className="text-4xl font-normal tracking-tight uppercase md:text-6xl">
                Global
                <br />
                <span className="text-zinc-500">Access</span>
              </h2>

              <div className="space-y-6 border-l-2 border-white/10 pl-6">
                <div>
                  <p className="mb-1 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    Status
                  </p>
                  <p className="text-xl font-normal tracking-tight text-white uppercase md:text-2xl">
                    Online / Synchronized
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    Architecture
                  </p>
                  <p className="text-lg font-light tracking-wide text-zinc-400">
                    Decentralized Storage
                    <br />
                    Edge Network Delivery
                  </p>
                </div>
              </div>

              <Link
                href="/download"
                className="mt-4 inline-flex items-center gap-2 text-sm font-normal tracking-widest text-[#bfa0e0] uppercase transition-colors hover:text-white"
              >
                <MapPin className="h-5 w-5" strokeWidth={1.5} />
                Get Your Access Key
              </Link>
            </div>

            {/* Minimalist Map Placeholder */}
            <div className="group relative aspect-square overflow-hidden border border-white/10 bg-zinc-950 md:aspect-video lg:aspect-square">
              {/* Abstract grid representing map */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Radar/Pulse effect */}
              <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-[#bfa0e0]/30"></div>
              <div className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#bfa0e0]/50"></div>

              {/* Pin */}
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-[#bfa0e0] shadow-[0_0_15px_#bfa0e0]"></div>
                <div className="h-8 w-px bg-gradient-to-b from-[#bfa0e0] to-transparent"></div>
              </div>

              {/* Overlay text */}
              <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
                <span className="font-mono text-xs tracking-widest text-zinc-600">
                  LOCUS: ACTIVE
                  <br />
                  USER: AUTHORIZED
                </span>
                <div className="border border-white/10 bg-black/80 px-3 py-1 font-mono text-xs tracking-widest text-white backdrop-blur">
                  SYS.DAT
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Registration / CTA Section */}
        <section
          id="register"
          className="relative overflow-hidden bg-[#bfa0e0] px-6 py-24 text-zinc-950 md:px-12 md:py-40"
        >
          {/* Background typographic texture */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden opacity-[0.03]">
            <span className="text-[15rem] leading-none font-medium tracking-tight whitespace-nowrap text-black">
              LOCUS LOCUS LOCUS
            </span>
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            <Ticket className="h-12 w-12 text-zinc-950" strokeWidth={1.5} />
            <h2 className="text-4xl leading-[0.9] font-medium tracking-tight uppercase md:text-6xl lg:text-7xl">
              Get Locus Now
              <br />
              <span className="text-zinc-800">Elevate Your Captures</span>
            </h2>

            <p className="mt-4 max-w-2xl text-lg font-normal tracking-tight text-zinc-800 md:text-2xl">
              Experience the next level of visual collaboration. Free for
              individuals. Powerful for teams.
            </p>

            <Link
              href="/download"
              className="group mt-8 flex items-center justify-center gap-3 border border-transparent bg-zinc-950 px-12 py-5 text-sm font-medium tracking-widest text-white uppercase transition-all hover:border-zinc-950 hover:bg-zinc-800"
            >
              Download for Desktop
              <span className="border-l border-zinc-700 py-1 pl-3 font-mono text-xs text-zinc-400 group-hover:text-zinc-300">
                v1.2.0
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-2xl leading-none font-medium tracking-tight text-zinc-100">
              Locus
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <LinkIcon className="h-6 w-6" strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <Mail className="h-6 w-6" strokeWidth={1.5} />
            </a>
          </div>

          <p className="font-mono text-xs tracking-widest text-zinc-600 uppercase">
            © 2024 Locus Smart Capture. End of transmission.
          </p>
        </div>
      </footer>
    </div>
  )
}
