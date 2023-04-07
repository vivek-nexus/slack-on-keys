const { app, BrowserWindow, Menu, Tray } = require('electron')
const { globalShortcut } = require('electron/main')
const path = require('path')


//Auto launch
var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "slack-on-keys"
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function (isEnabled) {
    if (isEnabled) return;
    autoLauncher.enable();
}).catch(function (err) {
    throw err;
});



// variables
let tray = null
let mainWindow
const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Settings',
        click: () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                mainWindow = createWindow()
            }
            mainWindow.show()
        }
    },
    {
        label: 'Quit app',
        click: () => app.quit()
    },
])



// processes
app.whenReady().then(() => {
    mainWindow = createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createWindow()
        }
    })

    setGlobalShortCuts(mainWindow)

    tray = new Tray(path.join(__dirname, 'icon.png'))
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        return
    }
})






// functions
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
