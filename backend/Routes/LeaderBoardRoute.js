const express =require('express');
const {friend,global,updateLeaderboard}=require("../Controllers/LeaderBoardController");
const router = express.Router();

router.get('/leaderboard/friend',friend);
router.get('/leaderboard/global',global);
router.post('/leaderboard/update',updateLeaderboard);
module.exports = router;