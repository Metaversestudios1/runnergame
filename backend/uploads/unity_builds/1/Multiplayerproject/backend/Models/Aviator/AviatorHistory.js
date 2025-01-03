// Models/GameHistory.js

const mongoose = require('mongoose');

const aviatorHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  users: [{ userId: String, betAmount: Number, winnings: Number }],
  totalBet: { type: Number, required: true },
  adminProfit: { type: Number, required: true },
  totalWinningAmount: { type: Number, required: true },
} ,{ timestamps: true, collection: "AviatorHistory" });

module.exports = mongoose.model('AviatorHistory', aviatorHistorySchema);
