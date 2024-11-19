const mongoose = require("mongoose");

// Collectible Schema
const CollectibleSchema = new mongoose.Schema({
  name: { type: String, },
  type: { type: String, },
  benefit: { type: Number},
  photo: {
    publicId: { type: String },
    url: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
  },
  deleted_at: {
    type: Date,
    default: null,
  },
 }, // stat boost or weight reduction
  { timestamps: true, collection: "collectible" }
 );
  
  module.exports = mongoose.model("collectible", CollectibleSchema);
  