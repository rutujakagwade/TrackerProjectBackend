// routes/authRoutes.js
import { Router } from "express";
import {
  completeRegistration,
  loginMember,
  getMembers,
  getUserProfile,
  updateUserProfile
} from "../controllers/memberController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", completeRegistration); // complete invited registration
router.post("/login", loginMember);

router.get("/", protect(["admin"], "member"), getMembers); // only admin can list members
router.get("/me", protect([], "member"), getUserProfile);
router.put("/me", protect([], "member"), updateUserProfile);

// admin can fetch member profile

export default router;
