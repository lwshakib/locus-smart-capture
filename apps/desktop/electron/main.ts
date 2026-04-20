import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, protocol, net } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import screenshot from 'screenshot-desktop'

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
  win = new BrowserWindow({
    title: 'Locus - Smart Capture',
    width: 900,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: false, // Required for some IPC features
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

// IPC Handlers
ipcMain.handle('capture-full-screen', async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `capture_${timestamp}.png`
    const filepath = path.join(CAP_FOLDER, filename)
    
    await screenshot({ filename: filepath })
    
    return {
      id: filename,
      name: filename,
      url: `locus-cap://${filepath}`,
      timestamp: Date.now()
    }
  } catch (err) {
    console.error('Screenshot failed:', err)
    throw err
  }
})

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
          url: `locus-cap://${filepath}`,
          timestamp: stats.mtimeMs
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)
    return files
  } catch (err) {
    console.error('Failed to get captures:', err)
    return []
  }
})

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

app.whenReady().then(() => {
  // Register custom protocol for local images
  protocol.handle('locus-cap', (request) => {
    const fileUrl = request.url.replace('locus-cap://', 'file://')
    return net.fetch(fileUrl)
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
