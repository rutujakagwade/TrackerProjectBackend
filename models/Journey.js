import mongoose from "mongoose";

const journeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  status: String,
  purpose: String,
  startLocation: {
    latitude: Number,
    longitude: Number,
  },
  endLocation: {
    latitude: Number,
    longitude: Number,
  },
  routeCoords: [
    {
      latitude: Number,
      longitude: Number,
    }
  ],
}, { timestamps: true });

// ✅ Export default so controllers can import it
const Journey = mongoose.model("Journey", journeySchema);
export default Journey;
