const fs = require("fs");
const path = require("path");
const Package = require("../Models/Package");

const cleanupExpiredPackages = async () => {
  try {
    const now = new Date();

    // Find all expired packages
    const expiredPackages = await Package.find({ expiresAt: { $lte: now } });

    for (const pkg of expiredPackages) {
      // Delete files from the file system
      const packagePath = pkg.uploadPath;
      if (fs.existsSync(packagePath)) {
        fs.rmdirSync(packagePath, { recursive: true });
        console.log(`Deleted package files: ${packagePath}`);
      }

      // Remove from database
      await UnityPackage.findByIdAndDelete(pkg._id);
      console.log(`Deleted package record: ${pkg.version}`);
    }
  } catch (error) {
    console.error("Error cleaning up expired packages:", error);
  }
};

module.exports = cleanupExpiredPackages;
