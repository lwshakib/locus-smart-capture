// Locus Smart Capture - Background Service Worker (MV3)

interface CropRect {
  x: number
  y: number
  width: number
  height: number
  dpr: number
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'capture-full-screen') {
    // Capture the entire visible viewport
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        sendResponse({ success: false, error: chrome.runtime.lastError?.message || 'Capture failed' })
        return
      }

      // Save and trigger download
      saveAndDownload(dataUrl).then((saved) => {
        sendResponse({ success: true, capture: saved })
      }).catch(err => {
        sendResponse({ success: false, error: err.message })
      })
    })
    return true // Keep channel open for asynchronous response
  }

  if (message.action === 'capture-cropped-region') {
    const { rect }: { rect: CropRect } = message

    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        sendResponse({ success: false, error: chrome.runtime.lastError?.message || 'Capture failed' })
        return
      }

      // Perform high-fidelity offscreen canvas cropping
      cropImage(dataUrl, rect)
        .then((croppedDataUrl) => saveAndDownload(croppedDataUrl))
        .then((saved) => {
          sendResponse({ success: true, capture: saved })
        })
        .catch((err) => {
          console.error('Cropping error:', err)
          sendResponse({ success: false, error: err.message })
        })
    })
    return true // Keep channel open
  }
})

// Crop screenshot using MV3-compliant OffscreenCanvas
async function cropImage(dataUrl: string, rect: CropRect): Promise<string> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  const imageBitmap = await createImageBitmap(blob)

  // Scale coordinates using Device Pixel Ratio (DPR)
  const sx = Math.round(rect.x * rect.dpr)
  const sy = Math.round(rect.y * rect.dpr)
  const sWidth = Math.round(rect.width * rect.dpr)
  const sHeight = Math.round(rect.height * rect.dpr)

  // Avoid drawing 0-size canvas which crashes the engine
  const targetWidth = Math.max(1, sWidth)
  const targetHeight = Math.max(1, sHeight)

  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not establish 2D canvas context')
  }

  // Draw the precisely cropped portion onto our canvas
  ctx.drawImage(
    imageBitmap,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    targetWidth,
    targetHeight
  )

  const croppedBlob = await canvas.convertToBlob({ type: 'image/png' })

  // Convert cropped blob back to a clean Data URL in MV3 service worker
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Conversion to Data URL failed'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(croppedBlob)
  })
}

// Save image in local history and trigger automatic system download
async function saveAndDownload(dataUrl: string) {
  const id = `locus_${Date.now()}`
  const timestamp = Date.now()
  const filename = `locus_capture_${timestamp}.png`

  const newCapture = { id, url: dataUrl, timestamp, name: filename }

  // 1. Save to chrome.storage.local
  await new Promise<void>((resolve) => {
    chrome.storage.local.get(['captures'], (result) => {
      const captures = (result.captures as any[]) || []
      chrome.storage.local.set(
        { captures: [newCapture, ...captures].slice(0, 50) },
        () => resolve()
      )
    })
  })

  // 2. Trigger active system download
  await new Promise<void>((resolve, reject) => {
    chrome.downloads.download(
      {
        url: dataUrl,
        filename: filename,
        saveAs: false // Download silently to standard downloads directory
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve()
        }
      }
    )
  })

  return newCapture
}
