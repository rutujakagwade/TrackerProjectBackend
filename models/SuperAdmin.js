// models/SuperAdmin.js
import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdmin", superAdminSchema);
