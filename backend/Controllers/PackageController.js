const Package = require("../Models/Package");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const unzipper = require("unzipper");
require("dotenv").config();

dotenv.config();

const insertUpdatePackage = async (req, res) => {
  try {
    const { version, description } = req.body;
    const file = req.files.file;

    // Define storage path
    const uploadPath = path.join(__dirname, "../uploads/unity_builds", version);

    // Ensure version folder doesn't already exist
    if (fs.existsSync(uploadPath)) {
      return res.status(400).json({ message: "Version already exists!" });
    }

    // Set expiration date for the existing latest package
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.setDate(currentDate.getDate() + 25)
    );
    await Package.findOneAndUpdate(
      { expiresAt: null }, // Find the currently active package
      { expiresAt: expirationDate }, // Set expiration date
      { new: true }
    );

    // Create directory
    fs.mkdirSync(uploadPath, { recursive: true });

    // Stream and unzip
    const zipStream = fs.createReadStream(file.tempFilePath);
    const unzipStream = unzipper.Extract({ path: uploadPath });

    zipStream
      .pipe(unzipStream)
      .on("close", async () => {
        if (!fs.existsSync(path.join(uploadPath, "index.html"))) {
          return res
            .status(400)
            .json({ message: "Invalid Unity package structure." });
        }

        // Save the new package to the database
        try {
          const newPackage = new Package({
            version,
            uploadPath,
            description,
            expiresAt: null, // Latest package has no expiration
          });

          await newPackage.save();
          res.status(200).json({success : true,  message: "Package uploaded successfully!" });
        } catch (dbError) {
          console.error("Database error:", dbError);
          return res
            .status(500)
            .json({
              message: "Failed to save package details to the database.",
            });
        }
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ message: "Failed to upload package." });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

// Get Active Unity Package
const getActivePackage = async (req, res) => {
  try {
    const activePackage = await Package.findOne({ expiresAt: null });

    if (!activePackage) {
      return res.status(404).json({ message: "No active package found." });
    }

    // Construct the public URL
    const buildUrl = `http://localhost:8000/uploads/unity_builds/${activePackage.version}/index.html`;

    res.status(200).json({
      build_url: buildUrl,
      version: activePackage.version,
    });
  } catch (error) {
    console.error("Error in getActivePackage:", error);
    res.status(500).json({ message: "Failed to fetch the active package." });
  }
};
const getAllPackages = async (req, res) => {
  try {

    const packages = await Package.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

module.exports = { insertUpdatePackage, getAllPackages, getActivePackage };
