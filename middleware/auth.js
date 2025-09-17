// middleware/auth.js
import jwt from "jsonwebtoken";
import Member from "../models/Member.js";
import SuperAdmin from "../models/SuperAdmin.js";

/**
 * protect(allowedRoles = [], expectedType = 'member')
 * - allowedRoles: array of allowed member roles ('admin'|'user'), empty array => allow any role
 * - expectedType: 'member' or 'superadmin' or 'either'
 */
export const protect = (allowedRoles = [], expectedType = "member") => async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token contains type, use it, else fallback to expectedType
    const tokenType = decoded.type || expectedType;

    if (tokenType === "member") {
      const member = await Member.findById(decoded.id).select("-password");
      if (!member) return res.status(401).json({ message: "Member not found" });
      if (allowedRoles.length && !allowedRoles.includes(member.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.actor = { type: "member", user: member };
      next();
    } else if (tokenType === "superadmin") {
      const superadmin = await SuperAdmin.findById(decoded.id).select("-password");
      if (!superadmin) return res.status(401).json({ message: "Superadmin not found" });
      req.actor = { type: "superadmin", user: superadmin };
      next();
    } else {
      return res.status(401).json({ message: "Invalid token type" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
