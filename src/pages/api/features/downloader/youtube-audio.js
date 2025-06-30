import fs, { link } from "fs";
import fetch from "node-fetch";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import Downloader from "../../../../../lib/scrapers/youtube-audio";
import { downloadFile } from "../../../../../lib/downloadFile";

const downloader = new Downloader();

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
        const result = await downloader.ytMp3Downloader(url);
        const download = await downloadFile(result.downloadUrl, true);
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: {
                title: result.title,
                thumbnail: result.thumbnail,
                description: result.description,
                view: formatNumber(result.viewCount),
                size: result.size,
                link: (process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'localhost' + ':' + process.env.PORT) + download.filename
            }
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
handler.desc = 'Download audio from Youtube';
handler.query = "url";
handler.example = "?url=https://youtu.be/J_CFBjAyPWE?si=XqtlwFyxlauEUl9v";
handler.status = true;

export default handler

function formatNumber(number) {
    number = parseInt(number);
    return number.toLocaleString('id-ID');
}