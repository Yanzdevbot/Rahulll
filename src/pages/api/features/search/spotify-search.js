import { SpotifyAPI } from '../../../../../lib/scrapers/spotify';
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const spotify = await SpotifyAPI();
        const result = await spotify.trackSearch(query);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: result.tracks.items
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
handler.folder = 'search';
handler.desc = 'Search Audio from Spotify';
handler.query = "query";
handler.example = "?query=mantra%20hujan";
handler.status = true;

export default handler