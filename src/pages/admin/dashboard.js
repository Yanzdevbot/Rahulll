import { useUser } from "@/context/userContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Alert from "@/components/alert";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/user";

export default function Dashboard({ users, dataUser }) {
    const user = useUser();
    const router = useRouter();
    const [totalFeature, setTotalFeature] = useState(0);
    const [search, setSearch] = useState("");
    const [email, setEmail] = useState([]);
    const [showAlert, setShowAlert] = useState({ message: "", visible: false });
    const [form, setForm] = useState({ email: "", status: "premium", month: 1 });
    const [data, setData] = useState({
        totalUser: 0,
        profit_premium: 0,
        profit_vip: 0,
        basic: 0,
        premium: 0,
        vip: 0
    });

    const alert = (message, visible) => {
        setShowAlert({ message, visible });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email) return alert("Email tidak boleh kosong", true);
        if (!form.status) return alert("Status tidak boleh kosong", true);
        if (!form.month) return alert("Bulan tidak boleh kosong", true);

        const res = await fetch('/api/user/set-subscribtion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.error) return alert(data.error, true);
            alert(data.message, true);
        }
    };

    useEffect(() => {
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));
        if (!search) 
            return setEmail([]);
        setEmail(filteredUsers.map((user) => user.email));
    }, [search, users]);

    useEffect(() => {
        fetch("/api/features")
            .then((res) => res.json())
            .then((data) => {
                setTotalFeature(data.features.length);
            });
    }, []);

    useEffect(() => {
        setData({
            totalUser: dataUser.totalUser,
            profit_premium: dataUser.profit_premium,
            profit_vip: dataUser.profit_vip,
            basic: dataUser.basic,
            premium: dataUser.premium,
            vip: dataUser.vip
        })
    }, [dataUser]);

    useEffect(() => {
        if (user?.status !== "admin") {
            router.push("/dashboard");
        }
    }, [user, router]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5 p-5 md:p-10 w-full overflow-y-auto"> 
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">Total User</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? formatNumber(data.totalUser) : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">Total Fitur API</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? formatNumber(totalFeature) : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">User Basic</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? formatNumber(data.basic) : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">User Premium</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? formatNumber(data.premium) : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">User VIP</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? formatNumber(data.vip) : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">Profit Premium</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? `Rp. ${formatNumber(data.profit_premium)}` : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">Profit VIP</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? `Rp. ${formatNumber(data.profit_vip)}` : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                    </div>  
                </div>
                <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5">
                    <h2 className="text-sm md:text-md mb-2 text-[#483AA0]">Total Profit</h2>
                    <div className="flex items-center justify-between mb-4 text-xl md:text-2xl font-bold">
                        <p className="text-gray-400">{user !== null ? `Rp. ${formatNumber(data.profit_premium + data.profit_vip)}` : (
                            <span>Loading...</span>
                        )}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#483AA0]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                    </div>  
                </div>
            </div>
            <div className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg mb-5 m-5 md:m-10 flex flex-col items-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl mb-5 md:mb-10 font-bold">Upgrade <span className="text-[#483AA0]">User</span></h1>
                <form onSubmit={handleSubmit} className="flex flex-col text-sm md:text-md lg:text-lg">
                    <div className="w-full md:w-1/2">
                        <p>Search Username</p>
                        <input type="search" className="ring-1 hover:ring-[#483AA0] rounded-lg p-2 w-full mb-5 md:mb-10" placeholder="Search Username" required onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div>
                        <p>Pilih Email</p>
                        <select value={form.email} className="ring-1 hover:bg-[#483AA0] focus:bg-[#483AA0] hover:ring-[#483AA0] rounded-lg p-2 w-full mb-5 md:mb-10" onChange={(e) => setForm({...form, email: e.target.value})}>
                            <option value="">Pilih Email</option>
                            {email.map((user, index) => {
                                return (
                                    <option key={index} value={user}>{user}</option>
                                )
                            })}
                    </select>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-10 lg:gap-15 mb-5 md:mb-10">
                        <div>
                            <p>Pilih Status</p>
                            <select value={form.status} className="ring-1 hover:bg-[#483AA0] focus:bg-[#483AA0] hover:ring-[#483AA0] rounded-lg p-2 w-full" onChange={(e) => setForm({...form, status: e.target.value})}>
                                <option value="premium">Premium</option>
                                <option value="vip">Vip</option>
                            </select>
                        </div>
                        <div>
                            <p>Pilih Durasi</p>
                            <select value={form.month} className="ring-1 hover:bg-[#483AA0] focus:bg-[#483AA0] hover:ring-[#483AA0] rounded-lg p-2 w-full" onChange={(e) => setForm({...form, month: parseInt(e.target.value)})}>
                                <option value="1">1 Bulan</option>
                                <option value="2">2 Bulan</option>
                                <option value="3">3 Bulan</option>
                                <option value="4">4 Bulan</option>
                                <option value="5">5 Bulan</option>
                                <option value="6">6 Bulan</option>
                                <option value="7">7 Bulan</option>
                                <option value="8">8 Bulan</option>
                                <option value="9">9 Bulan</option>
                                <option value="10">10 Bulan</option>
                                <option value="11">11 Bulan</option>
                                <option value="12">12 Bulan</option>
                                <option value="13">13 Bulan</option>
                                <option value="14">14 Bulan</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="bg-[#483AA0] hover:bg-[#483AA0]/40 active:bg-[#483AA0]/60 rounded-lg p-2 w-full mb-5">Upgrade</button>
                </form>
            </div>
            <Alert message={showAlert.message} visible={showAlert.visible} onClose={() => setShowAlert({ message: "", visible: false })} />
        </div>
    );
}

export async function getServerSideProps(context) {
    await dbConnect();

    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    const user = await User.findOne({ email: session.user.email }, "-password");
    if (!user || user.status !== "admin") {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    const users = await User.find({}).lean();
    const data = {
        totalUser: users.length,
        basic: users.filter(u => u.status === "basic").length,
        premium: users.filter(u => u.status === "premium").length,
        vip: users.filter(u => u.status === "vip").length,
        profit_premium: countProfitPremium(users),
        profit_vip: countProfitVip(users)
    };

    return {
        props: {
            users: users.map((user) => {
                return {
                    name: user.name,
                    email: user.email,
                    status: user.status,
                }
            }),
            dataUser: data,
        },
    };
}

function formatNumber(number) {
    return number.toLocaleString('id-ID');
}

function countProfitPremium(data) {
    data = data.filter(item => item.status === "premium");
    return data.length * 10000;
}

function countProfitVip(data) {
    data = data.filter(item => item.status === "vip");
    return data.length * 20000;
}

