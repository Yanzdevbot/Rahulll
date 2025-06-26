import pxpic from "../../../../../lib/scrapers/pxpic";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import axios from "axios";

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const imageBuffer = await axios.get(url, { responseType: 'arraybuffer' });
        const result = await pxpic.create(imageBuffer.data, "enhance");
        if (!result || !result.resultImageUrl) {
            return res.status(500).json({
                status: false,
                message: 'Failed to process image'
            });
        }
        const resultImageBuffer = await axios.get(result.resultImageUrl, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(resultImageBuffer.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

handler.method = 'GET';
handler.folder = 'ai';
handler.desc = 'Upscale Image using AI';
handler.query = "url";
handler.example = "?url=https://pomf2.lain.la/f/v53tu30l.jpg";
handler.status = true;

export default handler