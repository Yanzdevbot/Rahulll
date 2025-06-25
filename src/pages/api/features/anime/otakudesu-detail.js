import otakudesu from "../../../../../lib/scrapers/otakudesu"
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

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
        const result = await otakudesu.detail(url);
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
handler.folder = 'anime';
handler.desc = 'Get Detail Anime Info from Otakudesu';
handler.query = "url";
handler.example = "?url=https://otakudesu.cloud/anime/compass-20-sub-indo";
handler.status = true;

export default handler