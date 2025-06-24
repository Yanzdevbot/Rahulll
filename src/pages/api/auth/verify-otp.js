import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Otp from '../../../../models/otp';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { name, email, password, otp } = req.body;

    await dbConnect();

    const otpEntry = await Otp.findOne({ email, code: otp });
    if (!otpEntry) return res.status(400).json({ message: 'OTP salah' });
    if (otpEntry.expiresAt < new Date())
        return res.status(400).json({ message: 'OTP sudah kadaluarsa' });

    await Otp.deleteMany({ email });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const apikey = getRandomApikey();

    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        apikey: apikey,
        createdAt: new Date()
    });

    await newUser.save();

    res.status(201).json({ message: 'Akun berhasil dibuat' });
}


function getRandomApikey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}