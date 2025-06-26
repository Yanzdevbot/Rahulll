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
                            <div className="flex flex-col">
                                <Link href="/dashboard" className="mt-4">
                                    <button className="flex flex-row font-bold bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 mt-10 items-center">
                                        Go to Dashboard 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                        </svg>

                                    </button>
                                </Link>
                                <div className="flex flex-row">
                                    <Link href="/auth/login" className="mr-10">
                                        <button className="items-center flex flex-row font-bold bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 mt-5">
                                            Login
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-1 md:ml-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                            </svg>

                                        </button>
                                    </Link>
                                    <Link href="/auth/register" className="">
                                        <button className="items-center flex flex-row font-bold bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 mt-5">
                                            Register
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-1 md:ml-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                            </svg>

                                        </button>
                                    </Link>
                                </div>
                            </div>
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