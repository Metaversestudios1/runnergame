const mongoose = require("mongoose");

// Collectible Schema
const CollectibleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["health food", "activity"], required: true },
  benefit: { type: Number, required: true },
  deleted_at: {
    type: Date,
    default: null,
  },
 }, // stat boost or weight reduction
  { timestamps: true, collection: "collectible" }
 );
  
  module.exports = mongoose.model("collectible", CollectibleSchema);
  