import fs from 'fs/promises';
import path from 'path';

const getAbsolutePath = (...parts) => path.join(process.cwd(), ...parts);
const featuresDir = getAbsolutePath('src/pages/api/features');
const cacheFile = getAbsolutePath('data/features.json');

/**
 * Reads the specified directory and returns a list of names of all subdirectories.
 *
 * @param {string} dirPath - The path to the directory to be read.
 * @returns {Promise<string[]>} A promise that resolves to an array of subdirectory names.
 */

const readDir = async (dirPath) => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((dir) => dir.name);
};

/**
 * Reads the specified directory and returns a list of file names
 * that are JavaScript or TypeScript files.
 *
 * @param {string} dirPath - The path to the directory to be read.
 * @returns {Promise<string[]>} A promise that resolves to an array of file names.
 */

const getFiles = async (dirPath) => {
    const entries = await fs.readdir(dirPath);
    return entries.filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
};

/**
 * Reads the specified file and returns a feature object that contains
 * the name of the file and the properties from the file, such as
 * method, folder, desc, query, example, and status.
 *
 * @param {string} filePath - The path to the file to be read.
 * @returns {Promise<{name: string, [key: string]: string}>}
 * A promise that resolves to an object with the feature properties.
 */
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

/**
 * Generates a cache of feature data by reading all feature files from
 * specified directories, parsing their contents, and saving the compiled
 * data into a cache file. The cache includes folder names and feature
 * details such as method, folder, description, query, example, and status.
 * 
 * @returns {Promise<{folders: string[], features: Object[]}>} A promise
 * that resolves to an object containing the folders and features arrays.
 */

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

/**
 * Loads the feature cache from a file. If the file does not exist, it will
 * generate a new cache by reading all feature files from the specified
 * directories, parsing their contents, and saving the compiled data into a
 * cache file.
 *
 * @returns {Promise<{folders: string[], features: Object[]}>} A promise
 * that resolves to an object containing the folders and features arrays.
 */
export const loadFeatureCache = async () => {
    try {
        const content = await fs.readFile(cacheFile, 'utf-8');
        return JSON.parse(content);
    } catch {
        console.log('[init] Cache tidak ditemukan, generate baru...');
        return await generateAndSaveCache();
    }
};

/**
 * Regenerates and returns a fresh feature cache by calling the
 * generateAndSaveCache function. This function logs a message indicating
 * that the cache is being regenerated on server start and always generates
 * a new cache upon invocation.
 *
 * @returns {Promise<{folders: string[], features: Object[]}>} A promise
 * that resolves to an object containing the folders and features arrays.
 */

const loadCache = async () => {
    console.log('Regenerating fresh cache on server start...');
    return await generateAndSaveCache(); // Selalu generate ulang saat start
};

export default loadCache;