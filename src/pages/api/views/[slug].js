import dbConnect from "../../../../lib/mongodb";
import PageView from "../../../../models/pageView";

export default async function handler(req, res) {
    const { slug } = req.query;
    await dbConnect();

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    if (req.method === "POST") {
        let page = await PageView.findOne({ slug });

        if (!page) {
            page = await PageView.create({ slug, views: 1, ips: [ip] });
        } else {
            if (!page.ips.includes(ip)) {
                page.views += 1;
                page.ips.push(ip);
                await page.save();
            }
        }

        return res.status(200).json({ views: page.views });
    }

    if (req.method === "GET") {
        const page = await PageView.findOne({ slug });
        return res.status(200).json({ views: page?.views || 0 });
    }

    res.status(405).end();
}
