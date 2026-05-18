/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  ipcMain,
  protocol,
  desktopCapturer,
  screen,
  shell,
  globalShortcut,
} from "electron"
import updater from "electron-updater"
const { autoUpdater } = updater

import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs"
import { execSync } from "node:child_process"

app.name = "Locus Smart Capture"
app.setAppUserModelId("com.locus.smart-capture")

// Register custom protocol as privileged before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "locus-cap",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true,
    },
  },
])

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
process.env.APP_ROOT = path.join(__dirname, "..")

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron")
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist")

// Capture storage path
const CAP_FOLDER = path.join(app.getPath("pictures"), "Locus - Smart Capture")
if (!fs.existsSync(CAP_FOLDER)) {
  fs.mkdirSync(CAP_FOLDER, { recursive: true })
}

const getIconPath = (): string => {
  const platform = process.platform
  const basePath = process.env.APP_ROOT

  switch (platform) {
    case "win32":
      return path.join(basePath, "public", "icons", "win", "icon.ico")
    case "darwin":
      return path.join(basePath, "public", "icons", "mac", "icon.icns")
    case "linux":
    default:
      return path.join(basePath, "public", "icons", "png", "256x256.png")
  }
}

const iconPath = getIconPath()

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null
let regionWin: BrowserWindow | null = null

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js")

  win = new BrowserWindow({
    title: "Locus - Smart Capture",
    width: 900,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true,
    show: false, // Prevents window from flashing and allows starting hidden
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: preloadPath,
      sandbox: true,
      contextIsolation: true,
    },
  })

  // Only show the window initially if we are NOT in hidden/startup mode
  const isStartupHidden =
    process.argv.includes("--hidden") || process.argv.includes("--minimized")
  if (!isStartupHidden) {
    win.once("ready-to-show", () => {
      win?.show()
    })
  }

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools({ mode: "detach" })
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"))
  }
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowPrerelease = false

  autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info.version)
    if (win) {
      win.webContents.send("update:available", info.version)
    }
  })

  autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded:", info.version)
    // Updates will be installed automatically on app quit
  })

  autoUpdater.on("error", (err) => {
    console.error("Error in auto-updater:", err)
  })

  // Check for updates every 24 hours
  setInterval(
    () => {
      autoUpdater.checkForUpdatesAndNotify()
    },
    1000 * 60 * 60 * 24
  )

  // Initial check
  autoUpdater.checkForUpdatesAndNotify()
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
    win = null
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})

app.whenReady().then(() => {
  // Global Shortcuts
  globalShortcut.register("Alt+Shift+S", async () => {
    try {
      await performCaptureFullScreen()
    } catch (err) {
      console.error("Global shortcut capture failed:", err)
    }
  })

  // IPC Handlers
  ipcMain.handle("capture-full-screen", async () => {
    return await performCaptureFullScreen()
  })

  async function performCaptureFullScreen() {
    try {
      // Hide the window so it doesn't appear in the screenshot
      if (win) win.hide()

      // Small delay to allow the window to finish hiding
      await new Promise((resolve) => setTimeout(resolve, 200))

      const primaryDisplay = screen.getPrimaryDisplay()
      const { width, height } = primaryDisplay.size

      const sources = await desktopCapturer.getSources({
        types: ["screen", "window"], // Include both for better source detection
        thumbnailSize: { width, height },
      })

      // Try to find the primary screen source
      const source =
        sources.find(
          (s) => s.name === "Entire Screen" || s.name === "Screen 1"
        ) || sources[0]

      if (!source) {
        throw new Error("No screen source found")
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `locus_${timestamp}.png`
      const filepath = path.join(CAP_FOLDER, filename)

      const image = source.thumbnail.toPNG()
      fs.writeFileSync(filepath, image)

      // Notify the renderer to refresh the gallery
      win?.webContents.send("hotkey-capture")

      return {
        id: filename,
        name: filename,
        url: `locus-cap://capture/${filename}`,
        timestamp: Date.now(),
      }
    } catch (err) {
      console.error("Capture error:", err)
      throw err
    } finally {
      // Always show the window back
      if (win) win.show()
    }
  }

  async function captureWindowInternal(sourceId: string) {
    try {
      if (win) win.hide()
      await new Promise((resolve) => setTimeout(resolve, 200))

      const sources = await desktopCapturer.getSources({
        types: ["window"],
        thumbnailSize: { width: 1920, height: 1080 },
      })

      const source = sources.find((s) => s.id === sourceId)
      if (!source) throw new Error("Target window not found")

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `locus_${timestamp}.png`
      const filepath = path.join(CAP_FOLDER, filename)

      const image = source.thumbnail.toPNG()
      fs.writeFileSync(filepath, image)

      win?.webContents.send("hotkey-capture")

      return { success: true, id: filename }
    } catch (err) {
      console.error("Window capture error:", err)
      return { success: false, error: (err as any).message }
    } finally {
      if (win) win.show()
    }
  }

  async function captureMonitorInternal(monitorIndex: number) {
    try {
      if (win) win.hide()
      await new Promise((resolve) => setTimeout(resolve, 200))

      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: 1920, height: 1080 },
      })

      // Try to match the monitor index
      const source = sources[monitorIndex] || sources[0]
      if (!source) throw new Error("Monitor source not found")

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `locus_${timestamp}.png`
      const filepath = path.join(CAP_FOLDER, filename)

      const image = source.thumbnail.toPNG()
      fs.writeFileSync(filepath, image)

      win?.webContents.send("hotkey-capture")

      return { success: true, id: filename }
    } catch (err) {
      console.error("Monitor capture error:", err)
      return { success: false, error: (err as any).message }
    } finally {
      if (win) win.show()
    }
  }

  function openRegionSelectorInternal() {
    if (win) win.hide()

    if (regionWin) {
      const primaryDisplay = screen.getPrimaryDisplay()
      const { width, height } = primaryDisplay.bounds

      // Handle screen size changes dynamically before showing
      regionWin.setBounds({
        x: primaryDisplay.bounds.x,
        y: primaryDisplay.bounds.y,
        width,
        height,
      })

      // Send the reset and bounds fetch triggers via IPC
      regionWin.webContents.send("prepare-selector", "manual")

      // Set the hash without triggering a full page reload
      regionWin.webContents.executeJavaScript(
        'window.location.hash = "#region-manual"'
      )

      // Allow a brief 40ms pause for the renderer to process reset events and paint a clean backing store
      setTimeout(() => {
        if (regionWin) regionWin.show()
      }, 40)
    }
  }

  async function updateTrayMenu() {
    try {
      // 1. Get connected monitors
      const displays = screen.getAllDisplays()
      const monitorSubmenu = displays.map((d, index) => ({
        label: `Monitor ${index + 1} (${d.size.width}x${d.size.height})${d.id === screen.getPrimaryDisplay().id ? " [Primary]" : ""}`,
        click: async () => {
          try {
            await captureMonitorInternal(index)
          } catch (err) {
            console.error("Tray monitor capture error:", err)
          }
        },
      }))

      // 2. Get active windows
      const sources = await desktopCapturer.getSources({
        types: ["window"],
        thumbnailSize: { width: 1, height: 1 }, // Keeps it super fast
      })
      const activeWindows = sources.filter(
        (s) =>
          s.name &&
          s.name !== "Locus - Smart Capture" &&
          s.name !== "Electron" &&
          s.name !== "Notification"
      )
      const windowSubmenu = activeWindows.map((s) => ({
        label: s.name.length > 40 ? s.name.substring(0, 37) + "..." : s.name,
        click: async () => {
          try {
            await captureWindowInternal(s.id)
          } catch (err) {
            console.error("Tray window capture error:", err)
          }
        },
      }))

      const contextMenu = Menu.buildFromTemplate([
        { label: "Locus - Smart Capture", enabled: false },
        {
          label: "Show Dashboard",
          click: () => {
            win?.show()
            win?.focus()
          },
        },
        { type: "separator" },
        {
          label: "Full Screen",
          accelerator: "Alt+Shift+S",
          click: async () => {
            await performCaptureFullScreen()
          },
        },
        {
          label: "Capture Window",
          submenu:
            windowSubmenu.length > 0
              ? windowSubmenu
              : [{ label: "No Active Windows", enabled: false }],
        },
        {
          label: "Capture Monitor",
          submenu:
            monitorSubmenu.length > 0
              ? monitorSubmenu
              : [{ label: "No Connected Monitors", enabled: false }],
        },
        {
          label: "Capture Region",
          click: () => {
            openRegionSelectorInternal()
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          click: () => {
            app.quit()
          },
        },
      ])

      tray?.setContextMenu(contextMenu)
    } catch (err) {
      console.error("Failed to update tray menu:", err)
    }
  }

  ipcMain.handle("get-captures", async () => {
    try {
      const files = fs
        .readdirSync(CAP_FOLDER)
        .filter((f) => f.endsWith(".png"))
        .map((f) => {
          const filepath = path.join(CAP_FOLDER, f)
          const stats = fs.statSync(filepath)

          return {
            id: f,
            name: f,
            url: `locus-cap://capture/${f}`,
            timestamp: stats.mtimeMs,
          }
        })
        .sort((a, b) => b.timestamp - a.timestamp)
      return files
    } catch (err) {
      return []
    }
  })

  ipcMain.handle("delete-capture", async (_, filename: string) => {
    try {
      const filepath = path.join(CAP_FOLDER, filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        return { success: true }
      }
      return { success: false, error: "File not found" }
    } catch (err) {
      return { success: false, error: (err as any).message }
    }
  })

  ipcMain.handle("open-capture", async (_, filename: string) => {
    try {
      const filepath = path.join(CAP_FOLDER, filename)
      await shell.openPath(filepath)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as any).message }
    }
  })

  ipcMain.handle("get-window-bounds", async () => {
    if (process.platform !== "win32") return []

    const scriptPath = path.join(app.getPath("userData"), "get-windows.ps1")
    const psScript = `
      Add-Type -TypeDefinition '
        using System;
        using System.Runtime.InteropServices;
        using System.Collections.Generic;
        using System.Text;

        public class WindowUtils {
          [DllImport("user32.dll")]
          [return: MarshalAs(UnmanagedType.Bool)]
          public static extern bool IsWindowVisible(IntPtr hWnd);

          [DllImport("user32.dll")]
          [return: MarshalAs(UnmanagedType.Bool)]
          public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

          [DllImport("user32.dll", CharSet = CharSet.Auto)]
          public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

          [DllImport("user32.dll")]
          public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

          public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

          [DllImport("user32.dll")]
          public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

          public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

          public static string GetWindows() {
            var windows = new List<string>();
            EnumWindows((hWnd, lParam) => {
              if (IsWindowVisible(hWnd)) {
                RECT rect;
                if (GetWindowRect(hWnd, out rect)) {
                  if (rect.Right > rect.Left && rect.Bottom > rect.Top) {
                    var sb = new StringBuilder(256);
                    GetWindowText(hWnd, sb, 256);
                    string title = sb.ToString();
                    
                    uint pid;
                    GetWindowThreadProcessId(hWnd, out pid);
                    string procName = "Unknown";
                    try { procName = System.Diagnostics.Process.GetProcessById((int)pid).ProcessName; } catch {}

                    if (!string.IsNullOrEmpty(title)) {
                      windows.Add(procName + "|" + title + "|" + rect.Left + "|" + rect.Top + "|" + (rect.Right - rect.Left) + "|" + (rect.Bottom - rect.Top));
                    }
                  }
                }
              }
              return true;
            }, IntPtr.Zero);
            return string.Join(";", windows);
          }
        }
      '; [WindowUtils]::GetWindows()
    `

    try {
      // Ensure the script file exists
      if (
        !fs.existsSync(scriptPath) ||
        fs.readFileSync(scriptPath, "utf8") !== psScript
      ) {
        fs.writeFileSync(scriptPath, psScript, "utf8")
      }

      const output = execSync(
        `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`,
        { encoding: "utf8" }
      )
      const primaryDisplay = screen.getPrimaryDisplay()
      const scaleFactor = primaryDisplay.scaleFactor

      const windows = output
        .trim()
        .split(";")
        .filter((line) => line.includes("|"))
        .map((line) => {
          const parts = line.split("|")
          if (parts.length < 6) return null

          const processName = parts[0]
          const title = parts[1]
          const x = parseInt(parts[2])
          const y = parseInt(parts[3])
          const width = parseInt(parts[4])
          const height = parseInt(parts[5])

          return {
            process: processName,
            title,
            x: Math.round(x / scaleFactor) - primaryDisplay.bounds.x,
            y: Math.round(y / scaleFactor) - primaryDisplay.bounds.y,
            width: Math.round(width / scaleFactor),
            height: Math.round(height / scaleFactor),
          }
        })
        .filter((w): w is NonNullable<typeof w> => w !== null)

      return windows.filter(
        (w) =>
          w.title &&
          w.process !== "Locus - Smart Capture" &&
          w.width > 10 &&
          w.height > 10
      )
    } catch (err) {
      console.error("Failed to get window bounds:", err)
      return []
    }
  })

  ipcMain.handle("get-windows", async () => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["window"],
        thumbnailSize: { width: 320, height: 180 },
      })
      return sources
        .filter(
          (s) =>
            s.name &&
            s.name !== "Locus - Smart Capture" &&
            s.name !== "Electron" &&
            s.name !== "Notification"
        )
        .map((s) => ({
          id: s.id,
          name: s.name,
          thumbnail: s.thumbnail.toDataURL(),
        }))
    } catch (err) {
      console.error("Failed to get windows:", err)
      return []
    }
  })

  ipcMain.handle("capture-window", async (_, sourceId: string) => {
    return await captureWindowInternal(sourceId)
  })

  ipcMain.handle("get-monitors", async () => {
    try {
      const displays = screen.getAllDisplays()
      return displays.map((d, index) => ({
        id: d.id,
        name: `Monitor ${index + 1}`,
        resolution: `${d.size.width}x${d.size.height}`,
        isPrimary: d.id === screen.getPrimaryDisplay().id,
        index,
      }))
    } catch (err) {
      console.error("Failed to get monitors:", err)
      return []
    }
  })

  ipcMain.handle("capture-monitor", async (_, monitorIndex: number) => {
    return await captureMonitorInternal(monitorIndex)
  })

  ipcMain.handle("open-region-selector", () => {
    openRegionSelectorInternal()
  })

  ipcMain.handle("cancel-region-selector", () => {
    if (regionWin) {
      regionWin.hide()
    }
    if (win) win.show()
  })

  ipcMain.handle(
    "capture-region",
    async (
      _,
      rect: { x: number; y: number; width: number; height: number }
    ) => {
      try {
        if (regionWin) {
          regionWin.hide()
        }

        // Delay briefly for hardware transition before capturing
        await new Promise((resolve) =>
          setTimeout(resolve, process.platform === "win32" ? 80 : 50)
        )

        const primaryDisplay = screen.getPrimaryDisplay()
        const sources = await desktopCapturer.getSources({
          types: ["screen"],
          thumbnailSize: primaryDisplay.size,
        })

        const source = sources[0]
        const image = source.thumbnail
        const imageSize = image.getSize()

        // Calculate the physical-to-logical coordinate scaling factors dynamically
        const scaleX = imageSize.width / primaryDisplay.size.width
        const scaleY = imageSize.height / primaryDisplay.size.height

        const cropRect = {
          x: Math.round(rect.x * scaleX),
          y: Math.round(rect.y * scaleY),
          width: Math.round(rect.width * scaleX),
          height: Math.round(rect.height * scaleY),
        }

        // Clamp coordinates to stay completely within native screenshot bounds and prevent crashes
        cropRect.x = Math.max(0, Math.min(cropRect.x, imageSize.width - 1))
        cropRect.y = Math.max(0, Math.min(cropRect.y, imageSize.height - 1))
        cropRect.width = Math.max(
          1,
          Math.min(cropRect.width, imageSize.width - cropRect.x)
        )
        cropRect.height = Math.max(
          1,
          Math.min(cropRect.height, imageSize.height - cropRect.y)
        )

        const croppedImage = image.crop(cropRect)

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `locus_${timestamp}.png`
        const filepath = path.join(CAP_FOLDER, filename)

        fs.writeFileSync(filepath, croppedImage.toPNG())

        win?.webContents.send("hotkey-capture")

        return { success: true, id: filename }
      } catch (err) {
        console.error("Region capture error:", err)
        return { success: false, error: (err as any).message }
      } finally {
        if (win) win.show()
      }
    }
  )

  // Register custom protocol for local images
  protocol.handle("locus-cap", async (request) => {
    try {
      const url = new URL(request.url)
      const filename = path.basename(decodeURIComponent(url.pathname))
      const filepath = path.join(CAP_FOLDER, filename)

      const buffer = await fs.promises.readFile(filepath)

      // Determine content type based on extension
      const ext = path.extname(filepath).toLowerCase()
      let contentType = "image/png"
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg"
      if (ext === ".gif") contentType = "image/gif"
      if (ext === ".webp") contentType = "image/webp"

      return new Response(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        },
      })
    } catch (err) {
      console.error("Protocol error:", err)
      return new Response("Not Found", { status: 404 })
    }
  })

  Menu.setApplicationMenu(null)
  createWindow()

  // Pre-initialize and load the hidden region selection overlay
  const preloadPath = path.join(__dirname, "preload.js")
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.bounds

  regionWin = new BrowserWindow({
    width,
    height,
    x: primaryDisplay.bounds.x,
    y: primaryDisplay.bounds.y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    show: false, // Keep hidden until explicitly triggered
    fullscreen: process.platform !== "darwin",
    skipTaskbar: true,
    enableLargerThanScreen: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: preloadPath,
      sandbox: true,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    regionWin.loadURL(`${VITE_DEV_SERVER_URL}#region-manual`)
  } else {
    regionWin.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash: "region-manual",
    })
  }

  // Initialize System Tray
  tray = new Tray(iconPath)
  tray.setToolTip("Locus - Smart Capture")

  // Populate the system tray context menu dynamically
  updateTrayMenu()

  // Re-populate the context menu when the user hovers over the tray icon so it remains perfectly fresh
  tray.on("mouse-enter", () => {
    updateTrayMenu()
  })

  // Quick left-click on the tray icon to toggle the dashboard show/hide
  tray.on("click", () => {
    if (win) {
      if (win.isVisible() && win.isFocused()) {
        win.hide()
      } else {
        win.show()
        win.focus()
      }
    }
  })

  // Setup Auto-Updater
  setupAutoUpdater()

  // Enable start on startup in production (startup app)
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe"),
      args: ["--hidden"],
    })
  } else {
    // In dev, ensure it's disabled to avoid cluttering startup
    app.setLoginItemSettings({
      openAtLogin: false,
      path: app.getPath("exe"),
    })
  }
})
