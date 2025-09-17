// routes/expenseRoutes.js
import { Router } from "express";
import {
  addExpense,
  getMyExpenses,
  getAllExpenses,
  updateExpenseStatus,
  bulkUpdateStatus
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/fileUpload.js";

const router = Router();

// user adds expense
router.post("/", protect(["user", "admin", "superadmin"]), upload.single("receipt"), addExpense);
// user gets own
router.get("/me", protect([], "member"), getMyExpenses);
// admin gets all (filter by status)
router.get("/", protect(["admin","user"], "member"), getAllExpenses);
router.patch("/bulk/status", protect(["admin"], "member"), bulkUpdateStatus);
// approve/reject single
router.patch("/:id/status", protect(["admin"], "member"), updateExpenseStatus);
// bulk update


export default router;
