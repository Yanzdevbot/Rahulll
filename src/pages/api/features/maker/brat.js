import axios from "axios";
import fs from "fs";
import path from "path";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { text } = req.query;
        const imageUrl = `https://brat.caliphdev.com/api/brat?text=${text}`
        const filename = `brat_${Date.now()}.jpg`;
        const filePath = path.join(process.cwd(), 'tmp', filename);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
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
handler.desc = 'Make text to brat';
handler.query = "text";
handler.example = "?text=Hello%20World";
handler.status = true;

export default handler