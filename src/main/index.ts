import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";

function createWindow(){
  const win=new BrowserWindow({
    width:1180,height:760,minWidth:900,minHeight:620,
    backgroundColor:"#090A18",
    webPreferences:{preload:path.join(__dirname,"../preload/index.js"),contextIsolation:true,nodeIntegration:false}
  });
  if(process.env.ELECTRON_RENDERER_URL) win.loadURL(process.env.ELECTRON_RENDERER_URL);
  else win.loadFile(path.join(__dirname,"../renderer/index.html"));
}
ipcMain.handle("yulia:open",async(_event,target:string)=>{
  if(!target) return false;
  if(/^https?:\\/\\//i.test(target)){await shell.openExternal(target);return true;}
  const result=await shell.openPath(target); return result==="";
});
app.whenReady().then(()=>{createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});