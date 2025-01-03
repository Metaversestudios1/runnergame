// Controllers/GameController.js

const express = require('express');
const router = express.Router();
const PlaneCrash = require('../Models/PlaneCrash'); 

const gameLogic = async (io) => {
  let users = {}; // Store user data and their bets
  let multiplier = 0; // Starting multiplier
  let crashPoint = 0; // Where the plane crashes
  let crashRanges = []; // Array to store crash ranges from DB

  // Function to fetch crash ranges from the database
  const fetchCrashRanges = async () => {
    try {
      const ranges = await PlaneCrash.find({ deleted_at: null }).exec(); // Fetch active crash ranges
      crashRanges = ranges.map(range => ({
        range: [parseFloat(range.firstValue), parseFloat(range.secondValue)],
        probability: parseFloat(range.crashPercentage) / 100, // Convert percentage to a probability
      }));
    } catch (error) {
      console.error('Error fetching crash ranges from database:', error);
    }
  };

  // Function to select a crash range based on weighted probabilities
  const selectCrashRange = () => {
    const random = Math.random(); // Random number between 0 and 1
    let cumulativeProbability = 0;

    for (let i = 0; i < crashRanges.length; i++) {
      cumulativeProbability += crashRanges[i].probability;
      if (random <= cumulativeProbability) {
        return crashRanges[i].range;
      }
    }

    // Default to the last range if something goes wrong
    return crashRanges[crashRanges.length - 1].range;
  };

  const startGame = async () => {
    console.log('Game started');

         await fetchCrashRanges();

     if (crashRanges.length === 0) {
       console.log('No crash ranges available, cannot start game.');
       return;
     }
 
     // Select crash range based on probability and generate crash point within that range
     const crashRange = selectCrashRange();
    // crashPoint = Math.random() * (crashRange[1] - crashRange[0]) + crashRange[0];
 
    
    // Generate random crash point (e.g., between 1.5x to 4x)
    crashPoint = Math.random() * (4 - 1) + 1;
    console.log(`Crash point set at: ${crashPoint.toFixed(2)}x`);

    multiplier = 1; // Reset multiplier
    io.emit('multiplier_reset', { multiplier: 0 }); // Notify frontend to reset and show bet input

      io.emit('betting_open', { isBettingOpen: true }); // Open betting window for 5 seconds
      console.log('Betting is now open.');

      setTimeout(() => {
        // Close betting and start increasing multiplier
        io.emit('betting_close', { isBettingOpen: false });
        console.log('Betting closed. Game is starting.');

        let gameInterval = setInterval(() => {
          multiplier += 0.01; // Increment multiplier
          console.log(multiplier);
          io.emit('multiplier_update', { multiplier: multiplier.toFixed(2) });

          // If multiplier exceeds crash point, the plane crashes
          if (multiplier >= crashPoint) {
            clearInterval(gameInterval);
            io.emit('plane_crash', { crashPoint: crashPoint.toFixed(2) });
            for (const socketId in users) {
              if (!users[socketId].hasCashedOut && users[socketId].betAmount > 0) {
                  io.to(socketId).emit('bet_lost', {
                      message: `You lost $${users[socketId].betAmount} as the plane crashed at ${crashPoint.toFixed(2)}x.`,
                      crashPoint: crashPoint.toFixed(2)
                  });
                  console.log(`User ${socketId} lost $${users[socketId].betAmount}`);
              }
          }
            // After crash, reset game after 5 seconds
            setTimeout(() => {
              startGame();
            }, 5000); // Delay before starting the next game
          }
        }, 80); // Every 70ms, increase multiplier by 0.01x
      },5000); // 5 seconds for placing bets

  };

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    users[socket.id] = { betAmount: 0, hasCashedOut: false };

    socket.on('place_bet', (betAmount) => {
      if (multiplier === 1) { // Only allow bets before the multiplier starts
        users[socket.id].betAmount = betAmount;
        users[socket.id].hasCashedOut = false;
        console.log(`User ${socket.id} placed a bet of $${betAmount}`);
      }
    });

    socket.on('cash_out', () => {
      if (multiplier > 0 && !users[socket.id].hasCashedOut) {
        const winnings = users[socket.id].betAmount * multiplier;
        io.to(socket.id).emit('cash_out_success', { winnings: winnings.toFixed(2), message: `${multiplier.toFixed(2)}x` });
        users[socket.id].hasCashedOut = true;
        console.log(`User ${socket.id} cashed out with $${winnings.toFixed(2)} at ${multiplier.toFixed(2)}x`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      delete users[socket.id];
    });
  });

  // Start the game
  await startGame();
};

module.exports = {
  gameLogic // Initialize game logic with the Socket.IO instance
 };
