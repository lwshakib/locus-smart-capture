/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from "@workspace/ui/lib/utils"
import { Kbd } from "@workspace/ui/components/kbd"
import { 
  Monitor as RawMonitor,
  Layout as RawLayout,
  MonitorDot as RawMonitorDot,
  Crop as RawCrop,
  Image as RawImageIcon,
  Trash2 as RawTrash2,
  Loader2 as RawLoader2
} from 'lucide-react'
import React from 'react'

type LucideIcon = any
const Monitor = RawMonitor as any
const Layout = RawLayout as any
const MonitorDot = RawMonitorDot as any
const Crop = RawCrop as any
const ImageIcon = RawImageIcon as any
const Trash2 = RawTrash2 as any
const Spinner = RawLoader2 as any






const NavItem = React.forwardRef<
  HTMLButtonElement,
  { 
    icon: LucideIcon, 
    label: string, 
    shortcut?: string,
    onClick?: () => void 
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ icon: Icon, label, shortcut, onClick, className, ...props }, ref) => {
  return (
    <button 
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full px-2 py-1.5 text-[11px] font-medium rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground hover:text-foreground transition-all group",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-foreground transition-colors" />
        <span className="truncate">{label}</span>
      </div>
      {shortcut && (
        <Kbd className="text-[9px] opacity-40 group-hover:opacity-100 transition-opacity bg-background/50 border-muted-foreground/20">
          {shortcut}
        </Kbd>
      )}
    </button>
  )
})
NavItem.displayName = "NavItem"



type Capture = {
  id: string
  name: string
  url: string
  timestamp: number
}

function CaptureCard({ 
  capture,
  onDelete
}: { 
  capture: Capture,
  onDelete: (id: string) => void
}) {
  const handleOpen = () => {
    window.ipcRenderer.invoke('open-capture', capture.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(capture.id)
  }

  return (
    <div 
      onClick={handleOpen}
      className="group relative overflow-hidden rounded-md bg-muted/10 border border-border/40 transition-all shadow-sm cursor-pointer"
    >
      <img 
        src={capture.url} 
        alt={capture.name} 
        className="w-full h-auto object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <p className="text-[9px] text-white/80 font-medium truncate">
          {new Date(capture.timestamp).toLocaleString()}
        </p>
      </div>

      <button 
        onClick={handleDelete}
        className="absolute top-1.5 right-1.5 p-1.5 rounded bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}


function CaptureGallery({ refreshKey }: { refreshKey: number }) {
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCaptures = async () => {
    try {
      const data = await window.ipcRenderer.invoke('get-captures')
      setCaptures(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaptures()
  }, [refreshKey])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (captures.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
      <ImageIcon className="w-10 h-10 mb-4" />
      <p className="text-[11px] max-w-[150px]">Your captures will appear here.</p>
    </div>
  )

  // Balanced column distribution
  const columnCount = 3
  const columns = Array.from({ length: columnCount }, () => [] as Capture[])
  captures.forEach((cap, i) => {
    columns[i % columnCount].push(cap)
  })

  const handleDelete = async (id: string) => {
    try {
      const res = await window.ipcRenderer.invoke('delete-capture', id)
      if (res.success) {
        setCaptures(prev => prev.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  return (
    <div className="flex-1 p-2 overflow-y-auto no-scrollbar">
      <div className="flex gap-3 items-start">
        {columns.map((col, i) => (
          <div key={i} className="flex-1 flex flex-col gap-3">
            {col.map((cap) => (
              <CaptureCard key={cap.id} capture={cap} onDelete={handleDelete} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


function WindowSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [windows, setWindows] = useState<{ id: string, name: string, thumbnail: string }[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWindows = async () => {
    setLoading(true)
    try {
      const list = await window.ipcRenderer.invoke('get-windows')
      setWindows(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWindows()
  }, [])

  return (
    <div className="w-64 p-2 flex flex-col gap-2">
      {loading && (
        <div className="flex items-center justify-center py-2">
          <Spinner className="w-4 h-4 animate-spin text-indigo-500" />
        </div>
      )}
      <div className="max-h-[300px] overflow-y-auto no-scrollbar flex flex-col gap-1">

        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => onSelect(win.id)}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-sidebar-accent transition-colors text-left group"
          >
            <div className="w-12 h-8 rounded border border-border/40 bg-muted/20 overflow-hidden flex-shrink-0">
               <img src={win.thumbnail} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] truncate flex-1 font-medium">{win.name}</span>
          </button>
        ))}
        {!loading && windows.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">No active windows found</p>
        )}
      </div>
    </div>
  )
}


function MonitorSelector({ onSelect }: { onSelect: (index: number) => void }) {
  const [monitors, setMonitors] = useState<{ name: string, resolution: string, isPrimary: boolean, index: number }[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMonitors = async () => {
    setLoading(true)
    try {
      const list = await window.ipcRenderer.invoke('get-monitors')
      setMonitors(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitors()
  }, [])

  return (
    <div className="w-48 p-2 flex flex-col gap-1">
      {loading && (
        <div className="flex items-center justify-center py-2">
          <Spinner className="w-4 h-4 animate-spin text-indigo-500" />
        </div>
      )}
      {monitors.map(monitor => (
        <button
          key={monitor.index}
          onClick={() => onSelect(monitor.index)}
          className="flex flex-col p-2 rounded hover:bg-sidebar-accent transition-colors text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-medium">{monitor.name}</span>
            {monitor.isPrimary && (
               <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1 rounded uppercase font-bold tracking-tighter">Primary</span>
            )}
          </div>
          <span className="text-[9px] text-muted-foreground">{monitor.resolution}</span>
        </button>
      ))}
      {!loading && monitors.length === 0 && (
        <p className="text-[10px] text-muted-foreground text-center py-4">No monitors detected</p>
      )}
    </div>
  )
}



function RegionSelectorOverlay() {
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const currentRef = useRef<{ x: number; y: number } | null>(null)
  const pointerActiveRef = useRef(false)

  // Direct DOM references for lag-free rendering
  const fullOverlayRef = useRef<HTMLDivElement>(null)
  const topOverlayRef = useRef<HTMLDivElement>(null)
  const bottomOverlayRef = useRef<HTMLDivElement>(null)
  const leftOverlayRef = useRef<HTMLDivElement>(null)
  const rightOverlayRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Instantly reset coordinates and border styles to prevent screen flashes on reopen
        startRef.current = null
        currentRef.current = null
        pointerActiveRef.current = false

        if (fullOverlayRef.current) fullOverlayRef.current.style.display = 'block'
        if (topOverlayRef.current) {
          topOverlayRef.current.style.display = 'none'
          topOverlayRef.current.style.height = ''
        }
        if (bottomOverlayRef.current) {
          bottomOverlayRef.current.style.display = 'none'
          bottomOverlayRef.current.style.top = ''
        }
        if (leftOverlayRef.current) {
          leftOverlayRef.current.style.display = 'none'
          leftOverlayRef.current.style.top = ''
          leftOverlayRef.current.style.height = ''
          leftOverlayRef.current.style.width = ''
        }
        if (rightOverlayRef.current) {
          rightOverlayRef.current.style.display = 'none'
          rightOverlayRef.current.style.top = ''
          rightOverlayRef.current.style.height = ''
          rightOverlayRef.current.style.left = ''
        }
        if (borderRef.current) {
          borderRef.current.style.display = 'none'
          borderRef.current.style.left = ''
          borderRef.current.style.top = ''
          borderRef.current.style.width = ''
          borderRef.current.style.height = ''
        }

        window.ipcRenderer.invoke('cancel-region-selector')
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Listen to prepare-selector reset signal for high-speed reuse
    const cleanup = window.ipcRenderer.on('prepare-selector', () => {
      startRef.current = null
      currentRef.current = null
      pointerActiveRef.current = false

      if (fullOverlayRef.current) fullOverlayRef.current.style.display = 'block'
      if (topOverlayRef.current) {
        topOverlayRef.current.style.display = 'none'
        topOverlayRef.current.style.height = ''
      }
      if (bottomOverlayRef.current) {
        bottomOverlayRef.current.style.display = 'none'
        bottomOverlayRef.current.style.top = ''
      }
      if (leftOverlayRef.current) {
        leftOverlayRef.current.style.display = 'none'
        leftOverlayRef.current.style.top = ''
        leftOverlayRef.current.style.height = ''
        leftOverlayRef.current.style.width = ''
      }
      if (rightOverlayRef.current) {
        rightOverlayRef.current.style.display = 'none'
        rightOverlayRef.current.style.top = ''
        rightOverlayRef.current.style.height = ''
        rightOverlayRef.current.style.left = ''
      }
      if (borderRef.current) {
        borderRef.current.style.display = 'none'
        borderRef.current.style.left = ''
        borderRef.current.style.top = ''
        borderRef.current.style.width = ''
        borderRef.current.style.height = ''
      }
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (typeof cleanup === 'function') cleanup()
    }
  }, [])

  useEffect(() => {
    // Enforce 1/255 alpha background to capture all mouse events and prevent click-through
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.004)'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  const endPointerDrag = useCallback(() => {
    const start = startRef.current
    const current = currentRef.current
    startRef.current = null
    currentRef.current = null
    pointerActiveRef.current = false

    // Reset direct DOM overlay styles
    if (fullOverlayRef.current) {
      fullOverlayRef.current.style.display = 'block'
    }
    if (topOverlayRef.current) topOverlayRef.current.style.display = 'none'
    if (bottomOverlayRef.current) bottomOverlayRef.current.style.display = 'none'
    if (leftOverlayRef.current) leftOverlayRef.current.style.display = 'none'
    if (rightOverlayRef.current) rightOverlayRef.current.style.display = 'none'
    if (borderRef.current) borderRef.current.style.display = 'none'

    if (start && current) {
      const x = Math.round(Math.min(start.x, current.x))
      const y = Math.round(Math.min(start.y, current.y))
      const width = Math.round(Math.abs(current.x - start.x))
      const height = Math.round(Math.abs(current.y - start.y))

      if (width > 5 && height > 5) {
        void window.ipcRenderer.invoke('capture-region', { x, y, width, height })
      } else {
        void window.ipcRenderer.invoke('cancel-region-selector')
      }
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    startRef.current = { x: e.clientX, y: e.clientY }
    currentRef.current = { x: e.clientX, y: e.clientY }
    pointerActiveRef.current = true
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const x = e.clientX
    const y = e.clientY

    if (startRef.current) {
      currentRef.current = { x, y }
      
      const start = startRef.current
      const left = Math.min(start.x, x)
      const top = Math.min(start.y, y)
      const width = Math.abs(x - start.x)
      const height = Math.abs(y - start.y)

      // Hide the initial full-screen translucent overlay when active dragging begins
      if (fullOverlayRef.current) {
        fullOverlayRef.current.style.display = 'none'
      }

      // Reposition and display highly efficient viewport cutout overlays
      if (topOverlayRef.current) {
        topOverlayRef.current.style.display = 'block'
        topOverlayRef.current.style.height = `${top}px`
      }
      if (bottomOverlayRef.current) {
        bottomOverlayRef.current.style.display = 'block'
        bottomOverlayRef.current.style.top = `${top + height}px`
      }
      if (leftOverlayRef.current) {
        leftOverlayRef.current.style.display = 'block'
        leftOverlayRef.current.style.top = `${top}px`
        leftOverlayRef.current.style.height = `${height}px`
        leftOverlayRef.current.style.width = `${left}px`
      }
      if (rightOverlayRef.current) {
        rightOverlayRef.current.style.display = 'block'
        rightOverlayRef.current.style.top = `${top}px`
        rightOverlayRef.current.style.height = `${height}px`
        rightOverlayRef.current.style.left = `${left + width}px`
      }
      if (borderRef.current) {
        borderRef.current.style.display = 'block'
        borderRef.current.style.left = `${left}px`
        borderRef.current.style.top = `${top}px`
        borderRef.current.style.width = `${width}px`
        borderRef.current.style.height = `${height}px`
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    endPointerDrag()
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    endPointerDrag()
  }

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-crosshair select-none touch-none bg-black/[0.001]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Full Screen Translucent Overlay (active before dragging) */}
      <div ref={fullOverlayRef} className="pointer-events-none absolute inset-0 bg-black/35" />

      {/* 4 Viewport Cutout Overlays (active during dragging, surrounding the selection) */}
      <div 
        ref={topOverlayRef} 
        className="pointer-events-none absolute bg-black/35 left-0 top-0 right-0" 
        style={{ display: 'none' }} 
      />
      <div 
        ref={bottomOverlayRef} 
        className="pointer-events-none absolute bg-black/35 left-0 right-0 bottom-0" 
        style={{ display: 'none' }} 
      />
      <div 
        ref={leftOverlayRef} 
        className="pointer-events-none absolute bg-black/35 left-0" 
        style={{ display: 'none' }} 
      />
      <div 
        ref={rightOverlayRef} 
        className="pointer-events-none absolute bg-black/35 right-0" 
        style={{ display: 'none' }} 
      />

      {/* Active Selection Outline */}
      <div
        ref={borderRef}
        className="pointer-events-none absolute box-border border-2 border-indigo-500"
        style={{ display: 'none' }}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-medium pointer-events-none select-none">
        Drag to select region • Esc to cancel
      </div>
    </div>
  )
}


function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isWindowSelectorOpen, setIsWindowSelectorOpen] = useState(false)
  const [isMonitorSelectorOpen, setIsMonitorSelectorOpen] = useState(false)

  useEffect(() => {
    // Sync with system theme
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    updateTheme(darkQuery)
    darkQuery.addEventListener('change', updateTheme)

    // Listen for global hotkey captures
    const cleanup = window.ipcRenderer.on('hotkey-capture', () => {
      setRefreshKey(prev => prev + 1)
    })

    return () => {
      darkQuery.removeEventListener('change', updateTheme)
      if (typeof cleanup === 'function') cleanup()
    }
  }, [])

  const [currentHash, setCurrentHash] = useState(() => window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isRegionManual = currentHash === '#region-manual'

  if (isRegionManual) return <RegionSelectorOverlay />

  const handleCapture = async () => {
    setIsCapturing(true)
    try {
      await window.ipcRenderer.invoke('capture-full-screen')
      setRefreshKey(prev => prev + 1)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleWindowSelected = async (id: string) => {
    setIsWindowSelectorOpen(false)
    setIsCapturing(true)
    try {
      await window.ipcRenderer.invoke('capture-window', id)
      setRefreshKey(prev => prev + 1)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleMonitorSelected = async (index: number) => {
    setIsMonitorSelectorOpen(false)
    setIsCapturing(true)
    try {
      await window.ipcRenderer.invoke('capture-monitor', index)
      setRefreshKey(prev => prev + 1)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleRegionCapture = () => {
    window.ipcRenderer.invoke('open-region-selector')
  }

  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none font-sans">
      {/* Left Pane (Minimal Actions) */}
      <aside className="w-[180px] bg-background flex flex-col p-2 space-y-1 transition-all duration-300">
        <NavItem icon={Monitor} label="Full screen" shortcut="Alt+Shift+S" onClick={handleCapture} />
        
        <div 
          className="relative"
          onMouseEnter={() => setIsWindowSelectorOpen(true)}
          onMouseLeave={() => setIsWindowSelectorOpen(false)}
        >
          <NavItem icon={Layout} label="Window" />
          {isWindowSelectorOpen && (
            <div className="absolute left-full top-0 ml-2 z-[100] border border-border/40 shadow-2xl bg-background/95 backdrop-blur-md rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-left">
              <WindowSelector onSelect={handleWindowSelected} />
            </div>
          )}
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsMonitorSelectorOpen(true)}
          onMouseLeave={() => setIsMonitorSelectorOpen(false)}
        >
          <NavItem icon={MonitorDot} label="Monitor" />
          {isMonitorSelectorOpen && (
            <div className="absolute left-full top-0 ml-2 z-[100] border border-border/40 shadow-2xl bg-background/95 backdrop-blur-md rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-left">
              <MonitorSelector onSelect={handleMonitorSelected} />
            </div>
          )}
        </div>

        <NavItem icon={Crop} label="Region" onClick={handleRegionCapture} />
      </aside>

      {/* Right Pane (Persistent Gallery) */}
      <section className="flex-1 bg-background flex flex-col relative border-l border-border/20">
        {isCapturing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-medium animate-pulse">Capturing...</p>
             </div>
          </div>
        )}

        <CaptureGallery refreshKey={refreshKey} />
      </section>
    </main>
  )
  }

export default App
