import { useEffect } from 'react'
import { 
  LucideIcon,
  Camera, 
  Upload, 
  Grid3X3, 
  Wrench, 
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

function NavItem({ icon: Icon, label }: { icon: LucideIcon, label: string }) {
  return (
    <button className="flex items-center gap-3 w-full px-3 py-1.5 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group">
      <Icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
      <span className="truncate">{label}</span>
    </button>
  )
}

function Separator() {
  return <div className="h-px bg-border my-2 mx-2" />
}

function App() {
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
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none font-sans border border-border">
      {/* Left Pane (Narrower) */}
      <aside className="w-[240px] border-r border-border bg-background flex flex-col p-2 overflow-y-auto no-scrollbar transition-all duration-300">
        <div className="space-y-0.5">
          <NavItem icon={Camera} label="Capture" />
          <NavItem icon={Upload} label="Upload" />
          <NavItem icon={Grid3X3} label="Workflows" />
          <NavItem icon={Wrench} label="Tools" />
          
          <Separator />
          
          <NavItem icon={CheckSquare} label="After capture tasks" />
          <NavItem icon={FileOutput} label="After upload tasks" />
          <NavItem icon={Globe} label="Destinations" />
          
          <Separator />
          
          <NavItem icon={Settings} label="Application settings..." />
          <NavItem icon={Command} label="Task settings..." />
          <NavItem icon={Terminal} label="Hotkey settings..." />
          <NavItem icon={Cloud} label="Destination settings..." />
          <NavItem icon={HardDrive} label="Custom uploader settings..." />
          
          <Separator />
          
          <NavItem icon={Folder} label="Screenshots folder..." />
          <NavItem icon={HistoryIcon} label="History..." />
          <NavItem icon={ImageIcon} label="Image history..." />
          
          <Separator />
          
          <NavItem icon={Bug} label="Debug" />
          <NavItem icon={Heart} label="Donate..." />
          <NavItem icon={MessageSquare} label="Discord..." />
          <NavItem icon={Info} label="About..." />
        </div>
      </aside>

      {/* Right Pane (Wider) */}
      <section className="flex-1 bg-background flex flex-col" />
    </main>
  )
}

export default App
