import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await dbConnect();
            const { type, email } = req.query;
            const session = await getServerSession(req, res, authOptions);

            if (!session) return res.status(401).json({ message: "Unauthorized" });

            const user = await User.findOne({ email: session.user.email }, "-password");

            if (!user) return res.status(404).json({ message: "User not found" });

            if (type === "all" && user.status !== "admin") {
                return res.status(403).json({ message: "Forbidden" });
            } else if (type === "all" && user.status === "admin") {
                const users = await User.find({}).select("-password");
                return res.status(200).json({ success: true, users });
            }

            if (email && user.status !== "admin") {
                return res.status(403).json({ message: "Forbidden" });
            } else if (email && user.status === "admin") {
                const users = await User.findOne({ email }, "-password");
                if (!users) return res.status(404).json({ message: "User not found" });
                return res.status(200).json({ success: true, users });
            }

            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
