import axios from "axios";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { url } = req.query;
        const response = await tiktok(url);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: response.data
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
handler.desc = 'Download video from TikTok';
handler.query = "url";
handler.example = "?url=https://www.tiktok.com/@inilahcom/video/7518655361784548615?is_from_webapp=1&sender_device=pc";
handler.status = true;

export default handler

const tiktok = async (url) => {
    let res = await axios.post("https://www.tikwm.com/api", {}, { params: { url, hd: 1 } })
    return res.data
}
