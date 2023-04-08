const defaultValues = {
    "token": "",
    "presence": {
        "set": [
            {
                "shortcutKey": "1"
            }
        ],
        "clear": [
            {
                "shortcutKey": "2"
            }
        ]
    },
    "dnd": {
        "set": [
            {
                "shortcutKey": "3",
                "dndExpiry": "60"
            }
        ],
        "clear": [
            {
                "shortcutKey": "4"
            }
        ]
    },
    "status": {
        "set": [
            {
                "shortcutKey": "5",
                "statusEmojiText": ":eyes:",
                "statusText": "Working remotely",
                "statusExpiry": "15"
            }
        ],
        "clear": [
            {
                "shortcutKey": "6"
            }
        ]
    }
}

export default defaultValues