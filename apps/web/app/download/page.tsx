"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  Zap, 
  ShieldCheck, 
  Globe,
  Monitor,
  Laptop,
  Terminal,
  ArrowRight
} from "lucide-react";
import { Logo } from "@/components/logo";

type OSType = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<OSType>('Windows');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = window.navigator.userAgent;
    if (ua.indexOf('Win') !== -1) setDetectedOS('Windows');
    else if (ua.indexOf('Mac') !== -1) setDetectedOS('macOS');
    else if (ua.indexOf('Linux') !== -1) setDetectedOS('Linux');
    else setDetectedOS('Unknown');
  }, []);

  const getDownloadInfo = (os: OSType) => {
    switch (os) {
      case 'Windows': return { name: 'Locus_v1.2.0_x64.exe', icon: <Monitor className="w-5 h-5" /> };
      case 'macOS': return { name: 'Locus_v1.2.0_Universal.dmg', icon: <Laptop className="w-5 h-5" /> };
      case 'Linux': return { name: 'Locus-v1.2.0.AppImage', icon: <Terminal className="w-5 h-5" /> };
      default: return { name: 'Locus_v1.2.0_Setup.zip', icon: <Download className="w-5 h-5" /> };
    }
  };

  const currentInfo = getDownloadInfo(detectedOS);

  return (
    <div className="relative min-h-screen bg-black text-white font-space overflow-x-hidden selection:bg-[#bfa0e0] selection:text-white pb-32">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", 
          backgroundSize: "48px 48px" 
        }}
      />
      
      {/* Gradient Glow */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#bfa0e0] rounded-full blur-[180px] opacity-10 pointer-events-none z-0"
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="w-8 h-8" />
            <span className="text-2xl font-medium tracking-tight text-zinc-100 uppercase">Locus</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-light tracking-wide uppercase text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Base
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-40 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-24">
          
          {/* 1. Primary Download Section */}
          <div className="text-center flex flex-col items-center gap-12 max-w-3xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#bfa0e0]/30 bg-[#bfa0e0]/5 rounded-full text-[10px] font-mono tracking-widest uppercase text-[#bfa0e0]">
                <Zap className="w-3 h-3" />
                System Identified: {mounted ? (detectedOS === 'Unknown' ? 'Universal' : detectedOS) : 'Scanning...'}
              </div>
              <h1 className="text-5xl md:text-7xl font-normal tracking-tight uppercase">
                Get <span className="text-[#bfa0e0]">Locus</span>
              </h1>
              <p className="text-xl text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
                Initialize the ultimate visual capture suite on your workstation. Pixel precision, zero friction.
              </p>
            </div>

            {/* Main Download Box */}
            <div className="w-full bg-zinc-950/50 border border-white/10 p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#bfa0e0] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
              
              <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center bg-white/5">
                  <Download className="w-10 h-10 text-[#bfa0e0]" strokeWidth={1.2} />
                </div>

                <div className="space-y-4 w-full">
                  <button className="w-full py-5 bg-[#bfa0e0] text-zinc-950 text-base font-medium tracking-[0.2em] uppercase hover:bg-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-3">
                    Download for {mounted ? detectedOS : 'Desktop'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-xs font-mono tracking-widest text-zinc-600 uppercase">
                    Build: {mounted ? currentInfo.name : 'Initializing...'}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-mono tracking-widest uppercase">Verified Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-[9px] font-mono tracking-widest uppercase">Direct Setup</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-[9px] font-mono tracking-widest uppercase">Cloud Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. All Platforms Section */}
          <div className="w-full space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20"></div>
              <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-zinc-500">All Platforms</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Windows */}
              <div className="bg-zinc-950/30 border border-white/5 p-8 flex flex-col gap-6 hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between">
                  <Monitor className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-zinc-700">v1.2.0</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">Windows</h3>
                  <p className="text-sm font-light text-zinc-500 leading-relaxed">Integrated setup for Windows 10/11 with native hooks.</p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full py-3 bg-white/5 text-white text-[10px] font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all">Download .exe</button>
                  <button className="w-full py-3 border border-white/10 text-zinc-500 text-[10px] font-medium tracking-widest uppercase hover:text-white transition-all">Download .msi</button>
                </div>
              </div>

              {/* macOS */}
              <div className="bg-zinc-950/30 border border-white/5 p-8 flex flex-col gap-6 hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between">
                  <Laptop className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-zinc-700">v1.2.0</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">macOS</h3>
                  <p className="text-sm font-light text-zinc-500 leading-relaxed">Universal build optimized for M1/M2/M3 and Intel chips.</p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full py-3 bg-white/5 text-white text-[10px] font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all">Apple Silicon</button>
                  <button className="w-full py-3 border border-white/10 text-zinc-500 text-[10px] font-medium tracking-widest uppercase hover:text-white transition-all">Intel Version</button>
                </div>
              </div>

              {/* Linux */}
              <div className="bg-zinc-950/30 border border-white/5 p-8 flex flex-col gap-6 hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between">
                  <Terminal className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-mono text-zinc-700">v1.2.0</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-normal uppercase">Linux</h3>
                  <p className="text-sm font-light text-zinc-500 leading-relaxed">Stable distribution for Debian and Ubuntu based systems.</p>
                </div>
                <div className="mt-auto space-y-2">
                  <button className="w-full py-3 bg-white/5 text-white text-[10px] font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all">Download .AppImage</button>
                  <button className="w-full py-3 border border-white/10 text-zinc-500 text-[10px] font-medium tracking-widest uppercase hover:text-white transition-all">Download .deb</button>
                </div>
              </div>
            </div>
          </div>

          {/* Release info summary */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono tracking-[0.3em] text-zinc-700 uppercase">System Integrity Checked</span>
            <span className="text-sm font-light tracking-widest text-zinc-500 italic">"Simulate with precision, capture with purpose."</span>
          </div>

        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="fixed bottom-8 left-12 hidden lg:block">
        <span className="text-[10px] font-mono tracking-[0.5em] text-zinc-800 uppercase vertical-text">Access Authorized</span>
      </div>
    </div>
  );
}
