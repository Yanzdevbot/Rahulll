import { searchCharacter } from "../../../../../lib/scrapers/characterai";
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
        const result = await searchCharacter(query);
        if (!result || result.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            });
        }
        const sanitizedResult = result.map(character => ({
            id: character.characterId,
            name: character.displayName,
            greeting: character.greeting,
        }));
        return res.status(200).json({
            status: true,
            message: 'Success',
            result: sanitizedResult
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
handler.desc = 'Search CharacterAI Characters';
handler.query = "query";
handler.example = "?query=elaina";
handler.status = true;

export default handler