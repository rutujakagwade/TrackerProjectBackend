// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    type: { type: String, enum: ["fuel", "food", "accommodation", "parking", "miscellaneous"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    receiptUrl: { type: String }, // path or url to uploaded file
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Member" }, // admin who approved
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
