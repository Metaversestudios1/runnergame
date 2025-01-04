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
    expiresAt: {
      type: Date,
      default: null, 
    },
  
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
