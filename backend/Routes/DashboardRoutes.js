const express = require('express');
const {  getusercount,
    fetchcollectibleCount,
    getobstaclescount,
    getrankcount,
    getrankcount5
} = require("../Controllers/DashBoardController");

const router = express.Router();

router.get('/getusercount', getusercount);
router.get('/fetchcollectibleCount', fetchcollectibleCount);
router.get('/getobstaclescount', getobstaclescount);
router.get('/getrankcount', getrankcount);
router.get('/getrankcount5', getrankcount5);




module.exports = router;

