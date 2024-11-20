const mongoose = require("mongoose");

const ImpactSchema = new mongoose.Schema(
  {
  obstacles: [{ type: mongoose.Schema.Types.ObjectId, ref: "obstacle" }],
  collectibles: [{ type: mongoose.Schema.Types.ObjectId, ref: "collectible" }],
    type: {
      type: String,
     // enum: ["healthy", "unhealthy", "power-up"],
    },
    effects: {
      heartHealth: { type: Number },
      kidneyHealth: { type: Number},
      sugarLevel: {
        type: String,
      //  enum: ["increase", "decrease", "neutral"],
        required: true,
      },
      weight: { type: Number },
    },
    visualIndicator: {
         type: String,
        //  enum: ["red", "green"],
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true, collection: "impact" }
);
module.exports = mongoose.model("Impact", ImpactSchema);
