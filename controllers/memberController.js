// controllers/memberController.js
import bcrypt from "bcryptjs";
import Member from "../models/Member.js";
import { signJWT } from "../utils/generateToken.js";

export const completeRegistration = async (req, res) => {
  try {
    const { email, password, token, name } = req.body;
    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ message: "No member invite" });
    if (member.inviteToken !== token) return res.status(400).json({ message: "Invalid token" });

    member.password = await bcrypt.hash(password, 10);
    member.name = name || member.name;
    member.status = "active";
    member.inviteToken = null;
    await member.save();

    res.json({ message: "Registration completed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ message: "Invalid credentials" });
    if (member.status !== "active") return res.status(403).json({ message: "Account not active" });

    const ok = await bcrypt.compare(password, member.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signJWT({ id: member._id, role: member.role });

    res.json({
      token,
      role: member.role,
      name: member.name,
      email: member.email,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.member.id); // req.member set by protect middleware
    if (!member) return res.status(404).json({ message: "User not found" });

    res.json({
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      style: member.style || "identicon",
      seed: member.seed || "user123",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar, style, seed } = req.body;

    const member = await Member.findById(req.member.id);
    if (!member) return res.status(404).json({ message: "User not found" });

    if (name) member.name = name;
    if (avatar) member.avatar = avatar;
    if (style) member.style = style;
    if (seed) member.seed = seed;

    await member.save();

    res.json({
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      style: member.style,
      seed: member.seed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addBalance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount } = req.body;

    console.log("💰 Backend received:", amount, "for member:", memberId);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.balance += Number(amount);
    await member.save();

    res.json({ message: "Balance updated", balance: member.balance });
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
// export const getMemberProfile = async (req, res) => {
//   console.log("🚀 Member ID from params:", req.params.memberId);
//   console.log("🚀 Actor from token:", req.actor.user);

//   try {
//     const member = await Member.findById(req.params.memberId);
//     if (!member) return res.status(404).json({ message: "Member not found" });
//     res.json(member);
//   } catch (err) {
//     console.error("❌ Backend error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

