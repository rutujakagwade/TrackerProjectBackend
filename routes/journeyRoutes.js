// routes/journeyRoutes.js
import express from "express";
import {
  createJourney,
  getMyJourneys,
  updateJourney,
} from "../controllers/journeyController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect(["user", "admin"]), createJourney);
router.get("/", protect(["user", "admin"]), getMyJourneys);
router.patch("/:id", protect(["user", "admin"]), updateJourney);

export default router;
