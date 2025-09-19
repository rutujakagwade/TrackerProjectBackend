// routes/adminRoutes.js
import { Router } from "express";
import { addMember, getAdminProfile, updateAdminProfile, getMemberProfile,listMembers } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All admin routes require member token & admin role
router.post("/members/add", protect(["admin","user"], "member"), addMember);
router.get("/members", protect(["admin","user"], "member"), listMembers);

router.get("/profile", protect(["admin"], "member"), getAdminProfile);
router.put("/profile", protect(["admin"], "member"), updateAdminProfile);
router.get("/members/:memberId", protect(["admin", "user"], "member"), getMemberProfile);
export default router;
