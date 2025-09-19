// controllers/journeyController.js
import Journey from "../models/Journey.js"

// Create a journey
export const createJourney = async (req, res) => {
  try {
    const journey = await Journey.create({
      ...req.body,
      user: req.actor.user._id, // ✅ expects user from req.actor
    });
    res.status(201).json(journey);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all journeys for logged-in user
export const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.actor.user._id }); // ✅ fixed
    res.json(journeys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update journey status or mark success
export const updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findOneAndUpdate(
      { _id: req.params.id, user: req.actor.user._id }, // ✅ fixed
      req.body,
      { new: true }
    );
    if (!journey) return res.status(404).json({ error: "Journey not found" });
    res.json(journey);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
