// controllers/adminController.js
import bcrypt from "bcryptjs";
import Member from "../models/Member.js";
import { randomInvite } from "../utils/generateToken.js";
import { sendCredentials } from "../utils/sendEmail.js";

// Admin adds member (admin or user) — called by a logged-in admin (req.actor.user)
export const addMember = async (req, res) => {
  try {
    const { email, password, role = "user", name } = req.body;

    if (!["admin", "user"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const inviteToken = randomInvite();
    const hash = await bcrypt.hash(password, 10);
    const memberName = name || email.split("@")[0];

    const member = await Member.create({
      name: memberName,
      email,
      password: hash,
      role,
      inviteToken,
      status: "pending",
    });

    await sendCredentials({
      to: email,
      subject: "Your CASE account invitation",
      html: `
        <h3>Welcome to CASE</h3>
        <p>Your account was created by Admin.</p>
        <p><b>Name:</b> ${memberName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p><b>Token:</b> ${inviteToken}</p>
      `,
    });

    res.status(201).json({ message: "Member invited", id: member._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    // req.actor.user is member object (admin)
    const admin = await Member.findById(req.actor.user._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, avatar, seed, style } = req.body;

    const updated = await Member.findByIdAndUpdate(
      req.actor.user._id,
      { name, avatar, seed, style },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin: updated });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Admin can list all members
export const listMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password"); // exclude password
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMemberProfile = async (req, res) => {
  console.log("🚀 Member ID from params:", req.params.memberId);
  console.log("🚀 Actor from token:", req.actor.user);

  try {
    const member = await Member.findById(req.params.memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ message: err.message });
  }
};

