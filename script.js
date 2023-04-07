const { ipcRenderer } = require("electron")
const Store = require('electron-store');

const store = new Store()


let slackTokenInputField = document.querySelector("#slack-token")
let saveButton = document.querySelector("#save")

ipcRenderer.send("general-message", readToken())
    slackTokenInputField.value = readToken()


saveButton.addEventListener("click", () => {
    ipcRenderer.send("slack-token", slackTokenInputField.value)
})




function storeToken(token) {
    store.set("token", token)
    // let encryptedToken = safeStorage.encryptString(token)
    // console.log("Encrypted token should look like " + JSON.stringify(encryptedToken))
    // store.set("token", JSON.stringify(encryptedToken))
    // console.log("Decrypted token should look like " + safeStorage.decryptString(encryptedToken))
}

function readToken() {
    if (store.get("token") == undefined)
        return ``
    else {
        // console.log(JSON.parse(store.get("token")))
        // return (safeStorage.decryptString(JSON.parse(store.get("token"))))
        return (store.get("token"))
    }
}