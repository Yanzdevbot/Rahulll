'use client'

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useUser } from '@/context/userContext';

export default function Navbar() {
    const router = useRouter()
    const isActive = (href) => {
        return router.asPath === href
    }
    const navRef = useRef(null);
    const navRef2 = useRef(null);
    const [isOpenNav, setIsOpenNav] = useState(false);
    const dataUser = useUser();
    const { data: session } = useSession();

    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target) && navRef2.current && !navRef2.current.contains(event.target)) {
                setIsOpenNav(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (session) {
            if (!mainPage.find((item) => item.title === 'Profile')) {
                mainPage.push({
                    title: "Profile",
                    icon: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
                    link: "/user/profile"
                });
            }
            if (!mainPage.find((item) => item.title === 'Logout')) {
                mainPage.push({
                    title: "Logout",
                    icon: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75",
                    link: "#",
                    onClick: handleLogout
                });
            }
        }
    }, [session]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/dashboard' })
    }

    return (
        <div>
            <div ref={navRef} className="h-16 bg-[#1f1f2e] w-full flex items-center justify-between px-5 shadow-lg">
                <button className={`bg-transparent border-none cursor-pointer ml-5 my-auto hover:text-[#483AA0] transition duration-300 ${isOpenNav ? 'text-[#483AA0]' : ''}`} onClick={() => setIsOpenNav(!isOpenNav)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                {session ? (
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold">Halo, <span className="text-[#483AA0]">{dataUser?.name || "Loading..."}</span></h1>
                    </div>
                ) : ( 
                    <div className="flex items-center gap-2">
                        <Link href="/auth/login">
                            <button className={`bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 ${isActive('/auth/login') ? 'text-[#1f1f2e]' : ''}`}>
                                Login
                            </button>
                        </Link>
                        <Link href="/auth/register">
                            <button className={`bg-[#483AA0] px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 ${isActive('/auth/register') ? 'text-[#1f1f2e]' : ''}`}>
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
            <div ref={navRef2} className={`h-screen bg-[#1f1f2e] w-60 p-5 ${isOpenNav ? 'translate-x-0' : '-translate-x-full'} md:block transition duration-300 overflow-y-auto z-10 fixed top-0 left-0 shadow-lg`}>
                <div className="text-lg md:text-xl lg:text-2xl border-b border-[#483AA0] pb-5 font-bold">
                    <Link href="/">
                        RyHar <span className="text-[#483AA0]"> APIs</span>
                    </Link>
                </div>
                <div className="mt-10 border-b border-[#483AA0] pb-5">
                    <ul>
                        {mainPage.map((item, index) => (
                            <li key={index} className="mb-4">
                                <Link href={item.link} onClick={item?.onClick}>
                                    <div className={`flex items-center gap-2 hover:text-[#483AA0] cursor-pointer transition duration-300 text-sm lg:text-md ${isActive(item.link) ? 'text-[#483AA0]' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path d={item.icon} />
                                        </svg>
                                        <span className="text-md">{item.title}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-10 border-b border-[#483AA0] pb-5">
                    <ul>
                        {secondaryPage.map((item, index) => (
                            <li key={index} className="mb-4">
                                <Link href={item.link}>
                                    <div className={`flex items-center gap-2 hover:text-[#483AA0] cursor-pointer transition duration-300 text-sm md:text-md ${isActive(item.link) ? 'text-[#483AA0]' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path d={item.icon} />
                                        </svg>
                                        <span className="text-md">{item.title}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

const mainPage = [
    {
        title: "Dashboard",
        icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
        link: "/dashboard"
    },
    {
        title: "Pricing",
        icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z",
        link: "/pricing"
    }
]

const secondaryPage = [
    {
        title: "All Features",
        icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
        link: "/features/all"
    },
    {
        title: "Anime",
        icon: "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802",
        link: "/features/anime"
    },
    {
        title: "Downloader",
        icon: "M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3",
        link: "/features/downloader"
    },
    {
        title: "Searching",
        icon: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
        link: "/features/search"
    },
    {
        title: "Maker",
        icon: "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42",
        link: "/features/maker"
    }
]