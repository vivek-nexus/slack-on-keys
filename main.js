const { app, BrowserWindow } = require('electron')
const { globalShortcut } = require('electron/main')
const path = require('path')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    mainWindow.loadFile('index.html')
    return mainWindow
}

app.whenReady().then(() => {
    let mainWindow = createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createWindow()
        }
    })

    setGlobalShortCuts(mainWindow)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


function setGlobalShortCuts(mainWindow) {
    globalShortcut.unregisterAll()

    globalShortcut.register('ctrl+1', () => alterStatus("set"))
    globalShortcut.register('ctrl+shift+1', () => alterStatus("clear"))

    // globalShortcut.register('ctrl+1', function () {
    //     mainWindow.webContents.send("global-shortcut")
    // })
}

function alterStatus(type) {
    let key = ``;
    let raw = JSON.stringify({
        profile: {
            status_text: type == "set" ? `Hello` : ``,
            status_emoji: type == "set" ? `:eyes:` : ``,
            status_expiration: 0,
        }
    })

    let requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: raw,
        redirect: "follow",
    };

    fetch("https://slack.com/api/users.profile.set", requestOptions)
        // .then((response) => response.text())
        // .then((result) => {
        //     // console.log("Slack status altered")
        // })
        // .catch((error) => console.log("error", error));
        console.log(`Slack status ${type}`)
}
