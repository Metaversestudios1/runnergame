const express = require("express");
const router = express.Router();

const { trackGameplayMetrics } = require("../Controllers/AnalyticsAndMetricsController");

router.post("/analytics/track", trackGameplayMetrics);

module.exports = router;
