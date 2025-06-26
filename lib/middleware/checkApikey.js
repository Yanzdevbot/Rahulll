import dbConnect from '../mongodb';
import User from '../../models/user';

export default async function checkApiKey(req, res, next) {
    const apiKey = req.query.apikey;

    if (!apiKey) return res.status(401).json({ message: 'API Key required' });

    await dbConnect();

    const user = await User.findOne({ apikey: apiKey });
    if (!user) return res.status(403).json({ message: 'Invalid API Key' });

    if (user.status !== 'premium' && user.request_today >= limit[user.status]) {
        return res.status(403).json({ message: 'API Key limit exceeded' });
    }

    const today = new Date().toDateString();
    const lastUpdated = user.updateAt?.toDateString();

    if (today !== lastUpdated) {
        user.request_today = 0;
        user.updateAt = new Date();
    }

    user.request_today += 1;
    user.request_all += 1;
    await user.save();

    req.user = user;
    next();
}

const limit = {
    "basic": 100,
    "premium": 1000,
    "vip": 10000,
    "admin": 100000
}