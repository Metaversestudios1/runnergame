const mongoose = require("mongoose");
const LeaderboardSchema = new mongoose.Schema(
  {
    leaderboardId: {
      type: Number,
       autoIncrement: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
     },
    highScore: {
      type: Number,
    },
    rank: {
      type: Number,
    },
  },
  { timestamps: true, collection: "leaderboard" }
);

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
