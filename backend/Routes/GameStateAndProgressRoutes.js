const express = require('express');
const { saveProgress, loadProgress, getInventory } = require('../Controllers/GameStateAndProgressController');
const router = express.Router();

router.post('/game/save-progress', saveProgress);
router.get('/game/:user_id/progress', loadProgress);
router.get('/game/:user_id/inventory', getInventory);

module.exports = router;