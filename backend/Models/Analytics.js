const mongoose = require("mongoose");
const AnalyticsSchema = new mongoose.Schema(
    {
      analyticsId: {
        type: Number,
        autoIncrement: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
       },
      level: {
        type: String,
      },
      timeSpent: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
      coinsCollected: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true, collection: "analytics" }
  );
  
  module.exports = mongoose.model("Analytics", AnalyticsSchema);
  