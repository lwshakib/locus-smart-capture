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
  CheckSquare, 
  FileOutput, 
  Globe, 
  Settings, 
  Command, 
  Terminal, 
  Cloud, 
  HardDrive,
  Folder, 
  History as HistoryIcon, 
  Image as ImageIcon, 
  Bug, 
  Heart, 
  MessageSquare, 
  Info 
} from 'lucide-react'

function NavItem({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: LucideIcon, 
  label: string,
  isActive?: boolean,
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-1.5 text-sm font-medium rounded-md transition-colors group",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "w-4 h-4 transition-colors",
        isActive ? "text-indigo-500" : "text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
      )} />
      <span className="truncate">{label}</span>
    </button>
  )
}

function Separator() {
  return <div className="h-px bg-border my-2 mx-2" />
}

function HotkeySettings() {
  const hotkeys = [
    { label: "Full screen capture", keys: ["Ctrl", "PrintScreen"] },
    { label: "Region capture", keys: ["PrintScreen"] },
    { label: "Window capture", keys: ["Alt", "PrintScreen"] },
    { label: "Last region capture", keys: ["Shift", "PrintScreen"] },
    { label: "Screen recording (custom)", keys: ["Shift", "PrintScreen"] },
    { label: "Screen recording (GIF)", keys: ["Ctrl", "Shift", "PrintScreen"] },
  ]

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Hotkey settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure keyboard shortcuts for various capture tasks.</p>
      </div>

      <div className="space-y-3">
        {hotkeys.map((hk, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium">{hk.label}</span>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {hk.keys.map((k, j) => (
                  <Kbd key={j}>{k}</Kbd>
                ))}
              </div>
              <Button variant="ghost" size="xs" className="text-xs h-7">Change</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type Capture = {
  id: string
  name: string
  url: string
  timestamp: number
}

function CaptureCard({ capture }: { capture: Capture }) {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-xl bg-muted/30 border border-border/50 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md cursor-pointer">
      <img 
        src={capture.url} 
        alt={capture.name} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
        <p className="text-[10px] text-white/80 font-medium truncate">
          {new Date(capture.timestamp).toLocaleString()}
        </p>
      </div>
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
      <ImageIcon className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold">No captures found</h3>
      <p className="text-sm max-w-[200px]">Captured screenshots will appear here.</p>
    </div>
  )

  return (
    <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-2 gap-4">
        {captures.map((cap) => (
          <CaptureCard key={cap.id} capture={cap} />
        ))}
      </div>
    </div>
  )
}

function App() {
  const [activeItem, setActiveItem] = useState("Full screen")
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
    setActiveItem("Full screen")
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
      {/* Left Pane (Narrower) */}
      <aside className="w-[240px] bg-background flex flex-col p-2 overflow-y-auto no-scrollbar transition-all duration-300">
        <div className="space-y-0.5">
          <NavItem 
            icon={Monitor} 
            label="Full screen" 
            isActive={activeItem === "Full screen"} 
            onClick={handleCapture} 
          />
          <NavItem icon={Layout} label="Window" isActive={activeItem === "Window"} onClick={() => setActiveItem("Window")} />
          <NavItem icon={MonitorDot} label="Monitor" isActive={activeItem === "Monitor"} onClick={() => setActiveItem("Monitor")} />
          <NavItem icon={Crop} label="Region" isActive={activeItem === "Region"} onClick={() => setActiveItem("Region")} />
          
          <Separator />
          
          <NavItem icon={CheckSquare} label="After capture tasks" isActive={activeItem === "After capture tasks"} onClick={() => setActiveItem("After capture tasks")} />
          <NavItem icon={FileOutput} label="After upload tasks" isActive={activeItem === "After upload tasks"} onClick={() => setActiveItem("After upload tasks")} />
          <NavItem icon={Globe} label="Destinations" isActive={activeItem === "Destinations"} onClick={() => setActiveItem("Destinations")} />
          
          <Separator />
          
          <NavItem icon={Settings} label="Application settings..." isActive={activeItem === "Application settings..."} onClick={() => setActiveItem("Application settings...")} />
          <NavItem icon={Command} label="Task settings..." isActive={activeItem === "Task settings..."} onClick={() => setActiveItem("Task settings...")} />
          <NavItem icon={Terminal} label="Hotkey settings..." isActive={activeItem === "Hotkey settings..."} onClick={() => setActiveItem("Hotkey settings...")} />
          <NavItem icon={Cloud} label="Destination settings..." isActive={activeItem === "Destination settings..."} onClick={() => setActiveItem("Destination settings...")} />
          <NavItem icon={HardDrive} label="Custom uploader settings..." isActive={activeItem === "Custom uploader settings..."} onClick={() => setActiveItem("Custom uploader settings...")} />
          
          <Separator />
          
          <NavItem icon={Folder} label="Screenshots folder..." isActive={activeItem === "Screenshots folder..."} onClick={() => setActiveItem("Screenshots folder...")} />
          <NavItem icon={HistoryIcon} label="History..." isActive={activeItem === "History..."} onClick={() => setActiveItem("History...")} />
          <NavItem icon={ImageIcon} label="Image history..." isActive={activeItem === "Image history..."} onClick={() => setActiveItem("Image history...")} />
          
          <Separator />
          
          <NavItem icon={Bug} label="Debug" isActive={activeItem === "Debug"} onClick={() => setActiveItem("Debug")} />
          <NavItem icon={Heart} label="Donate..." isActive={activeItem === "Donate..."} onClick={() => setActiveItem("Donate...")} />
          <NavItem icon={MessageSquare} label="Discord..." isActive={activeItem === "Discord..."} onClick={() => setActiveItem("Discord...")} />
          <NavItem icon={Info} label="About..." isActive={activeItem === "About..."} onClick={() => setActiveItem("About...")} />
        </div>
      </aside>

      {/* Right Pane (Wider) */}
      <section className="flex-1 bg-background flex flex-col relative">
        {isCapturing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse">Capturing...</p>
             </div>
          </div>
        )}

        {activeItem === "Hotkey settings..." ? (
          <HotkeySettings />
        ) : activeItem === "Full screen" ? (
          <CaptureGallery refreshKey={refreshKey} />
        ) : (
          <div className="flex-1" />
        )}
      </section>
    </main>
  )
}

export default App
