// imports
const { ipcRenderer, safeStorage, app } = require("electron")
const Store = require('electron-store');

// declarations
const store = new Store()

// DOM
let slackTokenText = document.querySelector("#i-slack-token")
let saveButton = document.querySelector("#b-save")
let dndAddAnotherButton = document.querySelector("#b-dnd-set")
let statusAddAnotherButton = document.querySelector("#b-status-set")
let generateSlackTokenButton = document.querySelector("#generate-slack-token")
let appVersionText = document.querySelector("#app-version")
let downloadsButton = document.querySelector("#downloads")


// slack token read / store messaging
ipcRenderer.invoke("read-slack-token").then((token) => {
    if (token != "")
        slackTokenText.value = "●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●"
})
slackTokenText.addEventListener("keyup", function (event) {
    if (slackTokenText.value != "●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●")
        ipcRenderer.send("store-slack-token", slackTokenText.value)
})

ipcRenderer.invoke("get-app-version").then((version) => {
    appVersionText.innerHTML = `Slack on Keys version ${version}`
})


saveButton.addEventListener("click", () => {
    ipcRenderer.send("minimise");
})

generateSlackTokenButton.addEventListener("click", () => {
    require("electron").shell.openExternal("https://slack.com/oauth/v2/authorize?client_id=3243307866673.5076213115026&scope=&user_scope=dnd:read,dnd:write,users.profile:read,users.profile:write,users:write,users:read")
})

downloadsButton.addEventListener("click", () => {
    require("electron").shell.openExternal("https://github.com/yakshaG/slack-on-keys/blob/main/README.md#updating")
})



ActionItem("presence", "set", 0)
ActionItem("presence", "clear", 0)
ActionItem("dnd", "clear", 0)
ActionItem("status", "clear", 0)

for (let i = 0; i < readValueFromStore("dnd.set").length; i++) {
    ActionItem("dnd", "set", i)
}

for (let i = 0; i < readValueFromStore("status.set").length; i++) {
    ActionItem("status", "set", i)
}







dndAddAnotherButton.addEventListener("click", function () {
    let currentItems = readValueFromStore("dnd.set")
    console.log(currentItems.length)

    writeValueToStore("dnd.set", [...currentItems, {
        "shortcutKey": "",
        "dndExpiry": ""
    }])

    ActionItem("dnd", "set", currentItems.length)
})

statusAddAnotherButton.addEventListener("click", function () {
    let currentItems = readValueFromStore("status.set")
    console.log(currentItems.length)

    writeValueToStore("status.set", [...currentItems, {
        "shortcutKey": "",
        "statusEmojiText": "",
        "statusText": "",
        "statusExpiry": ""
    }])

    ActionItem("status", "set", currentItems.length)
})








function ActionItem(section, type, index) {
    let sectionDOM = document.querySelector(`#${section}`)

    let actionItemContainer, shortcutKeyInput, errorMessage, valueInput1, valueInput2, valueInput3, removeButton, emoticon, emojiPicker;

    actionItemContainer = document.createElement("div")
    actionItemContainer.classList.add("action-item-container")

    const shortcutKeyInnerHTML = `
    <div class="col-auto me-2 d-flex align-items-end">
        <p class="mb-2 me-1">👉 ${process.platform == 'darwin' ? `control` : `Ctrl`} + </p>
        <div class="form-floating ${type == "set" && (section == "dnd" || section == "status") ? `` : ``}">
            <input id="shortcut-key-input-${section}-${type}-${index}" class="shortcut-key-input form-control" maxLength="1"/>
            <label id="shortcut-key-label-${section}-${type}-${index}" ></label>
        </div>
    </div>`
    const errorMessageHTML = `
        <p id="error-message-${section}-${type}-${index}" class="mt-1 mb-2">That key is already taken!</p>`
    const crossIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>`

    if (section == "presence") {
        actionItemContainer.innerHTML = `
            ${shortcutKeyInnerHTML}
            ${errorMessageHTML}
        `
    }
    else if (section == "dnd") {
        if (type == "set") {
            actionItemContainer.innerHTML = `
        <div class="d-flex align-items-center">
            ${shortcutKeyInnerHTML}
            <div class="form-floating mx-2">
                <input id="pause-key-input-${section}-${type}-${index}" class="form-control" type="number"/>
                <label id="pause-key-label-${section}-${type}-${index}"> Pause until (in min)</label>
            </div>
            <div>
                <button id="dnd-remove-button-${section}-${type}-${index}" type="button" class="btn ${index == 0 ? `invisible cursor-none` : ``}">
                    ${crossIcon}
                </button>
            </div>
        </div>
        ${errorMessageHTML}
        `}
        else {
            actionItemContainer.innerHTML = `
                                                ${shortcutKeyInnerHTML}
                                                ${errorMessageHTML}
                                            `
        }
    }
    else if (section == "status") {
        if (type == "set") {
            actionItemContainer.innerHTML = `
        <div class="d-flex align-items-center">
            ${shortcutKeyInnerHTML}
            <div class="form-floating mx-2">
                <input id="status-emoji-key-input-${section}-${type}-${index}" class="form-control" />
                <label id="status-emoji-key-label-${section}-${type}-${index}"> Status emoji text</label>
            </div>
            <div class="position-relative emoticon me-3">
                <img id="emoticon-${section}-${type}-${index}" src="./images/emoticon.svg" class="cursor-pointer" />
                <div class="position-absolute z-10">
                    <emoji-picker id="emoji-picker-${section}-${type}-${index}"></emoji-picker>
                </div>     
            </div>
            <div class="form-floating mx-2">
                <input id="status-text-key-input-${section}-${type}-${index}" class="form-control" />
                <label id="status-text-key-label-${section}-${type}-${index}"> Status text</label>
            </div>
            <div class="form-floating mx-2">
                <input id="status-expiry-key-input-${section}-${type}-${index}" class="form-control" type="number"/>
                <label id="status-expiry-key-label-${section}-${type}-${index}">Until (in min)</label>
            </div>
            <div>
                <button id="status-remove-button-${section}-${type}-${index}" type="button" class="btn ${index == 0 ? `invisible cursor-none` : ``}">
                    ${crossIcon}
                </button>
            </div>
        </div>
        ${errorMessageHTML}
        `}
        else {
            actionItemContainer.innerHTML = `
                                                ${shortcutKeyInnerHTML}
                                                ${errorMessageHTML}
                                            `
        }
    }

    let parent = sectionDOM.children[0].children[type == "set" ? 0 : 1]

    parent.insertBefore(actionItemContainer, (type == "set" && section != "presence" ? parent.lastElementChild : null))

    shortcutKeyInput = document.querySelector(`#shortcut-key-input-${section}-${type}-${index}`)
    errorMessage = document.querySelector(`#error-message-${section}-${type}-${index}`)
    if (section == "dnd" && type == "set") {
        valueInput1 = document.querySelector(`#pause-key-input-${section}-${type}-${index}`)
        removeButton = document.querySelector(`#dnd-remove-button-${section}-${type}-${index}`)
    }
    else if (section == "status" && type == "set") {
        valueInput1 = document.querySelector(`#status-emoji-key-input-${section}-${type}-${index}`)
        valueInput2 = document.querySelector(`#status-text-key-input-${section}-${type}-${index}`)
        valueInput3 = document.querySelector(`#status-expiry-key-input-${section}-${type}-${index}`)
        removeButton = document.querySelector(`#status-remove-button-${section}-${type}-${index}`)
        emoticon = document.querySelector(`#emoticon-${section}-${type}-${index}`)
        emojiPicker = document.querySelector(`#emoji-picker-${section}-${type}-${index}`)
    }




    // initial render
    errorMessage.style.display = "none"
    shortcutKeyInput.value = readValueFromStore(`${section}.${type}`)[index]["shortcutKey"]
    if (type != "clear" && section != "presence") {
        valueInput1.value = readValueFromStore(`${section}.${type}`)[index][section == "dnd" ? `dndExpiry` : `statusEmojiText`]

        if (section == "status") {
            emojiPicker.style.display = "none"
            valueInput2.value = readValueFromStore(`${section}.${type}`)[index]["statusText"]
            valueInput3.value = readValueFromStore(`${section}.${type}`)[index]["statusExpiry"]
        }
    }



    // change events
    shortcutKeyInput.addEventListener("keyup", function (event) {
        if (event.target.value != "") {
            if (!checkIfShortcutIsTaken(event.target.value, section, type, index)) {
                errorMessage.innerHTML = ""
                errorMessage.style.display = "none"
                errorMessage.style.animation = ""
                const currentObject = readValueFromStore(`${section}.${type}`)[index]
                let array = readValueFromStore(`${section}.${type}`)
                let modifiedObject = { ...currentObject, "shortcutKey": event.target.value }
                array.splice(index, 1, modifiedObject)
                writeValueToStore(`${section}.${type}`, array)
                ipcRenderer.send("refresh-shortcuts")
            }
            else {
                errorMessage.innerHTML = "That key is already taken!"
                errorMessage.style.display = "block"
                errorMessage.style.animation = "headShake ease-in-out 1s"
            }
        }
    })
    if (type != "clear" && section != "presence") {
        valueInput1.addEventListener("keyup", function (event) {
            if (event.target.value) ipcRenderer.send("refresh-shortcuts")
            const key = (section == "dnd" ? `dndExpiry` : `statusEmojiText`)
            const currentObject = readValueFromStore(`${section}.${type}`)[index]
            let array = readValueFromStore(`${section}.${type}`)
            let modifiedObject;
            if (section == "dnd")
                modifiedObject = { ...currentObject, "dndExpiry": event.target.value }
            else
                modifiedObject = { ...currentObject, "statusEmojiText": event.target.value }
            array.splice(index, 1, modifiedObject)
            writeValueToStore(`${section}.${type}`, array)
        })

        if (section == "status") {
            valueInput1.addEventListener("mouseenter", function () {
                errorMessage.innerHTML = "You can copy paste custom emojis from Slack like <b>:bowtie:</b>"
                errorMessage.style.display = "block"
            })
            valueInput1.addEventListener("mouseleave", function () {
                errorMessage.innerHTML = ""
                errorMessage.style.display = "none"
            })
            emoticon.addEventListener("click", function () {
                if (emojiPicker.style.display == "none")
                    emojiPicker.style.display = "block"
                else
                    emojiPicker.style.display = "none"
            })
            emojiPicker.addEventListener("emoji-click", function (event) {
                valueInput1.value = event.detail.unicode
                valueInput1.dispatchEvent(new KeyboardEvent('keyup'))
                emojiPicker.style.display = "none"
            })


            valueInput2.addEventListener("keyup", function (event) {
                if (event.target.value) ipcRenderer.send("refresh-shortcuts")
                const currentObject = readValueFromStore(`${section}.${type}`)[index]
                let array = readValueFromStore(`${section}.${type}`)
                let modifiedObject = { ...currentObject, "statusText": event.target.value }
                array.splice(index, 1, modifiedObject)
                writeValueToStore(`${section}.${type}`, array)
            })

            valueInput3.addEventListener("keyup", function (event) {
                if (event.target.value) ipcRenderer.send("refresh-shortcuts")
                const currentObject = readValueFromStore(`${section}.${type}`)[index]
                let array = readValueFromStore(`${section}.${type}`)
                let modifiedObject = { ...currentObject, "statusExpiry": event.target.value }
                array.splice(index, 1, modifiedObject)
                writeValueToStore(`${section}.${type}`, array)
            })
        }
    }
    removeButton?.addEventListener("click", function () {
        let array = readValueFromStore(`${section}.${type}`)
        array.splice(index, 1)
        writeValueToStore(`${section}.${type}`, array)
        parent.children[index + 1].remove()
    })
}




function readValueFromStore(key) {
    if (store.get(key) == undefined)
        return ``
    else
        return store.get(key)
}

function writeValueToStore(key, value) {
    store.set(key, value)
}

function checkIfShortcutIsTaken(key, section, type, index) {
    let taken = false
    const storeObject = Object.keys(readValueFromStore(store.store))
    storeObject.map((storeItem) => {
        if ((storeItem == "token") || (storeItem == "storageVersion"))
            return
        else {
            readValueFromStore(`${storeItem}.set`).map((shortcutItem, itemIndex) => {
                if (shortcutItem["shortcutKey"] == key) {
                    if ((section == storeItem) && (type == "set") && (index == itemIndex))
                        return
                    else
                        taken = true
                }
            })
            readValueFromStore(`${storeItem}.clear`).map((shortcutItem, itemIndex) => {
                if (shortcutItem["shortcutKey"] == key) {
                    if ((section == storeItem) && (type == "clear") && (index == itemIndex))
                        return
                    else
                        taken = true
                }
            })
        }
    })
    return taken
}


