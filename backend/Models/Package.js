const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    file: {
      publicId: { type: String },
      url: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
    },
    description: {
      type: String, // Optional description provided by the user
    },
    size: {
      type: String, // File size in bytes
    },
    status: {
      type: String,
      enum: ["active", "expired", "deleted"], // Status of the package
      default: "active",
    },
    expiresAt: {
      type: Date, // Expiration date of the previous file
      default: null,
    },
  },
  { timestamps: true, collection: "package" }
);

module.exports = mongoose.model("Package", PackageSchema);
