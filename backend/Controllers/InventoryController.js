const Inventory = require("../Models/Inventory");
const User = require("../Models/User");
const ShopItem = require("../Models/ShopItem")
const purchase = async (req, res) => {
    try {
    const { userId, itemId, paymentType } = req.body;

    // Validate request
    if (!userId || !itemId || !paymentType) {
      return res.status(400).json({ message: "User ID, Item ID, and Payment Type are required." });
    }

    if (paymentType !== 'coins' && paymentType !== 'gems') {
      return res.status(400).json({ message: "Invalid payment type. Must be 'coins' or 'gems'." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the item to purchase
    const item = await ShopItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    // Check if the user has enough currency
    const currencyField = paymentType === 'coins' ? 'coins' : 'gems';
    console.log(user[currencyField])
    if (user[currencyField] < item.price) {
      return res.status(400).json({ message: `Not enough ${paymentType}.` });
    }

    // Deduct the currency
    user[currencyField] -= item.price;
    await user.save();

    // Add the item to the user's inventory
    let inventoryItem = await Inventory.findOne({ userId, itemId });
    if (inventoryItem) {
      // If the item already exists in inventory, increase quantity
      inventoryItem.quantity += 1;
    } else {
      // If the item doesn't exist in inventory, create a new inventory entry
      inventoryItem = new Inventory({
        userId,
        itemId,
        quantity: 1,
      });
    }

    await inventoryItem.save();

    // Respond with updated data
    res.status(200).json({
      message: "Purchase successful.",
      updatedInventory: inventoryItem,
      updatedUser: {
        coins: user.coins,
        gems: user.gems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    purchase,
};
