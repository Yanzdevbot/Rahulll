'use client';
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email }),
        });

        if (res.ok) {
            sessionStorage.setItem('registerForm', JSON.stringify(form));
            router.push('/auth/verify-otp');
        } else {
            alert('Gagal mengirim OTP');
        }
    };
    return (
        <div className="min-h-screen">
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
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    id="password"
                                    name="password"
                                    className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0]"
                                    placeholder="Enter your password"
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button type="button" className="absolute mt-2 right-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 font-bold">
                            Sign Up
                        </button>
                        <p className="text-gray-400 mt-4">Already have an account? <Link href="/auth/login" className="text-[#483AA0] hover:underline">Sign In</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}