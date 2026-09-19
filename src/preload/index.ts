import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("yulia",{open:(target:string)=>ipcRenderer.invoke("yulia:open",target)});
