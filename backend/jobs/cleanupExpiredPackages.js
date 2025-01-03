const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2; // Cloudinary SDK
const Package = require("../Models/Package");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cleanupExpiredPackages = async () => {
  try {
    const now = new Date();

    // Find all expired packages
    const expiredPackages = await Package.find({ expiresAt: { $lte: now } });

    for (const pkg of expiredPackages) {
      const packagePath = pkg.uploadPath;

      // Delete files from Cloudinary
      const cloudinaryPublicId = extractPublicIdFromUrl(packagePath);
      try {
        if (cloudinaryPublicId) {
          // Delete from Cloudinary using the public ID
          await cloudinary.uploader.destroy(cloudinaryPublicId);
          console.log(`Deleted package file from Cloudinary: ${packagePath}`);
        } else {
          console.log(`No valid Cloudinary public ID found in URL: ${packagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting Cloudinary file for package ${pkg.version}:`, err);
      }

      // Remove package from the database
      try {
        await Package.findByIdAndDelete(pkg._id);
        console.log(`Deleted package record: ${pkg.version}`);
      } catch (err) {
        console.error(`Error deleting package record ${pkg.version}:`, err);
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired packages:", error);
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  const regex = /\/v\d+\/(.+?)\./; // Match the public ID from the URL
  const match = url.match(regex);
  return match ? match[1] : null;
};

module.exports = cleanupExpiredPackages;
