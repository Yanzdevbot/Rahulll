import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, status, month } = req.body;
    if (!email || !status || !month) {
        return res.status(400).json({ error: "email, status, and month required" });
    }

    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ email: session.user.email }, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status !== "admin") return res.status(403).json({ message: "Forbidden" });

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(now.getMonth() + parseInt(month));

    const updatedUser = await User.findOneAndUpdate(
        { email },
        { status, endDate },
        { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Subscription updated", user: updatedUser });
}
