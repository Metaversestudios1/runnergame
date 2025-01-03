const express =require('express');
const { getAllaviatorhistory } = require("../../Controllers/Aviator/AviatorHistoryController");
const router = express.Router();

router.get('/getAllaviatorhistory',getAllaviatorhistory);
module.exports = router;