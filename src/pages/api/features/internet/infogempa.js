import axios from "axios";
import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const result = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: result.data.Infogempa.gempa
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
handler.desc = 'Get Info Gempa';
handler.query = "";
handler.example = "";
handler.status = true;

export default handler