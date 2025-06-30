import checkApiKey from '../../../../../lib/middleware/checkApikey';
import runMiddleware from '../../../../../lib/runMiddleware';
import { downloadFile } from '../../../../../lib/downloadFile';
import fetch from 'node-fetch';

const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        await runMiddleware(req, res, checkApiKey);
        const { prompt } = req.query;
        if (!prompt) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request'
            });
        }
        const result = await textToImage(prompt);
        if (!result || !result.base64) {
            return res.status(500).json({
                status: false,
                message: 'Failed to process image'
            });
        }
        const download = await downloadFile(result.base64, true);
        return res.status(200).json({
            status: true,
            message: 'Image generated successfully',
            result: {
                url: process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'localhost' + ':' + process.env.PORT + download.filename
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
handler.folder = 'ai';
handler.desc = 'Generate an image from a text prompt using NVIDIA AI';
handler.query = "prompt";
handler.example = "?prompt=a+beautiful+landscape+with+mountains+and+sunset";
handler.status = true;

export default handler

async function textToImage(prompt) {
    const headers = {
        "Authorization": `Bearer ${process.env.NVIDIA_TOKEN}`,
        "Accept": "application/json",
    }
    const payload = {
        "prompt": prompt,
        "width": 1024,
        "height": 1024,
        "seed": 0,
        "steps": 4
    }
    const response = await fetch("https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell", {
        method: "post",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", ...headers }
    })
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    return data.artifacts[0] || null;
}