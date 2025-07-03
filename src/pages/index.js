'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
    const [views, setViews] = useState(0);

    useEffect(() => {
        fetch("/api/views/index", { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                setViews(data.views);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Ryhar REST API</title>
                <meta name="description" content="REST API cepat, ringan, dan andal dari Ryhar — siap digunakan untuk integrasi aplikasi Anda." />
                <meta name="keywords" content="Ryhar, REST API, API Publik, JSON, integrasi, backend" />
                <meta name="author" content="Ryhar" />
                <meta property="og:title" content="Ryhar REST API" />
                <meta property="og:description" content="REST API fleksibel dan siap produksi untuk proyek aplikasi Anda." />
                <meta property="og:image" content="/favicon.ico" />
                <meta property="og:type" content="website" />
            </Head>
            <div className="bg-gradient-to-r from-[#1f1f2e] to-[#372a7a] min-h-screen text-white">
                <div className="mx-10 md:mx-15 lg:mx-20 flex flex-col md:flex-row items-center justify-evenly">
                    <div className="mt-20 md:text-xl md:w-1/2">
                        <h1 className="font-bold mb-10 md:mb-15 lg:mb-20 text-md md:text-xl lg:text-2xl bg-[#483AA0] p-2 rounded-lg shadow-md inline-block">
                            RyHar API
                        </h1>
                        <p>
                            <strong className="text-2xl md:text-3xl lg:text-4xl">Hello!</strong> <br />
                            <strong className="text-xl md:text-2xl lg:text-3xl">Welcome to the <span className="font-bold">RyHar API</span></strong>
                        </p>
                        <p className="mt-4 text-sm md:text-md lg:text-lg text-justify">
                            Ryhar API ini saya kembangkan sebagai backend untuk bot WhatsApp yang dilengkapi berbagai fitur menarik seperti download video, membuat gambar jadi HD, chat AI, edit gambar, dan masih banyak lagi. Semua layanan ini bisa diakses dengan mudah melalui protokol <strong>HTTP</strong> secara efisien dan terstruktur.
                        </p>
                        <div className="flex flex-col">
                            <Link href="/dashboard" className="text-md md:text-lg lg:text-xl justify-between w-[200px] md:w-[250px] flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-10">
                                Go to Dashboard
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                            <div className="flex flex-row gap-10">
                                <Link href="/auth/login" className="text-md md:text-lg lg:text-xl flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-5">
                                    Login
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                    </svg>
                                </Link>
                                <Link href="/auth/register" className="text-md md:text-lg lg:text-xl flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-5">
                                    Register
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="items-center justify-center hidden md:block min-w-[400px] overflow-hidden">
                        <Image src="/images/icon.png" width={700} height={700} alt="Icon"/>
                    </div>
                </div>
            </div>
        </>
    );
}