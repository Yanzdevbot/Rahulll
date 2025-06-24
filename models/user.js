import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    status: { type: String, default: "basic" },
    endDate: Date,
    image: { type: String, default: "default.jpg" },
    apikey: String,
    request_today: { type: Number, default: 0 },
    request_all: { type: Number, default: 0 },
    updateAt: Date
});

export default mongoose.models.User || mongoose.model("User", UserSchema);