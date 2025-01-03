const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      // unique: true,
    },
    uploadPath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // expiresAt: {
    //   type: Date,
    //   default: null, 
    // },
    expiresAt: {
      type: Date,
      default: null,
      index: {
        expireAfterSeconds: 0, // TTL index is applied here
      },
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
