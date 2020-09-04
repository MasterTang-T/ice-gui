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
    // const menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
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
 * 其中：label: '切换开发者工具',这个可以在发布时注释掉
 */
// let template = [{
//         label: 'Edit ( 操作 )',
//         submenu: [{
//             label: 'Copy ( 复制 )',
//             accelerator: 'CmdOrCtrl+C',
//             role: 'copy'
//         }, {
//             label: 'Paste ( 粘贴 )',
//             accelerator: 'CmdOrCtrl+V',
//             role: 'paste'
//         }, {
//             label: 'Reload ( 重新加载 )',
//             accelerator: 'CmdOrCtrl+R',
//             click: function (item, focusedWindow) {
//                 if (focusedWindow) {
//                     // on reload, start fresh and close any old
//                     // open secondary windows
//                     if (focusedWindow.id === 1) {
//                         BrowserWindow.getAllWindows().forEach(function (win) {
//                             if (win.id > 1) {
//                                 win.close()
//                             }
//                         })
//                     }
//                     focusedWindow.reload()
//                 }
//             }
//         }]
//     },
//     {
//         label: 'Window ( 窗口 )',
//         role: 'window',
//         submenu: [{
//             label: 'Minimize ( 最小化 )',
//             accelerator: 'CmdOrCtrl+M',
//             role: 'minimize'
//         }, {
//             label: 'Close ( 关闭 )',
//             accelerator: 'CmdOrCtrl+W',
//             role: 'close'
//         }, {
//             label: '切换开发者工具',
//             accelerator: (function () {
//                 if (process.platform === 'darwin') {
//                     return 'Alt+Command+I'
//                 } else {
//                     return 'Ctrl+Shift+I'
//                 }
//             })(),
//             click: function (item, focusedWindow) {
//                 if (focusedWindow) {
//                     focusedWindow.toggleDevTools()
//                 }
//             }
//         }, {
//             type: 'separator'
//         }]
//     },
//     {
//         label: 'Help ( 帮助 ) ',
//         role: 'help',
//         submenu: [{
//             label: 'FeedBack ( 意见反馈 )',
//             click: function () {
//                 electron.shell.openExternal('https://forum.iptchain.net')
//             }
//         }]
//     }
// ]

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