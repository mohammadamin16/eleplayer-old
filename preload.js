const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("file", {
  openFile: () => ipcRenderer.invoke("open-file"),
});
