// models/Member.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
    inviteToken: { type: String, default: null },
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending" },
    balance: { type: Number, default: 0 },
    avatar: { type: String },
    // optional user profile fields
    style: { type: String },
    seed: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
