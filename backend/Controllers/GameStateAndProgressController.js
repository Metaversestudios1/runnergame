// const GameProgress = require("../Models/GameProgress");
// const Inventory = require("../Models/Inventory");
const saveProgress = async (req, res) => {
  // try {
  //   const { userId, score, coinsCollected, timePlayed, powerupsUsed } =
  //     req.body;

  //   if (!userId) {
  //     return res.status(400).json({ error: "User ID is required" });
  //   }

  //   // Fetch the last inserted record to get the highest progressId
  //   const lastProgress = await GameProgress.findOne()
  //     .sort({ progressId: -1 })
  //     .lean();

  //   // Increment the progressId based on the last record
  //   const newProgressId = lastProgress ? lastProgress.progressId + 1 : 1;

  //   // Create and save the new game progress
  //   const progress = new GameProgress({
  //     progressId: newProgressId, // Incremented progressId
  //     userId,
  //     score,
  //     coinsCollected,
  //     timePlayed,
  //     powerupsUsed,
  //   });

  //   await progress.save();

  //   return res
  //     .status(201)
  //     .json({ message: "Game progress saved successfully", progress });
  // } catch (error) {
  //   console.error("Error saving progress:", error);
  //   return res.status(500).json({ error: "Internal server error" });
  // }
};
const loadProgress = async (req, res) => {
  // try {
  //   const { user_id } = req.params;

  //   if (!user_id) {
  //     return res.status(400).json({ error: "User ID is required" });
  //   }

  //   // Fetch all progress records for the user, sorted by lastPlayed in descending order
  //   const progresses = await GameProgress.find({ userId: user_id }).sort({
  //     lastPlayed: -1,
  //   });

  //   if (!progresses || progresses.length === 0) {
  //     return res.status(404).json({ error: "No progress found for this user" });
  //   }

  //   return res.status(200).json({ progresses }); // Return all progresses as an array
  // } catch (error) {
  //   console.error("Error loading progress:", error);
  //   return res.status(500).json({ error: "Internal server error" });
  // }
};

const getInventory = async (req, res) => {
  // try {
  //   const { user_id } = req.params;

  //   // Validate user_id
  //   if (!user_id) {
  //     return res.status(400).json({ error: "User ID is required" });
  //   }
  //   if (!mongoose.Types.ObjectId.isValid(user_id)) {
  //     return res.status(400).json({ error: "Invalid User ID format" });
  //   }

  //   // Fetch inventory items for the user
  //   const inventory = await Inventory.find({ userId: user_id }).populate(
  //     "itemId", // Populate item details from the ShopItem model
  //     "name description price" // Select specific fields to return
  //   );

  //   if (!inventory || inventory.length === 0) {
  //     return res.status(404).json({ error: "No inventory found for this user" });
  //   }

  //   // Return the inventory
  //   return res.status(200).json({ inventory });
  // } catch (error) {
  //   console.error("Error fetching inventory:", error);
  //   return res.status(500).json({ error: "Internal server error" });
  // }
};
module.exports = { saveProgress, loadProgress, getInventory };
