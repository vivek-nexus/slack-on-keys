const { app, BrowserWindow, Menu, Tray, safeStorage, ipcMain } = require('electron')
const { globalShortcut } = require('electron/main')
const path = require('path')
const Store = require('electron-store');


//Auto launch
var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "slack-on-keys"
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function (isEnabled) {
    if (isEnabled) return;
    autoLauncher.enable(); slackTokenInputField.value
}).catch(function (err) {
    throw err;
});



// variables
let tray = null
let mainWindow = null
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

const store = new Store()




// processes
app.whenReady().then(() => {
    mainWindow = createWindow()

    console.log("Saved token: " + readToken())
    mainWindow.webContents.once("dom-ready", function () {
        mainWindow.webContents.send("read-slack-token", readToken())
    })

    setGlobalShortCuts(mainWindow)

    tray = new Tray(path.join(__dirname, 'icon.png'))
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

    // app.on('activate', () => {
    //     if (BrowserWindow.getAllWindows().length === 0) {
    //         mainWindow = createWindow()
    //     }
    // })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        return
    else
        app.dock.hide()
})

ipcMain.on("store-slack-token", function (event, token) {
    storeToken(token)
})

ipcMain.on("general-message", function (event, message) {
    console.log("Message: " + message)
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
}

function alterStatus(type) {
    let token = readToken();
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
            "Authorization": `Bearer ${token}`
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

function storeToken(token) {
    let encryptedToken = safeStorage.encryptString(token).toString('latin1')
    console.log(encryptedToken)
    store.set("token", encryptedToken)
}

function readToken() {
    if (store.get("token") == undefined)
        return ``
    else {
        let decryptedToken = safeStorage.decryptString(Buffer.from(store.get("token"), "latin1"))
        console.log(decryptedToken)
        return decryptedToken
    }
}

