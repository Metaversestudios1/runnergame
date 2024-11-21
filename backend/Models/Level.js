const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  user_id: { type: String },
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
  obstacles: [{ type: mongoose.Schema.Types.ObjectId, ref: "obstacle" }],
  collectibles: [{ type: mongoose.Schema.Types.ObjectId, ref: "collectible" }],
  deleted_at: {
    type: Date,
    default: null,
  },
},
{ timestamps: true, collection: "level" }
);

module.exports = mongoose.model("level", LevelSchema);
