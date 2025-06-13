
const { contextBridge,ipcRenderer } = require('electron');

const backendArg = process.argv.find(arg => arg.startsWith('--backend-url='));
const BACKEND_URL = backendArg ? backendArg.split('=')[1] : null;

contextBridge.exposeInMainWorld('env', {
    BACKEND_URL
});

contextBridge.exposeInMainWorld('electronAPI', { 
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
       
    }
});