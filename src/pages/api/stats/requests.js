import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/user';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const users = await User.find({});

        const totalUsers = users.length;
        const totalRequestsAll = users.reduce((sum, user) => sum + (user.request_all || 0), 0);
        const totalRequestsToday = users.reduce((sum, user) => sum + (user.request_today || 0), 0);

        return res.status(200).json({
            total_users: totalUsers,
            total_requests_all: totalRequestsAll,
            total_requests_today: totalRequestsToday,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}
