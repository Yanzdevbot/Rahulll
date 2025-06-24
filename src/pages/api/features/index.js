import { loadFeatureCache } from '../../../../lib/initFeature';

let featureCache = null;

(async () => {
    featureCache = await loadFeatureCache();
})();

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    try {
        const { type } = req.query;

        if (!featureCache) {
            featureCache = await loadFeatureCache();
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
