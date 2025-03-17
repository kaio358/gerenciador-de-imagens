const { dialog, ipcMain } = require('electron');

ipcMain.handle('escolher-pasta', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths[0] || null;
});
