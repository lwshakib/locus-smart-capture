import { useState, useEffect } from 'react'
import './App.css'

interface CaptureItem {
  id: string
  url: string
  timestamp: number
  name: string
}

export default function App() {
  const [captures, setCaptures] = useState<CaptureItem[]>([])

  // Fetch captured screenshots from chrome.storage.local
  useEffect(() => {
    chrome.storage.local.get(['captures'], (result) => {
      setCaptures((result.captures as CaptureItem[]) || [])
    })

    // Listen to background capturing updates
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === 'local' && changes.captures) {
        setCaptures((changes.captures.newValue as CaptureItem[]) || [])
      }
    }
    chrome.storage.onChanged.addListener(handleStorageChange)
    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [])

  // Trigger Full Screen capture in Background Script
  const triggerFullScreen = () => {
    chrome.runtime.sendMessage({ action: 'capture-full-screen' })
    window.close() // Close popup so it doesn't block the screen
  }

  // Trigger Custom Region capture in Content Script
  const triggerManualRegion = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'start-manual-capture' })
        window.close()
      }
    })
  }

  // Trigger Auto Element selection capture in Content Script
  const triggerAutoRegion = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'start-auto-capture' })
        window.close()
      }
    })
  }

  // Open capture in new tab
  const handleOpenCapture = (url: string) => {
    chrome.tabs.create({ url })
  }

  // Delete capture from storage history
  const handleDeleteCapture = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = captures.filter(item => item.id !== id)
    chrome.storage.local.set({ captures: updated })
  }

  return (
    <div className="locus-popup">
      {/* Header Block */}
      <header className="locus-header">
        <div className="locus-logo-group">
          <svg className="locus-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
          <div className="locus-brand">
            <h1>Locus</h1>
            <span className="locus-subtitle">Smart Capture</span>
          </div>
        </div>
        <span className="locus-badge">Extension</span>
      </header>

      {/* Action Cards Grid */}
      <div className="locus-actions-grid">
        {/* Card 1: Full Screen */}
        <button className="locus-action-card highlight" onClick={triggerFullScreen}>
          <div className="locus-card-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M21 9H3M21 15H3M9 21V3M15 21V3" />
            </svg>
          </div>
          <div className="locus-card-details">
            <h3>Full Screen</h3>
            <p>Capture the entire visible viewport</p>
          </div>
          <span className="locus-shortcut">Alt+Shift+S</span>
        </button>

        {/* Card 2: Manual Region */}
        <button className="locus-action-card" onClick={triggerManualRegion}>
          <div className="locus-card-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h6v2H5v4H3V3zm18 0h-6v2h4v4h2V3zM3 21h6v-2H5v-4H3v6zm18 0h-6v-2h4v-4h2v6z" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
          <div className="locus-card-details">
            <h3>Selected Region</h3>
            <p>Drag to select custom crop area</p>
          </div>
        </button>

        {/* Card 3: Auto Region */}
        <button className="locus-action-card" onClick={triggerAutoRegion}>
          <div className="locus-card-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="4 4" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
          </div>
          <div className="locus-card-details">
            <h3>Auto Element</h3>
            <p>Hover to auto-detect elements</p>
          </div>
        </button>
      </div>

      {/* Gallery Section */}
      <section className="locus-gallery-section">
        <h4 className="locus-section-title">Recent Captures ({captures.length})</h4>
        
        {captures.length === 0 ? (
          <div className="locus-gallery-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p>Your captures will appear here</p>
          </div>
        ) : (
          <div className="locus-gallery-grid">
            {captures.slice(0, 4).map((cap) => (
              <div 
                key={cap.id} 
                className="locus-gallery-item"
                onClick={() => handleOpenCapture(cap.url)}
                title="Click to open capture in a new tab"
              >
                <img src={cap.url} alt={cap.name} />
                <button 
                  className="locus-delete-btn"
                  onClick={(e) => handleDeleteCapture(e, cap.id)}
                  title="Delete from history"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
