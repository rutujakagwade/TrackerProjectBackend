// controllers/superadminController.js
import bcrypt from "bcryptjs";
import SuperAdmin from "../models/SuperAdmin.js";
import Member from "../models/Member.js";
import { signJWT, randomInvite } from "../utils/generateToken.js";
import { sendCredentials } from "../utils/sendEmail.js";

// Create superadmin (callable once) - or you can seed it manually
export const createSuperAdmin = async (req, res) => {
  try {
    const exists = await SuperAdmin.findOne();
    if (exists) return res.status(400).json({ message: "Superadmin already exists" });

    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const sa = await SuperAdmin.create({ name, email, password: hash });
    res.status(201).json({ message: "Superadmin created", id: sa._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// SuperAdmin login
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sa = await SuperAdmin.findOne({ email });
    if (!sa) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, sa.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signJWT({ id: sa._id, type: "superadmin" });

    res.json({ token, redirectTo: "/superadmin/dashboard", name: sa.name, email: sa.email });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Superadmin invites admin (creates Member with role 'admin' and sends email)
export const inviteAdmin = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const inviteToken = randomInvite();
    const hash = await bcrypt.hash(password, 10);
    const memberName = name || email.split("@")[0];

    const member = await Member.create({
      name: memberName,
      email,
      password: hash,
      role: "admin",
      inviteToken,
      status: "pending",
    });

    // send email using your existing sendCredentials util
    await sendCredentials({
      to: email,
      subject: "CASE Admin Invitation",
      html: `
        <h3>Admin Account Invitation</h3>
        <p>You have been invited as an admin.</p>
        <p><b>Name:</b> ${memberName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p><b>Token:</b> ${inviteToken}</p>
      `,
    });

    res.status(201).json({ message: "Admin invited", id: member._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
