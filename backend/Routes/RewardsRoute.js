const express =require('express');
const {  claim}=require("../Controllers/RewardsController");
const router = express.Router();

router.post('/rewards/claim',claim);

module.exports = router;