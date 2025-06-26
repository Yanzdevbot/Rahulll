import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import fakechat from '../../../../../lib/scrapers/fakechat';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { text, name, avatar } = req.query;
        if (!text || !name || !avatar) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const result = await fakechat(text, name, avatar)
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result);
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
handler.desc = 'Make text to fakechat';
handler.query = "text, name, avatar";
handler.example = "?text=Hello%20World&name=RyHar&avatar=https://pomf2.lain.la/f/v53tu30l.jpg";
handler.status = true;

export default handler