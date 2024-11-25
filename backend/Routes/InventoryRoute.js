const express =require('express');
const { purchase}=require("../Controllers/InventoryController");
const router = express.Router();


router.post('/shop/purchase', purchase);

module.exports = router;