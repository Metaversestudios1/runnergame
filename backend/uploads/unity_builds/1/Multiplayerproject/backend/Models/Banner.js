const mongoose = require("mongoose");

const BannerSchma = new mongoose.Schema(
  {
    publicid: { type: String },
    imageUrl: {
      publicId: { type: String },
      url: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", BannerSchma);
