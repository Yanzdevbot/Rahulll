import axios from "axios";
import fs from "fs";
import path from "path";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const response = await axios.get('https://api.waifu.pics/sfw/waifu');
        const imageUrl = response.data.url;
        const filename = `waifu_${Date.now()}.jpg`;
        const filePath = path.join(process.cwd(), 'tmp', filename);
        const result = await axios.get(imageUrl, { responseType: 'arraybuffer' });
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
handler.folder = 'anime';
handler.desc = 'Get Waifu Image';
handler.query = "";
handler.example = "";
handler.status = true;

export default handler