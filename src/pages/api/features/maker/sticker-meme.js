import axios from "axios";
import fs from "fs";
import path from "path";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

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
        const filename = `sticker-meme_${Date.now()}.jpg`;
        const filePath = path.join(process.cwd(), 'tmp', filename);
        const result = await axios.get(`https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas: ' ')}/${encodeURIComponent(bawah ? bawah: ' ')}.png?background=${url}`, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, Buffer.from(result.data, 'binary'));
        const imageBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
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