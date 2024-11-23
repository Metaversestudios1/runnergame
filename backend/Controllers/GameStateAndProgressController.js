const GameProgress = require("../Models/GameProgress")
const Inventory = require("../Models/Inventory")
const saveProgress = async (req, res) => {
    try {
        const { userId, score, coinsCollected, timePlayed, powerupsUsed } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Create and save game progress
        const progress = new GameProgress({
            userId,
            score,
            coinsCollected,
            timePlayed,
            powerupsUsed,
        });

        await progress.save();

        return res.status(201).json({ message: "Game progress saved successfully", progress });
    } catch (error) {
        console.error("Error saving progress:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const loadProgress = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch the latest progress for the user
        const progress = await GameProgress.findOne({ userId: user_id }).sort({ lastPlayed: -1 });

        if (!progress) {
            return res.status(404).json({ error: "No progress found for this user" });
        }

        return res.status(200).json({ progress });
    } catch (error) {
        console.error("Error loading progress:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getInventory = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch inventory items for the user
        const inventory = await Inventory.find({ userId: user_id }).populate('itemId', 'name description price');

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ error: "No inventory found for this user" });
        }

        return res.status(200).json({ inventory });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = { saveProgress, loadProgress, getInventory };