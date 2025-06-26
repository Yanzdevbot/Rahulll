import axios from "axios";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { text, name, avatar } = req.query;
        if (!text || !name || !avatar) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const result = await fakechat(text, name, avatar)
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

handler.method = 'GET';
handler.folder = 'maker';
handler.desc = 'Make text to fakechat';
handler.query = "text, name, avatar";
handler.example = "?text=Hello%20World&name=RyHar&avatar=https://pomf2.lain.la/f/v53tu30l.jpg";
handler.status = true;

export default handler

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