import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useUser } from "@/context/userContext";

export default function Slug() {
    const router = useRouter();
    const [folders, setFolders] = useState([]);
    const { slug } = router.query;
    const dataUser = useUser();

    useEffect(() => {
        if (!slug) return;
        let url = "/api/features?type=" + slug;
        if (slug === "all") url = "/api/features";
        fetch(url, {
            method: "GET",
        }).then((res) => res.json())
            .then((data) => {
                setFolders(slug === "all" ? data.features : data);
            });
    }, [slug]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="overflow-x-auto">
                <input type="search" placeholder="Search" className="p-2 rounded-lg ml-5 md:ml-10 mt-5 md:mt-10 outline-2 outline-[#483AA0]" />
                <table className="w-full mt-5 md:mt-10 bg-[#1f1f2e] rounded-lg m-5 md:m-10 text-left">
                    <thead>
                        <tr>
                            <th scope="col" className="py-2 px-2 text-center">No</th>
                            <th scope="col" className="py-3 px-6">Feature Name</th>
                            <th scope="col" className="py-3 px-6">Category</th>
                            <th scope="col" className="py-3 px-6">Request Method</th>
                            <th scope="col" className="py-3 px-6">Description</th>
                            <th scope="col" className="py-3 px-6">Query Parameter</th>
                            <th scope="col" className="py-3 px-6">Status</th>
                            <th scope="col" className="py-3 px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {folders.map((folder, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-2 px-2 text-center">{index + 1}</td>
                                <td className="py-4 px-6">{folder.name}</td>
                                <td className="py-4 px-6">{folder.folder}</td>
                                <td className="py-4 px-6 text-center">{folder.method}</td>
                                <td className="py-4 px-6">{folder.desc}</td>
                                <td className="py-4 px-6">{folder.query}</td>
                                <td className="py-4 px-6">{folder.status}</td>
                                <td className="py-4 px-6">
                                    <Link href={`/api/features/${folder.folder}/${folder.name + folder.example}&apikey=${dataUser ? dataUser.apikey : "APIKEY"}`}>
                                        <button className="bg-[#483AA0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#372a7a] transition duration-300 font-bold">
                                            View
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}