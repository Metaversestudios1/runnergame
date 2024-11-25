const ShopItems = require("../Models/ShopItem");
const items = async (req, res) => {
    try {
        const items = await ShopItems.find();
        res.status(200).json({success: true,items});
    } catch (err) {
        res.status(500).json({success: false, message: "Error fetching shop items", error: err.message });
    }
};
const insertitem = async (req, res) => {    
    try {       
        const newbet = new Bet(req.body);
        await newbet.save();
        res.status(201).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting bet", error: err.message });
    }
  };

  const deleteItems  = async(req, res)  => {
  
    try {
        // Check if the item exists
        const result = await ShopItems.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Item deleted successfully
        res.status(200).json({ success: true, message: "Item removed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing item", error: error.message });
    }
  
}



module.exports = {
    items,
    insertitem,
    deleteItems
};
