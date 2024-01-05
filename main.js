const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const electronReload = require("electron-reload");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 1200,
    // height: 800,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

app.whenReady().then(() => {
  createWindow();
  electronReload(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });

  ipcMain.handle("open-file", handleFileOpen);
  app.on("activate", function () {
    if (mainWindow === null) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
