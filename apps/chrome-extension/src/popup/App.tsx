import Logo from "./Logo.tsx"
import "./App.css"

export default function App() {
  // Trigger Full Screen capture (captures desktop / screen via choice dialog)
  const triggerFullScreen = () => {
    chrome.runtime.sendMessage({ action: "capture-full-screen" })
    window.close() // Close popup so it doesn't block the screen
  }

  // Trigger Custom Region capture in Content Script
  const triggerManualRegion = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "start-manual-capture" },
          () => {
            if (chrome.runtime.lastError) {
              handleCaptureError(activeTab)
            }
          }
        )
        window.close()
      }
    })
  }

  // Trigger Auto Element selection capture in Content Script
  const triggerAutoRegion = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "start-auto-capture" },
          () => {
            if (chrome.runtime.lastError) {
              handleCaptureError(activeTab)
            }
          }
        )
        window.close()
      }
    })
  }

  // Handle capture error (e.g. unrefreshed page, or chrome:// browser protected tab)
  const handleCaptureError = (tab: chrome.tabs.Tab) => {
    const url = tab.url || ""
    const isProtected =
      url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://") ||
      url.startsWith("about:") ||
      url.startsWith("https://chrome.google.com")

    if (isProtected) {
      alert(
        "Locus Info:\nChrome security policies prevent custom screen regions or auto element selections from being captured on internal browser pages (like chrome://extensions).\n\nPlease try on any standard webpage (e.g. google.com or github.com)!"
      )
    } else {
      alert(
        "Locus Info:\nThe extension was recently reloaded or installed. Please refresh this browser tab to activate the pixel-perfect capture overlay!"
      )
    }
  }

  return (
    <div className="locus-popup">
      {/* Header Block */}
      <header className="locus-header">
        <div className="locus-logo-group">
          <Logo className="locus-logo-icon" />
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
        <button
          className="locus-action-card highlight"
          onClick={triggerFullScreen}
        >
          <div className="locus-card-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M21 9H3M21 15H3M9 21V3M15 21V3" />
            </svg>
          </div>
          <div className="locus-card-details">
            <h3>Capture Tab</h3>
            <p>Capture the entire visible tab content</p>
          </div>
          <span className="locus-shortcut">Alt+Shift+S</span>
        </button>

        {/* Card 2: Manual Region */}
        <button className="locus-action-card" onClick={triggerManualRegion}>
          <div className="locus-card-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                strokeDasharray="4 4"
              />
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
    </div>
  )
}
