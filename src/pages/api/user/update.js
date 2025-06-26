import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const { name, apikey } = req.body;

    try {
        const updated = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { name, apikey } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ success: true, user: updated });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
