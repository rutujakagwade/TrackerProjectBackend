// routes/superadminRoutes.js
import { Router } from "express";
import { createSuperAdmin, loginSuperAdmin, inviteAdmin } from "../controllers/superadminController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Create superadmin - call once (or seed via env)
router.post("/create", createSuperAdmin);

// Superadmin login
router.post("/login", loginSuperAdmin);

// Superadmin invites admin
router.post("/invite-admin", protect([], "superadmin"), inviteAdmin);

export default router;
