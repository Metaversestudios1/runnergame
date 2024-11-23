const mongoose = require("mongoose");
const RewardsSchema = new mongoose.Schema(
  {
    rewardId: {
      type: Number,
        autoIncrement: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    rewardType: {
      type: String,
      },
    rewardDetails: {
      type: mongoose.Schema.Types.Mixed, // Supports JSON-like data
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "rewards" }
);

module.exports = mongoose.model("Rewards", RewardsSchema);
