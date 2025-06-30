import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import { downloadFile } from '../../../../../lib/downloadFile';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const imageUrl = `https://brat.caliphdev.com/api/brat?text=${text}`
        const download = await downloadFile(imageUrl);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(download.data);
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