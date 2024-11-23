const mongoose = require("mongoose");
const ShopItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: Number,
      autoIncrement: true,
    },
    name: {
      type: String,
     },
    description: {
      type: String,
    },
    price: {
      type: Number,
     },
    currency: {
      type: String,
      default: "coins",
    },
    type: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "shopItems" }
);

module.exports = mongoose.model("ShopItem", ShopItemSchema);
