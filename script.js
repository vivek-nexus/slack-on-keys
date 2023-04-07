// imports
const { ipcRenderer, safeStorage } = require("electron")
const Store = require('electron-store');

// declarations
const store = new Store()

// DOM
let slackTokenText = document.querySelector("#i-slack-token")
let statusEmojiText = document.querySelector("#i-status-emoji-text")
let statusText = document.querySelector("#i-status-text")
let statusExpiryText = document.querySelector("#i-status-expiry-text")
let saveButton = document.querySelector("#b-save")

// slack token save messaging
ipcRenderer.on("read-slack-token", function (event, token) {
    slackTokenText.value = token
})
saveButton.addEventListener("click", () => {
    ipcRenderer.send("store-slack-token", slackTokenText.value)
    writeValueToStore("statusEmojiText", statusEmojiText.value)
    writeValueToStore("statusText", statusText.value)
    writeValueToStore("statusExpiryText", statusExpiryText.value)
    ipcRenderer.send("minimise");
})




// read initial values
readAllFromStorage()


function readAllFromStorage() {
    statusEmojiText.value = readValueFromStore("statusEmojiText")
    statusText.value = readValueFromStore("statusText")
    statusExpiryText.value = readValueFromStore("statusExpiryText")
}

function readValueFromStore(key) {
    if (store.get(key) == undefined)
        return ``
    else
        return store.get(key)
}

function writeValueToStore(key, value) {
    console.log(key + ": " + value)
    store.set(key, value)
}