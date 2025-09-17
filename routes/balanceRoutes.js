// routes/balanceRoutes.js
import { Router } from "express";
import { addBalance, getBalance } from "../controllers/balanceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Add balance → only admin or superadmin (superadmin uses its own token)
router.post("/:memberId", protect([], "member"), addBalance);


// Get balance → user can get own balance, admin can get any
router.get("/:memberId", protect([], "member"), getBalance);

export default router;
