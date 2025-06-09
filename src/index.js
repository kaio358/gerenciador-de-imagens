const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
console.log(process.env.BACKEND_URL);


require('./front/js/selecionarPasta'); 

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: true,
            additionalArguments: [`--backend-url=${process.env.BACKEND_URL}`]
        }
    });
    

    // win.loadFile('./teste/index_teste.html');
    win.loadFile('./front/index.html')
    // win.webContents.openDevTools();
});


