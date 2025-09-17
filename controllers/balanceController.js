// controllers/balanceController.js
import Balance from "../models/Balance.js";
import Member from "../models/Member.js";

export const addBalance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Option A: member.balance field
    member.balance += Number(amount);
    await member.save();

    // Optionally keep separate balance collection:
    let balance = await Balance.findOne({ member: memberId });
    if (!balance) {
      balance = await Balance.create({ member: memberId, amount });
    } else {
      balance.amount += Number(amount);
      await balance.save();
    }

    res.json({ message: "Balance updated", balanceAmount: member.balance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId).select("balance");
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json({ amount: member.balance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
