import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await dbConnect();
            const session = await getServerSession(req, res, authOptions);
            if (!session) return res.status(401).json({ message: "Unauthorized" });

            const user = await User.findOne({ email: session.user.email }, "-password");
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
