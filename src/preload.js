// src/preload.js
const { contextBridge } = require('electron');

const backendArg = process.argv.find(arg => arg.startsWith('--backend-url='));
const BACKEND_URL = backendArg ? backendArg.split('=')[1] : null;

contextBridge.exposeInMainWorld('env', {
    BACKEND_URL
});
