import pxpic from "../../../../../lib/scrapers/pxpic";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import { getImage } from "../../../../../lib/func";

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
        const result = await pxpic.create(await getImage(url), "enhance");
        if (!result || !result.resultImageUrl) {
            return res.status(500).json({
                status: false,
                message: 'Failed to process image'
            });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(await getImage(result.resultImageUrl));
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