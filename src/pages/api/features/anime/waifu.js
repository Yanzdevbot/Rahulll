import axios from "axios";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const response = await axios.get('https://api.waifu.pics/sfw/waifu');
        const imageUrl = response.data.url;
        const result = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

handler.method = 'GET';
handler.folder = 'anime';
handler.desc = 'Get Waifu Image';
handler.query = "";
handler.example = "";
handler.status = true;

export default handler