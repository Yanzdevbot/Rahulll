import otakudesu from "../../../../../lib/scrapers/otakudesu"
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { url } = req.query;
        const response = await otakudesu.download(url);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: response
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
handler.desc = 'Download Anime Info from Otakudesu';
handler.query = "url";
handler.example = "?url=https://otakudesu.cloud/episode/c20-sks-episode-12-sub-indo";
handler.status = true;

export default handler