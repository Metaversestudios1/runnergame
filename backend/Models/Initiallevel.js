const mongoose = require("mongoose");

const InitialLevelSchema = new mongoose.Schema({
  level_number: { type: Number, required: true },
  starting_stats: {
    initial_heart_rate: { type: Number },
    initial_kidney_rate: { type: Number },
    initial_sugar_level:{ type: String },
    initial_weight: { type: Number },
  },
  deleted_at: {
    type: Date,
    default: null,
  },
},
{ timestamps: true, collection: "initiallevel" }
);

module.exports = mongoose.model("Initiallevel", InitialLevelSchema);
