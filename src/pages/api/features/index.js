import fs from 'fs/promises';
import path from 'path';

const getAbsolutePath = (...parts) => path.join(process.cwd(), ...parts);
const featuresDir = getAbsolutePath('src/pages/api/features');
const cacheFile = getAbsolutePath('data/features.json'); // <- lokasi simpan cache

const readDir = async (dirPath) => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((dir) => dir.name);
};

const getFiles = async (dirPath) => {
    const entries = await fs.readdir(dirPath);
    return entries.filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
};

const parseFeatureFile = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf-8');

    const featureLines = content
        .split('\n')
        .filter((line) => /^handler\./.test(line));

    const feature = featureLines.reduce((acc, line) => {
        const [left, ...rightParts] = line.split('=');
        const right = rightParts.join('=');

        const key = left.split('.')[1]?.trim();
        const value = right.trim().replace(/(^['"`]|['"`]|;?$)/g, '');

        if (key) acc[key] = value;
        return acc;
    }, {});

    return {
        name: path.parse(filePath).name,
        ...feature,
    };
};

const generateAndSaveCache = async () => {
    const folders = await readDir(featuresDir);
    const features = [];

    for (const folder of folders) {
        const folderPath = path.join(featuresDir, folder);
        const files = await getFiles(folderPath);

        const parsed = await Promise.all(
            files.map((file) => {
                const filePath = path.join(folderPath, file);
                return parseFeatureFile(filePath);
            })
        );

        features.push(...parsed);
    }

    const data = {
        folders,
        features,
    };

    // Pastikan folder `data/` ada
    await fs.mkdir(path.dirname(cacheFile), { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(data, null, 2), 'utf-8');
    return data;
};

let featureCache = null;

const loadCache = async () => {
    try {
        const content = await fs.readFile(cacheFile, 'utf-8');
        return JSON.parse(content);
    } catch {
        console.log('Cache tidak ditemukan, generate baru...');
        return await generateAndSaveCache();
    }
};

// Load cache saat module pertama kali dijalankan
(async () => {
    featureCache = await loadCache();
})();

// API handler
export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    try {
        const { type } = req.query;

        if (!featureCache) {
            featureCache = await loadCache(); // jaga-jaga jika belum kebaca
        }

        if (type) {
            const filtered = featureCache.features.filter((f) => f.category === type || f.folder === type);
            return res.status(200).json(filtered);
        }

        return res.status(200).json(featureCache);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal membaca cache fitur.' });
    }
}
