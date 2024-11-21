const mongoose = require("mongoose");

const InitialLevelSchema = new mongoose.Schema({
  level_number: { type: Number, required: true },
  starting_stats: {
    intial_heart_rate: { type: Number },
    intial_kidney_rate: { type: Number },
    intial_suger_level:{ type: Number },
    intial_weight: { type: Number },
  },
  deleted_at: {
    type: Date,
    default: null,
  },
},
{ timestamps: true, collection: "initiallevel" }
);

module.exports = mongoose.model("Initiallevel", InitialLevelSchema);
