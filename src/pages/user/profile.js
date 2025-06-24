'use client';
import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";

export default function Profile() { 
    const [form, setForm] = useState({ name: "", apikey: "" });
    const [editName, setEditName] = useState(false);
    const [editApikey, setEditApikey] = useState(false);
    const dataUser = useUser();

    useEffect(() => {
        if (!dataUser) return;
        setForm({
            name: dataUser.name || "",
            apikey: dataUser.apikey || ""
        });
    }, [dataUser]);

    if (!dataUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1>Loading...</h1>
            </div>
        )
    };

    const handleSave = async () => {
        try {
            const response = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: dataUser.email,
                    name: form.name,
                    apikey: form.apikey,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEditName(false);
                setEditApikey(false);
                alert("Profile updated!");
                window.location.reload();
            } else {
                alert(`Update failed: ${data.message}`);
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg m-5 md:m-10 flex flex-col items-center scrollbar-hidden">
                <h1 className="text-xl md:text-2xl lg:text-3xl mb-2 font-bold">User <span className="text-[#483AA0]">Profile</span></h1>
                <div className="mt-8">
                    <div className="mb-5 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#272149] rounded-lg p-5 px-10 shadow-lg">
                            <p className="text-gray-400 font-bold">Name:</p>
                            <p className="text-md md:text-lg lg:text-xl font-bold overflow-x-auto">{dataUser.name}</p>
                        </div>
                        <div className="bg-[#272149] rounded-lg p-5 px-10 shadow-lg">
                            <p className="text-gray-400 font-bold">Email:</p>
                            <p className="text-md md:text-lg lg:text-xl font-bold overflow-x-auto">{dataUser.email}</p>
                        </div>
                        <div className="bg-[#272149] rounded-lg p-5 px-10 shadow-lg">
                            <p className="text-gray-400 font-bold">Apikey:</p>
                            <div className="flex items-center">
                                <p className="text-md md:text-lg lg:text-xl font-bold overflow-x-auto">{dataUser.apikey}</p>
                                <button onClick={() => navigator.clipboard.writeText(dataUser.apikey)} className="text-md md:text-lg lg:text-xl font-bold hover:text-[#483AA0] pl-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#272149] rounded-lg p-5 px-10 shadow-lg">
                            <p className="text-gray-400 font-bold">Limit API:</p>
                            <p className="text-md md:text-lg lg:text-xl font-bold overflow-x-auto">{`${dataUser.request_today} / ${limit[dataUser.status]}`}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg m-5 md:m-10 flex flex-col items-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl mb-2 font-bold">Edit <span className="text-[#483AA0]">Profile</span></h1>
                <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20">
                        <div className="flex flex-col">
                            <label className="block text-sm md:text-md lg:text-xl mb-2" htmlFor="name">Username</label>
                            <div className="flex flex-row">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0] mr-5"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    disabled={!editName}
                                    required
                                />
                                <button type="button" className={`cursor-pointer bg-[#483AA0] p-3 px-5 rounded-full hover:bg-[#2c2c3a] ${editName ? 'text-[#2c2c3a]' : ''}`} onClick={() => {
                                    if (editName) {
                                        handleSave();
                                    } else {
                                        setEditName(true);
                                    }
                                }}>{editName ? 'Save' : 'Edit'}</button>
                            </div>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="block text-sm md:text-md lg:text-xl mb-2" htmlFor="apikey">API Key</label>
                            <div className="flex flex-row">
                                <input
                                    type="text"
                                    id="apikey"
                                    name="apikey"
                                    className="w-full p-2 bg-[#2c2c3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483AA0] mr-5"
                                    placeholder="Enter your apikey"
                                    value={form.apikey}
                                    onChange={(e) => setForm({ ...form, apikey: e.target.value })}
                                    disabled={!editApikey}
                                    required
                                />
                                <button type="button" className={`cursor-pointer bg-[#483AA0] p-3 px-5 rounded-full hover:bg-[#2c2c3a] ${editApikey ? 'text-[#2c2c3a]' : ''}`} onClick={() => {
                                    if (editApikey) {
                                        handleSave();
                                    } else {
                                        setEditApikey(true);
                                    }
                                }}>{editApikey ? 'Save' : 'Edit'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const limit = {
    "basic": 100,
    "premium": 1000,
    "vip": 10000
}