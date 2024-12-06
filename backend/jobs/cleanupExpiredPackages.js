const fs = require("fs");
const path = require("path");
const Package = require("../Models/Package");
const cleanupExpiredPackages = async () => {
  try {
    const now = new Date();

    // Find all expired packages
    const expiredPackages = await Package.find({ expiresAt: { $lte: now } });

    for (const pkg of expiredPackages) {
      const packagePath = pkg.uploadPath;

      // Delete files from the file system if it exists
      try {
        if (await fs.access(packagePath).then(() => true).catch(() => false)) {
          // If directory exists, remove it recursively
          await fs.rm(packagePath, { recursive: true, force: true });
          console.log(`Deleted package files: ${packagePath}`);
        } else {
          console.log(`No files found at: ${packagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting files for package ${pkg.version}:`, err);
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
module.exports = cleanupExpiredPackages;
