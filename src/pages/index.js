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
            <main>
                <div className="min-h-screen">
                    <h1 className="font-bold m-10 md:m-15 lg:m-20 text-md md:text-xl lg:text-2xl bg-[#483AA0] p-2 rounded-lg shadow-md inline-block">
                        Rest API
                    </h1>
                    <div className="mx-10 md:mx-15 lg:mx-20 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:text-xl md:w-1/2">
                            <p>
                                <strong className="text-2xl md:text-3xl lg:text-4xl">Hello!</strong> <br />
                                <strong className="text-xl md:text-2xl lg:text-3xl">Welcome to the Rest API</strong>
                            </p>
                            <p className="mt-4 text-sm md:text-md lg:text-lg ">
                                REST API ini dikembangkan oleh Ryhar sebagai backend service
                                yang dapat digunakan untuk mengelola dan menyediakan data melalui
                                protokol <strong>HTTP</strong> secara efisien dan terstruktur.
                            </p>
                            <Link href="/dashboard" className="mt-4">
                                <button className="font-bold bg-[#483AA0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 mt-10">
                                    Go to Dashboard
                                </button>
                            </Link>
                        </div>
                        <div className="items-center justify-center w-80 lg:w-100 mt-10 md:mt-0">
                            <div className="bg-[#483AA0] rounded-full p-5 shadow-md">
                                <Image src="/images/icon.png" width={500} height={500} alt="Icon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}