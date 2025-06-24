'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [form, setForm] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const data = sessionStorage.getItem('registerForm');
        if (!data) router.push('/auth/register');
        else setForm(JSON.parse(data));
    }, [router]);

    useEffect(() => {
        if (resendCooldown === 0) return;
        const i = setInterval(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearInterval(i);
    }, [resendCooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, otp }),
        });

        if (res.ok) {
            sessionStorage.removeItem('registerForm');
            alert('Berhasil daftar!');
            router.push('/auth/login');
        } else {
            alert('OTP salah atau expired');
        }
    };

    const handleResend = async () => {
        if (!form?.email) return;
        const res = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email }),
        });

        if (res.ok) {
            alert('OTP dikirim ulang');
            setResendCooldown(30);
        } else {
            alert('Gagal kirim ulang OTP');
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg m-5 md:m-10">
                    <div className="mb-4">
                        <h1 className="text-xl md:text-2xl font-bold">Check Your Email</h1>
                        <p className="text-gray-400">Please Enter 6 digit OTP</p>
                    </div>
                    <div className="mb-4 flex flex-col">
                        <form onSubmit={handleVerify}>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                placeholder="Enter your OTP"
                                required
                            />
                            <div className='flex flex-col'>
                                <button type="submit" className="mt-4 bg-[#483AA0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 font-bold">
                                    Verify
                                </button>
                                <button type='button' onClick={handleResend} className={`mt-2 bg-invisible ${resendCooldown > 0 ? 'text-gray-500' : ''} hover:underline `}>
                                    {resendCooldown === 0 ? 'Resend OTP' : `Resend OTP in ${resendCooldown} seconds`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}