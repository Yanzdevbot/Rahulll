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
            <div className="min-h-screen flex items-center justify-center">
                <div className="mx-10 md:mx-15 lg:mx-20 flex flex-col md:flex-row items-center justify-between md:gap-10 lg:gap-20">
                    <div className="md:text-xl md:w-1/2">
                        <h1 className="font-bold mb-10 md:mb-15 lg:mb-20 text-md md:text-xl lg:text-2xl bg-[#483AA0] p-2 rounded-lg shadow-md inline-block">
                            RyHar API
                        </h1>
                        <p>
                            <strong className="text-2xl md:text-3xl lg:text-4xl">Hello!</strong> <br />
                            <strong className="text-xl md:text-2xl lg:text-3xl">Welcome to the <span className="font-bold">RyHar API</span></strong>
                        </p>
                        <p className="mt-4 text-sm md:text-md lg:text-lg ">
                            Ryhar API ini saya kembangkan sebagai backend untuk bot WhatsApp yang dilengkapi berbagai fitur menarik seperti download video, membuat gambar jadi HD, chat AI, edit gambar, dan masih banyak lagi. Semua layanan ini bisa diakses dengan mudah melalui protokol <strong>HTTP</strong> secara efisien dan terstruktur.
                        </p>
                        <div className="flex flex-col">
                            <Link href="/dashboard" className="justify-between w-11/16 lg:w-1/2 flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-10">
                                Go to Dashboard
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                            <div className="flex flex-row gap-10">
                                <Link href="/auth/login" className="flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-5">
                                    Login
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                    </svg>
                                </Link>
                                <Link href="/auth/register" className="flex flex-row items-center font-bold bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 mt-5">
                                    Register
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 ml-2 md:ml-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="items-center justify-center hidden md:block md:w-1/2 mt-10 md:mt-0">
                        <div className="bg-[#483AA0] rounded-full p-5 shadow-md">
                            <Image src="/images/icon.png" width={500} height={500} alt="Icon"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                <svg className="relative block animate-wave w-[200%]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V10C150,50,350,50,600,20C850,-10,1050,10,1200,20V0Z" fill="#483AA0" ></path>
                </svg>
            </div>
            <div className="bg-[#483AA0] min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 md:size-15 lg:size-20 mt-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mt-2">What is an API ?</h1>
                        <p className="text-center mt-2 text-gray-400 m-5">API (Application Programming Interface) is a set of rules and protocols that allows one application to communicate with another.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 md:size-15 lg:size-20 mt-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                        </svg>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mt-2">How API Works ?</h1>
                        <p className="text-center mt-2 text-gray-400 m-5">An API is a way for two programs to talk to each other. It lets one app ask another for data or services, and get a response back — like placing an order and receiving the result.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 md:size-15 lg:size-20 mt-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Pricing</h1>
                    <p className="text-center mt-2 text-gray-400 m-5">Need an API? We&apos;re here for you. Fast, reliable, and easy-to-use APIs to power your applications.</p>
                    <div className="w-full overflow-x-auto snap-x snap-mandatory flex-col items-center block md:flex">
                        <div className="flex space-x-4 p-4 w-max md:gap-10 lg:gap-15">
                            {price.map((item, index) => {
                                return (
                                    <Link key={index} href={item.link} target="_blank" className="active:scale-95 transition-transform duration-300 ease-in-out hover:-translate-y-3 p-10 flex flex-col items-center justify-center backdrop-blur-sm bg-[#1f1f2e]/60 rounded-md snap-center">
                                        <h2 className="text-lg md:text-xl lg:text-2xl mb-2">{item.title}</h2>
                                        <p className="text-gray-400 text-md md:text-lg lg:text-xl">Rp. {formatNumber(item.price)}</p>
                                        <ul className="mt-4 flex flex-col items-center">
                                            {item.features.map((feature, index) => (
                                            <li key={index} className="mb-2 text-gray-400 text-center text-sm md:text-md lg:text-lg">{feature}</li>
                                            ))}
                                        </ul>
                                </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const price = [
    {
        title: "Free",
        price: 0,
        features: ["Up to 100 requests per day", "Access to basic features", "No premium features"],
        link: "/dashboard"
    },
    {
        title: "Premium",
        price: 10000,
        features: ["Up to 1000 requests per day", "Access to premium features", "Priority support"],
        link: "https://wa.me/6289508188642?text=halo+bang+mau+paket+premium"
    },
    {
        title: "VIP",
        price: 20000,
        features: ["Up to 10000 requests per day", "Access to all features", "24/7 support"],
        link: "https://wa.me/6289508188642?text=halo+bang+mau+paket+vip"
    }
]

function formatNumber(number) {
    return number.toLocaleString('id-ID');
}