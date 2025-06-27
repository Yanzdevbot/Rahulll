import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Pricing() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 m-5 md:m-10">
                {price.map((item, index) => (
                    <div key={index} className="bg-[#1f1f2e] rounded-lg p-5 shadow-lg flex flex-col items-center">
                        <h2 className="text-lg md:text-xl lg:text-2xl mb-2">{item.title}</h2>
                        <p className="text-gray-400 text-md md:text-lg lg:text-xl">Rp. {formatNumber(item.price)}</p>
                        <ul className="mt-4 flex flex-col items-center">
                            {item.features.map((feature, index) => (
                                <li key={index} className="mb-2 text-gray-400 text-center text-sm md:text-md lg:text-lg">{feature}</li>
                            ))}
                        </ul>
                        <Link href={item.link} target="_black" className="mt-4 bg-[#483AA0] hover:bg-[#372a7a] hover:scale-105 active:scale-95 px-4 py-2 rounded-lg shadow-md transition duration-300 font-bold text-sm md:text-md lg:text-lg">
                            Order
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
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