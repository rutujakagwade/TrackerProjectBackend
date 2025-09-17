import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (e) {
    console.error("MongoDB error:", e.message);
    process.exit(1);
  }
}
