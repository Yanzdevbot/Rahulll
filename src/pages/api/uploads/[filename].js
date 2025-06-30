import fs from 'fs';
import path from 'path';
import { fileTypeFromFile } from 'file-type';

export default async function handler(req, res) {
    const { filename } = req.query;
    const filePath = path.join(process.cwd(), 'tmp', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const fileType = await fileTypeFromFile(filePath);
    const mime = fileType?.mime || 'application/octet-stream';

    res.setHeader('Content-Type', mime);

    res.setHeader('Cache-Control', 'no-cache');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
}
