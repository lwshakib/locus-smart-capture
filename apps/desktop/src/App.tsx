import { useState, useEffect } from 'react'
import { cn } from "@workspace/ui/lib/utils"
import { Kbd } from "@workspace/ui/components/kbd"
import { Button } from "@workspace/ui/components/button"
import { 
  LucideIcon,
  Monitor,
  Layout,
  MonitorDot,
  Crop,
  Image as ImageIcon,
  Trash2
} from 'lucide-react'


function NavItem({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: LucideIcon, 
  label: string,
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 w-full px-2 py-1.5 text-[11px] font-medium rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground hover:text-foreground transition-all group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-foreground transition-colors" />
      <span className="truncate">{label}</span>
    </button>
  )
}

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


function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)

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
    return () => darkQuery.removeEventListener('change', updateTheme)
  }, [])

  const handleCapture = async () => {
    setIsCapturing(true)
    try {
      await window.ipcRenderer.invoke('capture-full-screen')
      setRefreshKey(prev => prev + 1)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none font-sans">
      {/* Left Pane (Minimal Actions) */}
      <aside className="w-[180px] bg-background flex flex-col p-2 space-y-1 transition-all duration-300">
          <NavItem icon={Monitor} label="Full screen" onClick={handleCapture} />
          <NavItem icon={Layout} label="Window" />
          <NavItem icon={MonitorDot} label="Monitor" />
          <NavItem icon={Crop} label="Region" />
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
