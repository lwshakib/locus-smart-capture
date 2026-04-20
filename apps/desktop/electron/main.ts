import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, protocol, net, desktopCapturer, screen, shell, globalShortcut } from 'electron'


import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

// Register custom protocol as privileged before app is ready
protocol.registerSchemesAsPrivileged([
  { 
    scheme: 'locus-cap', 
    privileges: { 
      secure: true, 
      standard: true, 
      supportFetchAPI: true, 
      bypassCSP: true, 
      stream: true 
    } 
  }
])

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

// Capture storage path
const CAP_FOLDER = path.join(app.getPath('pictures'), 'Locus - Smart Capture')
if (!fs.existsSync(CAP_FOLDER)) {
  fs.mkdirSync(CAP_FOLDER, { recursive: true })
}

const getIconPath = (): string => {
  const platform = process.platform;
  const basePath = process.env.APP_ROOT;

  switch (platform) {
    case 'win32':
      return path.join(basePath, 'public', 'icons', 'win', 'icon.ico');
    case 'darwin':
      return path.join(basePath, 'public', 'icons', 'mac', 'icon.icns');
    case 'linux':
    default:
      return path.join(basePath, 'public', 'icons', 'png', '256x256.png');
  }
};

const iconPath = getIconPath();

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  win = new BrowserWindow({
    title: 'Locus - Smart Capture',
    width: 900,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: preloadPath,
      sandbox: true,
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})


app.whenReady().then(() => {
  // Global Shortcuts
  globalShortcut.register('Alt+Shift+S', async () => {
    try {
      await performCaptureFullScreen()
    } catch (err) {
      console.error('Global shortcut capture failed:', err)
    }
  })

  // IPC Handlers
  ipcMain.handle('capture-full-screen', async () => {
    return await performCaptureFullScreen()
  })

  async function performCaptureFullScreen() {
    try {

      // Hide the window so it doesn't appear in the screenshot
      if (win) win.hide()
      
      // Small delay to allow the window to finish hiding
      await new Promise(resolve => setTimeout(resolve, 200))

      const primaryDisplay = screen.getPrimaryDisplay()
      const { width, height } = primaryDisplay.size
      
      const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'], // Include both for better source detection
        thumbnailSize: { width, height }
      })

      // Try to find the primary screen source
      const source = sources.find(s => s.name === 'Entire Screen' || s.name === 'Screen 1') || sources[0]
      
      if (!source) {
        throw new Error('No screen source found');
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `locus_${timestamp}.png`
      const filepath = path.join(CAP_FOLDER, filename)
      
      const image = source.thumbnail.toPNG()
      fs.writeFileSync(filepath, image)
      
      // Notify the renderer to refresh the gallery
      win?.webContents.send('hotkey-capture')

      
      return {
        id: filename,
        name: filename,
        url: `locus-cap://capture/${filename}`,
        timestamp: Date.now()
      }
    } catch (err) {
      console.error('Capture error:', err)
      throw err
    } finally {
      // Always show the window back
      if (win) win.show()
    }
  }


  ipcMain.handle('get-captures', async () => {
    try {
      const files = fs.readdirSync(CAP_FOLDER)
        .filter(f => f.endsWith('.png'))
        .map(f => {
          const filepath = path.join(CAP_FOLDER, f)
          const stats = fs.statSync(filepath)
          
          return {
            id: f,
            name: f,
            url: `locus-cap://capture/${f}`,
            timestamp: stats.mtimeMs
          }


        })
        .sort((a, b) => b.timestamp - a.timestamp)
      return files
    } catch (err) {
      return []
    }
  })

  ipcMain.handle('delete-capture', async (_, filename: string) => {
    try {
      const filepath = path.join(CAP_FOLDER, filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        return { success: true }
      }
      return { success: false, error: 'File not found' }
    } catch (err) {
      return { success: false, error: (err as any).message }
    }

  })

  ipcMain.handle('open-capture', async (_, filename: string) => {
    try {
      const filepath = path.join(CAP_FOLDER, filename)
      await shell.openPath(filepath)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as any).message }
    }
  })

  ipcMain.handle('get-windows', async () => {
    try {
      const sources = await desktopCapturer.getSources({ 
        types: ['window'],
        thumbnailSize: { width: 320, height: 180 }
      })
      return sources
        .filter(s => s.name && s.name !== 'Locus - Smart Capture' && s.name !== 'Electron' && s.name !== 'Notification')
        .map(s => ({
          id: s.id,
          name: s.name,
          thumbnail: s.thumbnail.toDataURL()
        }))
    } catch (err) {
      console.error('Failed to get windows:', err)
      return []
    }
  })

  ipcMain.handle('capture-window', async (_, sourceId: string) => {
    try {
      if (win) win.hide()
      await new Promise(resolve => setTimeout(resolve, 200))

      const sources = await desktopCapturer.getSources({
        types: ['window'],
        thumbnailSize: { width: 1920, height: 1080 }
      })

      const source = sources.find(s => s.id === sourceId)
      if (!source) throw new Error('Target window not found')

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `locus_${timestamp}.png`
      const filepath = path.join(CAP_FOLDER, filename)
      
      const image = source.thumbnail.toPNG()
      fs.writeFileSync(filepath, image)
      
      win?.webContents.send('hotkey-capture')
      
      return { success: true, id: filename }
    } catch (err) {
      console.error('Window capture error:', err)
      return { success: false, error: (err as any).message }
    } finally {
      if (win) win.show()
    }
  })



  // Register custom protocol for local images
  protocol.handle('locus-cap', async (request) => {
    try {
      const url = new URL(request.url)
      const filename = path.basename(decodeURIComponent(url.pathname))
      const filepath = path.join(CAP_FOLDER, filename)
      
      const buffer = await fs.promises.readFile(filepath)
      
      // Determine content type based on extension
      const ext = path.extname(filepath).toLowerCase()
      let contentType = 'image/png'
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
      if (ext === '.gif') contentType = 'image/gif'
      if (ext === '.webp') contentType = 'image/webp'

      return new Response(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        }
      })
    } catch (err) {
      console.error('Protocol error:', err)
      return new Response('Not Found', { status: 404 })
    }
  })



  Menu.setApplicationMenu(null)
  createWindow()

  // Initialize System Tray
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => win?.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => {
        app.quit()
      } 
    }
  ])
  tray.setToolTip('Locus - Smart Capture')
  tray.setContextMenu(contextMenu)
})
