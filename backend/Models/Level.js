const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  level_number: { type: Number, required: true },
  environment: { type: String },
  objectives: { type: [String] },
  story_trigger: { type: String },
  starting_stats: {
    heart_rate: { type: Number },
    kidney_rate: { type: Number },
    suger_level:{ type: Number },
    weight: { type: Number },
  },
  obstacles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Obstacle" }],
  collectibles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collectible" }],
},
{ timestamps: true, collection: "level" }
);

module.exports = mongoose.model("level", LevelSchema);
