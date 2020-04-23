const { app, BrowserWindow, shell } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: __dirname + '/icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url)
  })
  win.loadFile('index.html')
  win.removeMenu()
}

app.whenReady().then(createWindow)
app.allowRendererProcessReuse = true;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})