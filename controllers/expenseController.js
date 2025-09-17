// controllers/expenseController.js
import Expense from "../models/Expense.js";
import Member from "../models/Member.js";

// User adds expense
export const addExpense = async (req, res) => {
  try {
    const member = req.actor.user;
    const { type, amount, description } = req.body;

    if (!type || !amount) return res.status(400).json({ message: "Type and amount required" });

    // Get file URL from Cloudinary
    let receiptUrl = null;
    if (req.file && req.file.path) {
      receiptUrl = req.file.path; // Cloudinary URL
    }

    const expense = await Expense.create({
      member: member._id,
      type,
      amount,
      description,
      receiptUrl,
      status: "pending",
    });

    res.status(201).json({ message: "Expense added", expense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// User views their expenses (filter by status optional)
export const getMyExpenses = async (req, res) => {
  try {
    const member = req.actor.user;
    const { status } = req.query;
    const query = { member: member._id };
    if (status) query.status = status;
    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    res.json({ expenses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Admin views pending / all expenses (filter by status)
export const getAllExpenses = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const expenses = await Expense.find(query).populate("member", "name email").sort({ createdAt: -1 });
    res.json({ expenses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Approve/deny single
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.status = status;
    expense.approvedBy = req.actor.user._id;
    await expense.save();

    res.json({ message: `Expense ${status}`, expense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Bulk approve/deny (array of ids)
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids = [], status } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: "ids array required" });
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const result = await Expense.updateMany(
      { _id: { $in: ids } },
      { $set: { status, approvedBy: req.actor.user._id } }
    );

    res.json({ message: "Bulk update done", modifiedCount: result.nModified || result.modifiedCount });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
