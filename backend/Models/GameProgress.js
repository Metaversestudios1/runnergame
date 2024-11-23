const mongoose = require("mongoose");

const GameProgressSchema = new mongoose.Schema(
  {
    progressId: {
      type: Number,
       autoIncrement: true, // Requires a counter mechanism for MongoDB
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
    },
    score: {
      type: Number,
      default: 0,
    },
    coinsCollected: {
      type: Number,
      default: 0,
    },
    timePlayed: {
      type: Number, // Using Number for float values
      default: 0,
    },
    powerupsUsed: {
      type: [String], // Array of strings for JSON equivalent
      default: [],
    },
    lastPlayed: {
      type: Date,
      default: Date.now, // Equivalent to Sequelize.NOW
    },
  },
  { 
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    collection: "gameProgress",
  }
);

module.exports = mongoose.model("GameProgress", GameProgressSchema);
