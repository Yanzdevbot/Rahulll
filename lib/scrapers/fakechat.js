import axios from "axios";

/**
 * Generate a fake Telegram chat message image using the quote.ryhar.site API.
 *
 * @param {string} text The text of the message.
 * @param {string} name The name of the user.
 * @param {string} avatar The URL of the user's avatar.
 * @param {boolean} [url=false] If true, the image will be generated with a URL.
 * @returns {Promise<Buffer>} The image as a Buffer.
 */
async function fakechat(text, name, avatar, url = false) {
    let body1 = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#FFFFFF",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "media": {
                "url": url
            },
            "avatar": true,
            "from": {
                "id": 1,
                "name": name,
                "photo": {
                    "url": avatar
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    }

    let body2 = {
        "type": "quote",
        "format": "webp",
        "backgroundColor": "#FFFFFF",
        "width": 512,
        "height": 512,
        "scale": 2,
        "messages": [{
            "avatar": true,
            "from": {
                "first_name": name,
                "language_code": "en",
                "name": name,
                "photo": {
                    "url": avatar
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    }

    let { data } = await axios.post('https://quote.ryhar.site/generate', url ? body1: body2)
    return Buffer.from(data.result.image, "base64")
}

export default fakechat