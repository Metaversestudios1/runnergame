const Rewards = require("../Models/Rewards");


const claim = async (req, res) => {
    const { userId, rewardType, rewardDetails } = req.body;
    try {
        const last = await Rewards.findOne().sort({ rewardId: -1 }); // Sort by userId in descending order
        const rewardId = last.rewardId ? last.rewardId + 1 : 1; //    
        await Rewards.create({ userId, rewardId,rewardType, rewardDetails });
        res.status(201).json({success: true, message: "Reward claimed successfully" });
    } catch (err) {
        res.status(500).json({success: false, message: "Failed to claim reward", error: err.message });
    }
};

module.exports = {
    claim,
};
