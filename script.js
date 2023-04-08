// imports
const { ipcRenderer, safeStorage } = require("electron")
const Store = require('electron-store');

// declarations
const store = new Store()

// DOM
let slackTokenText = document.querySelector("#i-slack-token")
let saveButton = document.querySelector("#b-save")



// slack token read / store messaging
ipcRenderer.on("read-slack-token", function (event, token) {
    slackTokenText.value = "Saved but encrypted"
})
slackTokenText.addEventListener("keyup", function (event) {
    if (slackTokenText.value != "Saved but encrypted")
        ipcRenderer.send("store-slack-token", slackTokenText.value)
})

saveButton.addEventListener("click", () => {
    ipcRenderer.send("minimise");
})




ActionItem("presence", "set", 0)
ActionItem("presence", "clear", 0)
ActionItem("dnd", "set", 0)
ActionItem("dnd", "clear", 0)
ActionItem("status", "set", 0)
ActionItem("status", "clear", 0)


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




function ActionItem(section, type, index) {
    let sectionDOM = document.querySelector(`#${section}`)

    let shortcutKeyInputContainer, shortcutKeyInputLabel, shortcutKeyInput;
    let valueInput1Container, valueInput1Label, valueInput1
    let valueInput2Container, valueInput2Label, valueInput2
    let valueInput3Container, valueInput3Label, valueInput3

    shortcutKeyInputContainer = document.createElement("div")
    shortcutKeyInputLabel = document.createElement("label")
    shortCutKeyText = document.createElement("p")
    shortcutKeyInput = document.createElement("input")

    if (type != "clear" && section != "presence") {
        valueInput1Container = document.createElement("div")
        valueInput1Label = document.createElement("label")
        valueInput1 = document.createElement("input")

        if (section == "status") {
            valueInput2Container = document.createElement("div")
            valueInput2Label = document.createElement("label")
            valueInput2 = document.createElement("input")

            valueInput3Container = document.createElement("div")
            valueInput3Label = document.createElement("label")
            valueInput3 = document.createElement("input")
        }
    }



    // initial render
    shortcutKeyInput.classList.add("shortcut-key")
    shortcutKeyInput.value = readValueFromStore(`${section}.${type}`)[index]["shortcutKey"]
    shortcutKeyInputLabel.innerText = " Ctrl +"
    if (type != "clear" && section != "presence") {
        valueInput1.value = readValueFromStore(`${section}.${type}`)[index][section == "dnd" ? `dndExpiry` : `statusEmojiText`]
        valueInput1Label.innerText = (section == "dnd" ? `expiry` : ` Status emoji`)

        if (section == "status") {
            valueInput2.value = readValueFromStore(`${section}.${type}`)[index]["statusText"]
            valueInput3.value = readValueFromStore(`${section}.${type}`)[index]["statusExpiry"]
            valueInput2Label.innerText = " Status text"
            valueInput3Label.innerText = " Status expiry"
        }
    }

    shortcutKeyInputContainer.appendChild(shortcutKeyInputLabel)
    shortcutKeyInputContainer.appendChild(shortcutKeyInput)
    sectionDOM.children[1].children[type == "set" ? 0 : 1].appendChild(shortcutKeyInputContainer)

    if (type != "clear" && section != "presence") {
        valueInput1Container.appendChild(valueInput1Label)
        valueInput1Container.appendChild(valueInput1)
        sectionDOM.children[1].children[type == "set" ? 0 : 1].appendChild(valueInput1Container)

        if (section == "status") {
            valueInput1Container.appendChild(valueInput1Label)
            valueInput1Container.appendChild(valueInput1)
            sectionDOM.children[1].children[type == "set" ? 0 : 1].appendChild(valueInput1Container)

            valueInput2Container.appendChild(valueInput2Label)
            valueInput2Container.appendChild(valueInput2)
            sectionDOM.children[1].children[type == "set" ? 0 : 1].appendChild(valueInput2Container)

            valueInput3Container.appendChild(valueInput3Label)
            valueInput3Container.appendChild(valueInput3)
            sectionDOM.children[1].children[type == "set" ? 0 : 1].appendChild(valueInput3Container)
        }
    }


    // change events
    shortcutKeyInput.addEventListener("keyup", function (event) {
        if (event.target.value) ipcRenderer.send("refresh-shortcuts")
        const currentObject = readValueFromStore(`${section}.${type}`)[index]
        let array = readValueFromStore(`${section}.${type}`)
        let modifiedObject = { ...currentObject, "shortcutKey": event.target.value }
        array.splice(index, 1, modifiedObject)
        writeValueToStore(`${section}.${type}`, array)
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
}



function getLabel(section, type) {
    switch (`${section}+${type}`) {
        case "presence+set":
            return ""
            break;

        default:
            break;
    }
}