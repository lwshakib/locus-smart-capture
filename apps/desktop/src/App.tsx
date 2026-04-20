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

function App() {
  const [activeItem, setActiveItem] = useState("Full screen")

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

  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none font-sans">
      {/* Left Pane (Narrower) */}
      <aside className="w-[240px] bg-background flex flex-col p-2 overflow-y-auto no-scrollbar transition-all duration-300">
        <div className="space-y-0.5">
          <NavItem icon={Monitor} label="Full screen" isActive={activeItem === "Full screen"} onClick={() => setActiveItem("Full screen")} />
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
      <section className="flex-1 bg-background flex flex-col">
        {activeItem === "Hotkey settings..." ? (
          <HotkeySettings />
        ) : (
          <div className="flex-1" />
        )}
      </section>
    </main>
  )
}

export default App
