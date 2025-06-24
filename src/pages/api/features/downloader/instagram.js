import Instagram from '../../../../../lib/scrapers/instagram';
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { url } = req.query;
        const ig = new Instagram()
        const response = await ig.download(url);
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
handler.folder = 'downloader';
handler.desc = 'Download video from Instagram';
handler.query = "url";
handler.example = "?url=https://www.instagram.com/reel/DLQC9GSBrf1/?utm_source=ig_web_copy_link";
handler.status = true;

export default handler