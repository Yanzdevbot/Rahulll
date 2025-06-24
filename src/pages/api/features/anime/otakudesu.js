const handler = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end();
    return res.status(200).json({ message: 'Hello World!' });
}

handler.method = 'GET';
handler.folder = 'anime';
handler.desc = 'Get Anime Info from Otakudesu';
handler.query = "query";
handler.example = "?query=one%20piece";
handler.status = true;

export default handler