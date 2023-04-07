const { ipcRenderer, safeStorage } = require("electron")
const Store = require('electron-store');

const store = new Store()


let slackTokenInputField = document.querySelector("#slack-token")
let saveButton = document.querySelector("#save")


ipcRenderer.on("read-slack-token", function(event, token){
    console.log(token)
    // alert(token)
    slackTokenInputField.value = token
})


saveButton.addEventListener("click", () => {
    ipcRenderer.send("store-slack-token", slackTokenInputField.value)
    // storeToken(slackTokenInputField.value)
})




function storeToken(token) {
    // store.set("token", token)
    let encryptedToken = safeStorage.encryptString(token).toString('latin1')
    // console.log("Encrypted token should look like " + JSON.stringify(encryptedToken))
    console.log(encryptedToken)
    store.set("token", encryptedToken)
    // console.log("Decrypted token should look like " + safeStorage.decryptString(encryptedToken))
}

function readToken() {
    if (store.get("token") == undefined)
        return ``
    else {
        // console.log(JSON.parse(store.get("token")))
        return (safeStorage.decryptString(Buffer.from(store.get("token"), "latin1")))
        // return (store.get("token"))
    }
}