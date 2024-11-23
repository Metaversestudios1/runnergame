
const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    inventoryId: {
      type: Number,
      unique: true, // Equivalent to primary key
      autoIncrement: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // References the User model
      },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopItem", // References the ShopItem model
     },
    quantity: {
      type: Number,
      default: 1,
    },
    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "inventory" }
);

module.exports = mongoose.model("Inventory", InventorySchema);
