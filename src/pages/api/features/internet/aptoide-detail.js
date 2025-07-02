import Aptoide from '../../../../../lib/scrapers/aptoide';
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const aptoide = new Aptoide();

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const result = await aptoide.download(id);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result
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
handler.folder = 'internet';
handler.desc = 'Get Detail Apk from Aptoide';
handler.query = "id";
handler.example = "?id=com.groundhog.mcpemaster";
handler.status = true;

export default handler