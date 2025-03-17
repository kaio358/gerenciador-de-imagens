const { app, BrowserWindow } = require('electron');
require('./src/front/js/selecionarPasta'); 

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile('./src/front/index.html');
    win.webContents.openDevTools();
});

