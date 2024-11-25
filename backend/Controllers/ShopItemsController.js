const ShopItems = require("../Models/ShopItem");
const items = async (req, res) => {
    try {
        const items = await ShopItems.find();
        res.status(200).json({success: true,items});
    } catch (err) {
        res.status(500).json({success: false, message: "Error fetching shop items", error: err.message });
    }
};




module.exports = {
    items,
};
