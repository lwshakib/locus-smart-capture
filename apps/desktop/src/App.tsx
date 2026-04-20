import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'


function App() {
  return (
    <main className="flex h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 overflow-hidden select-none font-sans">
      {/* Left Pane (Narrower) */}
      <aside className="w-[300px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-6 shadow-sm z-10 transition-all duration-300">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Locus</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Smart Capture</p>
        </div>
        
        <nav className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="h-10 w-full bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500 rounded-r-md flex items-center px-3">
              <div className="h-4 w-24 bg-indigo-200 dark:bg-indigo-800 rounded" />
            </div>
            <div className="h-10 w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center px-4 transition-colors">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-10 w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center px-4 transition-colors">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1">
               <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
               <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded " />
            </div>
          </div>
        </div>
      </aside>

      {/* Right Pane (Wider) */}
      <section className="flex-1 flex flex-col p-8 bg-slate-50/50 dark:bg-slate-950/50">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Captures</h1>
          <div className="flex gap-2">
             <div className="h-10 w-32 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none" />
          </div>
        </header>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center p-12 text-center">
          <div className="w-64 space-y-6">
            <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl mx-auto flex items-center justify-center">
               <div className="h-10 w-10 border-4 border-indigo-500 border-dashed rounded-full animate-[spin_5s_linear_infinite]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No Captures Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                Start capturing your desktop to see your smart snippets here. Everything is synced in real-time.
              </p>
            </div>
            <div className="pt-4">
               <div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
