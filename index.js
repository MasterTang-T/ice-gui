const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron')
const {
    parseFile
} = require('./src/parseFile')

function createWindow() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    // 创建窗口
    const win = new BrowserWindow({
        width: 700,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    // win.webContents.openDevTools()
}
/**
 * 注册键盘快捷键
 */
let template = [
    {
        label: '首页',
        role: 'home',
        click: function (item,focusedWindow) {
            if (focusedWindow) {
                focusedWindow.loadFile('index.html')
            }
        }
    },
    {
        label: '说明',
        role: 'help',
        click: function (item,focusedWindow) {
            if (focusedWindow) {
                focusedWindow.loadFile('help.html')
            }
        },
    }
]

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
ipcMain.on('uploadFile', (event, arg) => {
    const {
        clientJSPath,
        iceBusinessJSPath,
        iceBusinessJSONPath
    } = parseFile(arg)
    event.sender.send('uploadFileSuccess', {
        code: 0,
        info: {
            clientJSPath,
            iceBusinessJSPath,
            iceBusinessJSONPath
        }
    });
});