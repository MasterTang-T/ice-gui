const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const {
    parseFile
} = require('./src/parseFile')

function createWindow() {
    // 创建窗口
    const win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    // win.webContents.openDevTools()
}
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
ipcMain.on('uploadFile', (event, arg) => {
    parseFile(arg)
    event.sender.send('uploadFileSuccess', {
        msg: 'ok',
        code: 0,
    });
});