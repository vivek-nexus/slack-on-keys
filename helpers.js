const Store = require('electron-store');
const store = new Store()


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

module.exports = {readToken, storeToken}