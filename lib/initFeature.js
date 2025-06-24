import fs from 'fs/promises';
import path from 'path';

const getAbsolutePath = (...parts) => path.join(process.cwd(), ...parts);
const featuresDir = getAbsolutePath('src/pages/api/features');
const cacheFile = getAbsolutePath('data/features.json');

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
    const featureLines = content.split('\n').filter((line) => /^handler\./.test(line));

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

    const data = { folders, features };
    await fs.mkdir(path.dirname(cacheFile), { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(data, null, 2), 'utf-8');
    return data;
};

export const loadFeatureCache = async () => {
    try {
        const content = await fs.readFile(cacheFile, 'utf-8');
        return JSON.parse(content);
    } catch {
        console.log('[init] Cache tidak ditemukan, generate baru...');
        return await generateAndSaveCache();
    }
};

const loadCache = async () => {
    console.log('Regenerating fresh cache on server start...');
    return await generateAndSaveCache(); // Selalu generate ulang saat start
};

export default loadCache;