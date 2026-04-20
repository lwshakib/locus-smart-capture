"use client";

import React from "react";
import Link from "next/link";
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
  Download
} from "lucide-react";
import { Logo } from "@/components/logo";

export default function Page() {
  return (
    <div className="relative">
      {/* Subtle Abstract Background Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", 
          backgroundSize: "48px 48px" 
        }}
      />
      
      {/* Top Gradient Glow */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#bfa0e0] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"
      />

      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
            
            {/* Logo Custom Implementation */}
            <Link href="/" className="flex items-center gap-2 group">
                <Logo className="w-8 h-8" />
                <span className="text-2xl font-medium tracking-tight text-zinc-100 leading-none">Locus</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-light tracking-wide uppercase text-zinc-400 hover:text-white transition-colors">Features</a>
                <a href="#workflow" className="text-sm font-light tracking-wide uppercase text-zinc-400 hover:text-white transition-colors">Workflow</a>
                <a href="#location" className="text-sm font-light tracking-wide uppercase text-zinc-400 hover:text-white transition-colors">Coordinates</a>
                <Link href="/download" className="text-sm font-normal tracking-wide uppercase text-[#bfa0e0] hover:text-white transition-colors flex items-center gap-1">
                    Download <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-zinc-400 hover:text-white">
                <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main className="relative z-10">

        {/* 2. Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-6 md:px-12 relative overflow-hidden border-b border-white/10">
            <div className="max-w-7xl mx-auto w-full flex flex-col items-start gap-8 z-10">
                
                {/* Eyebrow */}
                <div className="flex items-center gap-3 border border-white/10 rounded-full px-4 py-1.5 bg-white/5 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-[#bfa0e0] animate-pulse"></span>
                    <span className="text-xs font-normal tracking-widest uppercase text-zinc-300">v1.2.0 Stable</span>
                </div>

                {/* Massive Headline */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight uppercase leading-[0.9] flex flex-col">
                    <span className="text-zinc-500">Smart</span>
                    <span className="text-white">Visual</span>
                    <span className="text-[#bfa0e0]">Capture</span>
                </h1>

                {/* Sub-headline */}
                <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-l-2 border-[#bfa0e0] pl-4 md:pl-6">
                    <p className="text-lg md:text-2xl font-light text-zinc-400 tracking-tight max-w-2xl">
                        The ultimate desktop utility for precise window selection, instant exports, and seamless team collaboration.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-normal tracking-widest uppercase text-white">
                        <span>macOS</span>
                        <span className="text-zinc-700">|</span>
                        <span>Windows</span>
                        <span className="text-zinc-700">|</span>
                        <span>Linux</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                    <Link href="/download" className="w-full sm:w-auto px-8 py-4 bg-[#bfa0e0] text-zinc-950 text-sm font-medium tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 group">
                        Download for Desktop
                        <Download className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white text-sm font-light tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center text-center">
                        Explore Features
                    </a>
                </div>
            </div>
            
            {/* Hero Abstract Elements */}
            <div 
              className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-30 pointer-events-none mix-blend-screen" 
              style={{ 
                backgroundImage: "repeating-linear-gradient(45deg, #bfa0e0 0, #bfa0e0 1px, transparent 1px, transparent 10px)" 
              }}
            />
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                
                <div className="lg:col-span-4">
                    <h2 className="text-3xl md:text-5xl font-normal tracking-tight uppercase sticky top-32">
                        Why<br />
                        <span className="text-zinc-500">Choose</span><br />
                        Locus?
                    </h2>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        <MousePointer2 className="w-8 h-8 text-[#bfa0e0]" strokeWidth={1.5} />
                        <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Precision Selection</h3>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            No more manual cropping. Our advanced hover-detection engine identifies window boundaries automatically for a perfect capture every time.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        <Zap className="w-8 h-8 text-[#bfa0e0]" strokeWidth={1.5} />
                        <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Instant Workflow</h3>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            Capture, annotate, and share in seconds. Integrated clipboard sync and cloud uploads keep your team in the loop without the friction.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        <Layers className="w-8 h-8 text-[#bfa0e0]" strokeWidth={1.5} />
                        <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Multi-Layer Support</h3>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            Switch between active windows, child elements, or full-screen captures with a single shortcut. Total control at your fingertips.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        <Network className="w-8 h-8 text-[#bfa0e0]" strokeWidth={1.5} />
                        <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Team Sync</h3>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            Organize captures into shared spaces. Collaborate with your team by adding context directly to every visual asset.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. Workflow Section */}
        <section id="workflow" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/10 bg-zinc-950/50">
            <div className="max-w-4xl mx-auto">
                
                <h2 className="text-4xl md:text-6xl font-normal tracking-tight uppercase mb-16 md:mb-24 text-center">How it Works<span className="text-[#bfa0e0]">.</span></h2>

                <div className="relative border-l border-white/10 ml-4 md:ml-0">
                    
                    {/* Step 1 */}
                    <div className="relative pl-8 md:pl-12 pb-16 group">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-black group-hover:bg-[#bfa0e0] transition-colors"></div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                            <div className="md:w-32 flex-shrink-0">
                                <span className="text-base font-mono tracking-widest text-zinc-500 group-hover:text-white transition-colors">BOOT</span>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Initialize System</h3>
                                <p className="text-base font-light text-zinc-400 mt-2 tracking-wide">Launch Locus. It lives in your system tray, always ready to capture the next moment.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-8 md:pl-12 pb-16 group">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-black group-hover:bg-[#bfa0e0] transition-colors"></div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                            <div className="md:w-32 flex-shrink-0">
                                <span className="text-base font-mono tracking-widest text-zinc-500 group-hover:text-white transition-colors">SELECT</span>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Hover & Detect</h3>
                                <p className="text-base font-light text-zinc-400 mt-2 tracking-wide">Simply hover over any window. Locus automatically highlights the active element with pixel precision.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative pl-8 md:pl-12 pb-16 group">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-black group-hover:bg-[#bfa0e0] transition-colors"></div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                            <div className="md:w-32 flex-shrink-0">
                                <span className="text-base font-mono tracking-widest text-zinc-500 group-hover:text-white transition-colors">CAPTURE</span>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Click to Snap</h3>
                                <p className="text-base font-light text-zinc-400 mt-2 tracking-wide">Click to capture. Your screenshot is instantly saved, copied to the clipboard, and ready to share.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative pl-8 md:pl-12 group">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-black group-hover:bg-[#bfa0e0] transition-colors shadow-[0_0_10px_#bfa0e0]"></div>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                            <div className="md:w-32 flex-shrink-0">
                                <span className="text-base font-mono tracking-widest text-zinc-500 group-hover:text-white transition-colors">SYNC</span>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-normal tracking-tight uppercase">Collaborate & Export</h3>
                                <p className="text-base font-light text-zinc-400 mt-2 tracking-wide">Add notes and tags. Sync with your team workspace to keep everyone aligned on the vision.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* 5. Partnership Section (Repurposed as "Trusted Tools") */}
        <section className="py-24 md:py-32 px-6 md:px-12 border-b border-white/10 bg-zinc-950/30">
            <div className="max-w-7xl mx-auto">
                
                <h2 className="text-base font-normal tracking-widest uppercase text-zinc-500 text-center mb-12">Seamless Integration</h2>

                {/* Integration Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/10 border border-white/10">
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">Slack</span>
                    </div>
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">GitHub</span>
                    </div>
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">Figma</span>
                    </div>
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">Linear</span>
                    </div>
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">Jira</span>
                    </div>
                    <div className="bg-black h-24 flex items-center justify-center p-4">
                        <span className="text-lg font-medium tracking-tight text-zinc-600 uppercase">Notion</span>
                    </div>
                </div>

                {/* Side Quests / Gamification */}
                <div className="mt-16 border border-[#bfa0e0]/30 bg-[#bfa0e0]/5 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Tech accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#bfa0e0] opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#bfa0e0] m-4 opacity-50"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#bfa0e0] m-4 opacity-50"></div>

                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-6 h-6 text-[#bfa0e0]" strokeWidth={1.5} />
                            <span className="text-xs font-mono tracking-widest uppercase text-[#bfa0e0]">Power Up Activated</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-normal tracking-tight uppercase mb-4">Pro Features Available</h3>
                        <p className="text-base text-zinc-400 font-light leading-relaxed">
                            Upgrade to <strong className="text-white font-normal">Locus Plus</strong> for unlimited cloud storage, team permissions, and advanced OCR capabilities.
                        </p>
                    </div>
                    
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 border border-white/20 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 border border-[#bfa0e0] rounded-full animate-[spin_10s_linear_infinite] border-t-transparent"></div>
                            <span className="text-sm font-mono tracking-widest">PRO+</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        {/* 6. Location Section */}
        <section id="location" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                
                <div className="flex flex-col gap-8">
                    <h2 className="text-4xl md:text-6xl font-normal tracking-tight uppercase">Global<br /><span className="text-zinc-500">Access</span></h2>
                    
                    <div className="space-y-6 border-l-2 border-white/10 pl-6">
                        <div>
                            <p className="text-xs font-mono tracking-widest uppercase text-zinc-500 mb-1">Status</p>
                            <p className="text-xl md:text-2xl font-normal tracking-tight uppercase text-white">Online / Synchronized</p>
                        </div>
                        <div>
                            <p className="text-xs font-mono tracking-widest uppercase text-zinc-500 mb-1">Architecture</p>
                            <p className="text-lg font-light tracking-wide text-zinc-400">Decentralized Storage<br />Edge Network Delivery</p>
                        </div>
                    </div>

                    <Link href="/download" className="inline-flex items-center gap-2 text-sm font-normal tracking-widest uppercase text-[#bfa0e0] hover:text-white transition-colors mt-4">
                        <MapPin className="w-5 h-5" strokeWidth={1.5} />
                        Get Your Access Key
                    </Link>
                </div>

                {/* Minimalist Map Placeholder */}
                <div className="aspect-square md:aspect-video lg:aspect-square bg-zinc-950 border border-white/10 relative overflow-hidden group">
                    {/* Abstract grid representing map */}
                    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                    
                    {/* Radar/Pulse effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#bfa0e0]/30 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-[#bfa0e0]/50 rounded-full"></div>
                    
                    {/* Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3 h-3 bg-[#bfa0e0] rounded-full shadow-[0_0_15px_#bfa0e0]"></div>
                        <div className="w-px h-8 bg-gradient-to-b from-[#bfa0e0] to-transparent"></div>
                    </div>

                    {/* Overlay text */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-xs font-mono tracking-widest text-zinc-600">LOCUS: ACTIVE<br />USER: AUTHORIZED</span>
                        <div className="bg-black/80 backdrop-blur px-3 py-1 border border-white/10 text-xs font-mono tracking-widest text-white">SYS.DAT</div>
                    </div>
                </div>

            </div>
        </section>

        {/* 7. Registration / CTA Section */}
        <section id="register" className="bg-[#bfa0e0] text-zinc-950 py-24 md:py-40 px-6 md:px-12 relative overflow-hidden">
            {/* Background typographic texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-col justify-center overflow-hidden">
                <span className="text-[15rem] leading-none font-medium tracking-tight whitespace-nowrap text-black">LOCUS LOCUS LOCUS</span>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
                <Ticket className="w-12 h-12 text-zinc-950" strokeWidth={1.5} />
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight uppercase leading-[0.9]">
                    Get Locus Now<br />
                    <span className="text-zinc-800">Elevate Your Captures</span>
                </h2>
                
                <p className="text-lg md:text-2xl font-normal tracking-tight mt-4 max-w-2xl text-zinc-800">
                    Experience the next level of visual collaboration. Free for individuals. Powerful for teams.
                </p>

                <Link href="/download" className="mt-8 px-12 py-5 bg-zinc-950 text-white text-sm font-medium tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group border border-transparent hover:border-zinc-950">
                    Download for Desktop
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-300 border-l border-zinc-700 pl-3 py-1">v1.2.0</span>
                </Link>
            </div>
        </section>

      </main>

      {/* 8. Footer */}
      <footer className="bg-black py-12 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            
            <Link href="/" className="flex items-center gap-2 group">
                <Logo className="w-8 h-8" />
                <span className="text-2xl font-medium tracking-tight text-zinc-100 leading-none">Locus</span>
            </Link>

            <div className="flex items-center gap-6">
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                    <LinkIcon className="w-6 h-6" strokeWidth={1.5} />
                </a>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                    <Mail className="w-6 h-6" strokeWidth={1.5} />
                </a>
            </div>

            <p className="text-xs font-mono tracking-widest text-zinc-600 uppercase">
                © 2024 Locus Smart Capture. End of transmission.
            </p>
            
        </div>
      </footer>
    </div>
  );
}
