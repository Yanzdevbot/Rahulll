'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Alert from '@/components/alert';

export default function VerifyOTP() {
    const [resendCooldown, setResendCooldown] = useState(30);
    const [showAlert, setShowAlert] = useState({ message: "", visible: false });
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        otp: ''
    });
    const router = useRouter();

    const alert = (message, visible) => {
        setShowAlert({ message, visible });
        if (visible) {
            setTimeout(() => setShowAlert({ message: "", visible: false }), 3000); // Auto-hide alert after 3 seconds
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (form.otp.length !== 6 || isNaN(form.otp)) {
            return alert('OTP must be a 6-digit number', true);
        }

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form }),
            });

            if (res.ok) {
                sessionStorage.removeItem('registerForm');
                alert('Berhasil daftar!', true);
                await delay(2000);
                router.push('/auth/login');
            } else {
                alert('OTP salah atau expired', true);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat memverifikasi OTP', true);
        }
    };

    const handleResend = async () => {
        if (!form?.email || resendCooldown > 0) return; // Prevent resend if cooldown is active
        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });

            if (res.ok) {
                alert('OTP dikirim ulang', true);
                setResendCooldown(30);
            } else {
                alert('Gagal kirim ulang OTP', true);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat mengirim OTP', true);
        }
    };

    useEffect(() => {
        const data = sessionStorage.getItem('registerForm');
        if (!data) {
            router.push('/auth/register');
        } else {
            setForm(JSON.parse(data));
        }
    }, [router]);

    useEffect(() => {
        if (resendCooldown === 0) return;
        const intervalId = setInterval(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearInterval(intervalId);
    }, [resendCooldown]);

    return (
        <div>
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
                                value={form.otp}
                                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                                className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                placeholder="Enter your OTP"
                                required
                            />
                            <div className='flex flex-col'>
                                <button 
                                    type="submit" 
                                    className="mt-4 bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 font-bold"
                                >
                                    Verify
                                </button>
                                <button 
                                    type='button' 
                                    onClick={handleResend} 
                                    className={`mt-2 bg-transparent ${resendCooldown > 0 ? 'text-gray-500' : ''} hover:underline`} 
                                    disabled={resendCooldown > 0} // Disable button during cooldown
                                >
                                    {resendCooldown === 0 ? 'Resend OTP' : `Resend OTP in ${resendCooldown} seconds`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Alert 
                message={showAlert.message} 
                visible={showAlert.visible} 
                onClose={() => setShowAlert({ message: "", visible: false })} 
            />
        </div>
    );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));