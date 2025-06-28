import nodemailer from 'nodemailer';
import dbConnect from '../../../../lib/mongodb';
import Otp from '../../../../models/otp';
import User from '../../../../models/user';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email diperlukan' });

    await dbConnect();

    try {
        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        await Otp.deleteMany({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        await new Otp({ email, code: otp, expiresAt: expires }).save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Kode OTP Anda',
            text: `Kode OTP Anda adalah ${otp}. Berlaku selama 5 menit.`,
        });

        res.status(200).json({ message: 'OTP dikirim ke email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengirim OTP' });
    }
}