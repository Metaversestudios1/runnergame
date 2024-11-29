const Analytics = require("../Models/Analytics");

// Track Gameplay Metrics
const trackGameplayMetrics = async (req, res) => {
  try {
    const { userId, level, timeSpent, score, coinsCollected } = req.body;

    if (!userId || !level) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and level are required" });
    }

    const lastAnalytic = await Analytics.findOne()
      .sort({ analyticsId: -1 })
      .lean();

    // Increment the progressId based on the last record
    const newAnalyticsId = lastAnalytic ? lastAnalytic.analyticsId + 1 : 1;

    const analyticsEntry = new Analytics({
      analyticsId: newAnalyticsId,
      userId,
      level,
      timeSpent,
      score,
      coinsCollected,
    });

    await analyticsEntry.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Gameplay metrics tracked successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to track gameplay metrics",
        error,
      });
  }
};

module.exports = {
  trackGameplayMetrics,
};
