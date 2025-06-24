import axios from "axios";
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import crypto from 'crypto';
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import { stat } from "fs";

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { url } = req.query;
        const ig = new Instagram()
        const response = await ig.download(url);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

handler.method = 'GET';
handler.folder = 'downloader';
handler.desc = 'Download video from Instagram';
handler.query = "url";
handler.example = "?url=https://www.instagram.com/reel/DLQC9GSBrf1/?utm_source=ig_web_copy_link";
handler.status = true;

export default handler

/* Scraper */
class Instagram {
    constructor() {
        this.jar = new CookieJar();
        this.client = wrapper(axios.create({ jar: this.jar }));
    }

    async download(url) {
        const { data } = await axios.get('https://sssinstagram.com/msec');
        const time = Math.floor(data.msec * 1000) || Date.now();
        const ab = Date.now() - (time ? Date.now() - time : 0);
    
        const hash = crypto.createHash('sha256')
            .update(`${url}${ab}19e08ff42f18559b51825685d917c5c9e9d89f8a5c1ab147f820f46e94c3df26`)
            .digest('hex');
    
        const { data: response } = await axios.post('https://sssinstagram.com/api/convert', {
            url, ts: ab, _ts: 1739186038417, _tsc: Date.now() - time, _s: hash
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://sssinstagram.com/',
                'Origin': 'https://sssinstagram.com/'
            }
        });
    
        return response
    }
}