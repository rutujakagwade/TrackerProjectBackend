import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import balanceRoutes from "./routes/balanceRoutes.js";
import superadminRoutes from "./routes/superadminRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => res.json({ ok: true }));

// Route prefixing
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
