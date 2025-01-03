const express = require('express');
const router = express.Router();
const PlaneCrash = require('../Models/PlaneCrash'); 
const GameHistory = require('../Models/Aviator/AviatorHistory'); // Import the GameHistory model

const gameLogic = async (io) => {
  let users = {};
  let multiplier = 0;
  let crashPoint = 0;
  let crashRanges = [];

  const fetchCrashRanges = async () => {
    try {
      const ranges = await PlaneCrash.find({ deleted_at: null }).exec();
      crashRanges = ranges.map(range => ({
        range: [parseFloat(range.firstValue), parseFloat(range.secondValue)],
        probability: parseFloat(range.crashPercentage) / 100,
      }));
    } catch (error) {
      console.error('Error fetching crash ranges from database:', error);
    }
  };

  const selectCrashRange = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < crashRanges.length; i++) {
      cumulativeProbability += crashRanges[i].probability;
      if (random <= cumulativeProbability) {
        return crashRanges[i].range;
      }
    }
    return crashRanges[crashRanges.length - 1].range;
  };

  const saveBet = async (userId, betAmount) => {
    users[userId] = { betAmount, hasCashedOut: false };
    console.log(`User ${userId} placed a bet of $${betAmount}`);
  };

  const calculateGameResults = () => {
    let totalBet = 0;
    let totalWinningAmount = 0;
    let userResults = [];

    for (let userId in users) {
      const user = users[userId];
      if (user.betAmount > 0) {
        totalBet += user.betAmount;
        
        let winnings = user.hasCashedOut ? user.betAmount * multiplier : 0;
        totalWinningAmount += winnings;

        userResults.push({ userId, betAmount: user.betAmount, winnings });
      }
    }

    const adminProfit = totalBet - totalWinningAmount;
    return { totalBet, totalWinningAmount, adminProfit, userResults };
  };

  const saveGameHistory = async (gameResults) => {
    try {
      const newHistory = new GameHistory({
        users: gameResults.userResults,
        totalBet: gameResults.totalBet,
        adminProfit: gameResults.adminProfit,
        totalWinningAmount: gameResults.totalWinningAmount,
      });
      await newHistory.save();
      console.log('Game history saved successfully');
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };

  const startGame = async () => {
    console.log('Game started');
    await fetchCrashRanges();

    if (crashRanges.length === 0) {
      console.log('No crash ranges available, cannot start game.');
      return;
    }

    const crashRange = selectCrashRange();
    crashPoint = Math.random() * (4 - 1) + 1;
    console.log(`Crash point set at: ${crashPoint.toFixed(2)}x`);

    multiplier = 1;
    io.emit('multiplier_reset', { multiplier: 0 });
    io.emit('betting_open', { isBettingOpen: true });
    console.log('Betting is now open.');

    setTimeout(() => {
      io.emit('betting_close', { isBettingOpen: false });
      console.log('Betting closed. Game is starting.');

      let gameInterval = setInterval(() => {
        multiplier += 0.01;
        io.emit('multiplier_update', { multiplier: multiplier.toFixed(2) });

        if (multiplier >= crashPoint) {
          clearInterval(gameInterval);
          io.emit('plane_crash', { crashPoint: crashPoint.toFixed(2) });

          const gameResults = calculateGameResults();
          saveGameHistory(gameResults);

          setTimeout(() => {
            startGame();
          }, 5000);
        }
      }, 80);
    }, 5000);
  };

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    users[socket.id] = { betAmount: 0, hasCashedOut: false };

    socket.on('place_bet', (betAmount) => {
      if (multiplier === 1) { // Only allow bets before the multiplier starts
        saveBet(socket.id, betAmount);
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

  await startGame();
};

module.exports = {
  gameLogic
};
