
const mongoose = require("mongoose");

// Collectible Schema
const GameSessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level_number: { type: Number, required: true },
  score: { type: Number },
  completion_status: { type: Boolean, default: false },
  time_taken: { type: Number },
  deleted_at: {
    type: Date,
    default: null,
  },
}, // stat boost or weight reduction
{ timestamps: true, collection: "gamesession" }
);

module.exports = mongoose.model("GameSession", GameSessionSchema);
