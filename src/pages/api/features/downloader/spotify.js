import { SpotifyAPI } from '../../../../../lib/scrapers/spotify';
import ytSearch from '../../../../../lib/scrapers/youtube-search';
import { downloadFile } from '../../../../../lib/downloadFile';
import Youtube from '../../../../../lib/scrapers/youtube-audio';
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const youtube = new Youtube();

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
        if (!/^https:\/\/open\.spotify\.com\/track\/[-a-zA-Z0-9]+/i.test(url)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid Spotify Track URL'
            });
        }
        const trackId = url.replace('https://', '').split('/')[2];
        const spotify = await SpotifyAPI();
        const result = await spotify.getTracks(trackId);
        const audioUrl = await getAudio(result.name + ' ' + result.artists[0].name);
        if (!audioUrl) {
            return res.status(500).json({
                status: false,
                message: 'Failed to download audio'
            });
        }
        const audioBuffer = await downloadFile(audioUrl, true);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: { ...result, audio: (process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'localhost' + ':' + process.env.PORT) + audioBuffer.filename },
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
handler.desc = 'Download Audio from Spotify';
handler.query = "url";
handler.example = "?url=https://open.spotify.com/track/65fpYBrI8o2cfrwf2US4gq";
handler.status = true;

export default handler

async function getAudio(query) {
    const { url } = (await ytSearch(query))[0];
    const response = await youtube.downloadAudio(url);
    if (!response) throw new Error('Failed to download audio');
    return response.downloadUrl
}