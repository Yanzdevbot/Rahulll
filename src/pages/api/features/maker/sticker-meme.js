import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import { getImage } from "../../../../../lib/func";

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { atas, bawah, url } = req.query;
        if (!(atas && bawah) || !url) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const imageUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas: ' ')}/${encodeURIComponent(bawah ? bawah: ' ')}.png?background=${url}`
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(await getImage(imageUrl));
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
handler.desc = 'Make text to sticker meme';
handler.query = "atas, bawah, url";
handler.example = "?atas=Hello%20World&bawah=RyHar&url=https://pomf2.lain.la/f/v53tu30l.jpg";
handler.status = true;

export default handler