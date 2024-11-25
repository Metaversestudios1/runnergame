const express =require('express');
const {  items}=require("../Controllers/ShopItemsController");
const router = express.Router();

router.get('/shop/items', items);

module.exports = router;