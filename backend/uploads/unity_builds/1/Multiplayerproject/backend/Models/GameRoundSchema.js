const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundId: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },  // When the game starts
  crashTime: { type: Number, required: true }, // Multiplier at which game crashes (e.g., 2.5x)
  status: { type: String, enum: ['pending', 'started', 'crashed'], default: 'pending' },
});

const GameRound = mongoose.model('GameRound', gameRoundSchema);
