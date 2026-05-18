import { useState, useEffect, useRef } from "react"
import "./App.css"

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

interface HoveredBounds extends Rect {
  tagName: string
  classString: string
}

function App() {
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"manual" | "auto" | null>(null)

  // Manual Selector States
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  )
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
    null
  )
  const [isDragging, setIsDragging] = useState(false)

  // Auto Element Selector States
  const [hoveredBounds, setHoveredBounds] = useState<HoveredBounds | null>(null)
  const hoveredElementRef = useRef<HTMLElement | null>(null)

  // Listen to message calls from popup/background scripts
  useEffect(() => {
    const handleMessage = (message: any, _sender: any, sendResponse: any) => {
      if (message.action === "start-manual-capture") {
        setIsActive(true)
        setMode("manual")
        setStartPos(null)
        setCurrentPos(null)
        setHoveredBounds(null)
        sendResponse({ success: true })
      } else if (message.action === "start-auto-capture") {
        setIsActive(true)
        setMode("auto")
        setStartPos(null)
        setCurrentPos(null)
        setHoveredBounds(null)
        sendResponse({ success: true })
      } else if (message.action === "cancel-capture") {
        resetState()
        sendResponse({ success: true })
      } else if (message.action === "capture-desktop-stream") {
        const { streamId } = message
        captureDesktopStream(streamId)
        sendResponse({ success: true })
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  // Listen to keyboard cancellations (Escape)
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetState()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isActive])

  // Auto Element Selector: Hover listener
  useEffect(() => {
    if (!isActive || mode !== "auto") return

    const handleMouseMove = (e: MouseEvent) => {
      // Find element under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!el) {
        setHoveredBounds(null)
        hoveredElementRef.current = null
        return
      }

      // Ignore Locus overlays and self-extension containers
      if (
        el.closest("#crxjs-app") ||
        el.tagName.toLowerCase() === "html" ||
        el.tagName.toLowerCase() === "body"
      ) {
        setHoveredBounds(null)
        hoveredElementRef.current = null
        return
      }

      // Calculate viewport-relative boundaries
      const rect = el.getBoundingClientRect()

      // Class name formatting
      let classString = ""
      if (el.className && typeof el.className === "string") {
        classString = el.className
          .trim()
          .split(/\s+/)
          .filter((c) => c && !c.startsWith("crxjs-") && !c.includes("hover:"))
          .map((c) => `.${c}`)
          .slice(0, 3)
          .join("")
      } else if (el.id) {
        classString = `#${el.id}`
      }

      hoveredElementRef.current = el
      setHoveredBounds({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        tagName: el.tagName.toLowerCase(),
        classString,
      })
    }

    const handleMouseClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (hoveredElementRef.current) {
        const rect = hoveredElementRef.current.getBoundingClientRect()

        // Hide overlays instantly before trigger capture
        resetState()

        // Wait brief tick for overlay to disappear
        setTimeout(() => {
          chrome.runtime.sendMessage({
            action: "capture-cropped-region",
            rect: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
              dpr: window.devicePixelRatio,
            },
          })
        }, 60)
      }
    }

    // Capture click event phase to prevent navigation
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleMouseClick, true)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleMouseClick, true)
    }
  }, [isActive, mode])

  const resetState = () => {
    setIsActive(false)
    setMode(null)
    setStartPos(null)
    setCurrentPos(null)
    setIsDragging(false)
    setHoveredBounds(null)
    hoveredElementRef.current = null
  }

  const captureDesktopStream = async (streamId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: streamId,
          },
        } as any,
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.style.position = "fixed"
      video.style.top = "-9999px"
      video.style.left = "-9999px"
      document.body.appendChild(video)

      video.onloadedmetadata = () => {
        video.play()

        setTimeout(() => {
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL("image/png")
            chrome.runtime.sendMessage({
              action: "save-desktop-capture",
              dataUrl,
            })
          }

          stream.getTracks().forEach((track) => track.stop())
          video.remove()
        }, 150)
      }
    } catch (err) {
      console.error("Desktop stream capture failed:", err)
    }
  }

  // Manual Region Selector: Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== "manual") return
    setStartPos({ x: e.clientX, y: e.clientY })
    setCurrentPos({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    if (!isDragging) return
    setCurrentPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUpDrag = () => {
    if (!isDragging || !startPos || !currentPos) return

    const x = Math.min(startPos.x, currentPos.x)
    const y = Math.min(startPos.y, currentPos.y)
    const width = Math.abs(startPos.x - currentPos.x)
    const height = Math.abs(startPos.y - currentPos.y)

    // Clear state
    resetState()

    // Minimum region threshold
    if (width < 5 || height < 5) return

    // Trigger region capture
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "capture-cropped-region",
        rect: { x, y, width, height, dpr: window.devicePixelRatio },
      })
    }, 60)
  }

  if (!isActive) return null

  // Calculate box dimensions for rendering manual crops
  const getManualBoxStyle = () => {
    if (!startPos || !currentPos) return { display: "none" }
    const x = Math.min(startPos.x, currentPos.x)
    const y = Math.min(startPos.y, currentPos.y)
    const w = Math.abs(startPos.x - currentPos.x)
    const h = Math.abs(startPos.y - currentPos.y)

    return {
      display: "block",
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    }
  }

  return (
    <div
      className={`locus-capture-root mode-${mode} ${mode === "manual" ? "cursor-crosshair" : "cursor-default"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveDrag}
      onMouseUp={handleMouseUpDrag}
    >
      {/* Translucent overlay masking for manual cropping */}
      {mode === "manual" && (
        <>
          <div className="locus-overlay-mask" />
          <div className="locus-crop-box" style={getManualBoxStyle()} />
          <div className="locus-guide-tooltip">
            Drag to select region • Esc to cancel
          </div>
        </>
      )}

      {/* High-fidelity borders for Element auto-highlighting */}
      {mode === "auto" && hoveredBounds && (
        <>
          <div
            className="locus-element-highlight"
            style={{
              left: `${hoveredBounds.x}px`,
              top: `${hoveredBounds.y}px`,
              width: `${hoveredBounds.width}px`,
              height: `${hoveredBounds.height}px`,
            }}
          />
          <div
            className="locus-element-tooltip"
            style={{
              left: `${hoveredBounds.x}px`,
              top: `${hoveredBounds.y + hoveredBounds.height + 6}px`,
            }}
          >
            <span className="locus-tag">{hoveredBounds.tagName}</span>
            <span className="locus-class">{hoveredBounds.classString}</span>
            <span className="locus-dim">
              {Math.round(hoveredBounds.width)} ×{" "}
              {Math.round(hoveredBounds.height)}
            </span>
          </div>
          <div className="locus-guide-tooltip">
            Hover to auto-detect container • Click to capture • Esc to cancel
          </div>
        </>
      )}
    </div>
  )
}

export default App
