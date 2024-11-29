const express =require('express');
const {  items,insertitem,deleteItems}=require("../Controllers/ShopItemsController");
const router = express.Router();

router.post('/admin/shop/items', insertitem);
router.delete('/admin/shop/items/:id', deleteItems);
router.get('/shop/items', items);

module.exports = router;