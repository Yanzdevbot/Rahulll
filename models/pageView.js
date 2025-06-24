import mongoose from 'mongoose';

const PageViewSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    views: { type: Number, default: 0 },
    ips: { type: [String], default: [] }
});

export default mongoose.models.PageView || mongoose.model("PageView", PageViewSchema);
