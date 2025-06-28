'use client';
import Navbar from "@/components/navbar";
import Alert from "@/components/alert";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Register() {
    const [step, setStep] = useState(1);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
    const [showAlert, setShowAlert] = useState({ message: "", visible: false });

    const router = useRouter();
    const { status } = useSession();

    const alert = (message, visible) => {
        setShowAlert({ message, visible });
        if (visible) {
            setTimeout(() => setShowAlert({ message: "", visible: false }), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email }),
        });

        if (res.ok) {
            alert('OTP telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.', true);
            setStep(2);
        } else {
            alert('Gagal mengirim OTP', true);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (form.otp.length !== 6 || isNaN(form.otp)) {
            return alert('OTP harus berupa angka 6 digit', true);
        }

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form }),
            });

            const data = await res.json();

            if (res.ok) {
                sessionStorage.removeItem('registerForm');
                alert(data.message, true);
                await delay(2000);
                router.push('/auth/login');
            } else {
                alert(data.message, true);
            }
        } catch (error) {
            alert('Terjadi kesalahan', true);
        }
    };

    const handleResend = async () => {
        if (!form?.email || resendCooldown > 0) return;
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message, true);
                setResendCooldown(30);
            } else {
                alert(data.message, true);
            }
        } catch (error) {
            alert('Terjadi kesalahan', true);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    return (
        <div>
            {step === 1 ? (
                <div>
                    <Navbar />
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg m-5 md:m-10">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold">Sign Up</h1>
                                <p className="text-gray-400">Create a new account by entering your details below</p>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-sm mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                        placeholder="Enter your email"
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm mb-2" htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                        placeholder="Enter your username"
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm mb-2" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                            placeholder="Enter your password"
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            className="absolute mt-2 right-2 text-sm text-gray-400 hover:text-gray-200" 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 font-bold">
                                    Sign Up
                                </button>
                                <p className="text-gray-400 mt-4">Already have an account? <Link href="/auth/login" className="text-[#483AA0] hover:underline">Sign In</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
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
                </div>
            )}
            <Alert message={showAlert.message} visible={showAlert.visible} onClose={() => setShowAlert({ message: "", visible: false })} />
        </div>
    );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));