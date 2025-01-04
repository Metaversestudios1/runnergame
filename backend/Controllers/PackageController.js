const Package = require("../Models/Package");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const unzipper = require("unzipper");
require("dotenv").config();

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const insertUpdatePackage = async (req, res) => {
  console.log(req.file)
  if (req.file) {
    console.log("req.file is present");
    const { originalname, buffer, mimetype } = req.file;
    
    if (!mimetype || typeof mimetype !== 'string') {
      console.error("Invalid MIME type:", mimetype);
      return res.status(400).json({ success: false, message: "Invalid MIME type" });
    }

    try {
      const { version, description } = req.body;

      // Ensure the version is unique
      // const existingPackage = await Package.findOne({ version });
      // if (existingPackage) {
      //   return res.status(400).json({ success: false, message: "Version already exists!" });
      // }

      // Upload the package to Cloudinary
      const uploadResult = await uploadImage(buffer, originalname, mimetype);
      if (!uploadResult) {
        return res.status(500).json({ success: false, message: "File upload error" });
      }

      // Set expiration date for the existing latest package
      // const currentDate = new Date();
      // const expirationDate = new Date(currentDate.setDate(currentDate.getDate() + 25));
      // await Package.findOneAndUpdate(
      //   { expiresAt: null }, // Find the currently active package
      //   { expiresAt: expirationDate }, // Set expiration date
      //   { new: true }
      // );
      

      // Save the new package to the database with Cloudinary URL
      const newPackage = new Package({
        version,
        description,
        uploadPath: uploadResult.secure_url, // Save Cloudinary URL
        // expiresAt: expirationDate, // Latest package has no expiration
      });

      await newPackage.save();
      res.status(200).json({
        success: true,
        message: "Package uploaded successfully to Cloudinary!",
      });
    } catch (error) {
      console.error("Error inserting package:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting package",
        error: error.message,
      });
    }
  } 
};

// Function to upload file to Cloudinary
const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== 'string') {
      return reject(new Error("MIME type is required and must be a string"));
    }

    let resourceType = "raw"; // Default to 'raw' for non-image/video files

    if (mimetype.startsWith("image")) {
      resourceType = "image";
    } else if (mimetype.startsWith("video")) {
      resourceType = "video";
    } else if (mimetype === "application/pdf") {
      resourceType = "raw"; // Explicitly set PDFs as raw
    }
    const fileExtension = path.extname(originalname);
    const fileNameWithoutExtension = path.basename(originalname, fileExtension);
    const publicId = `${fileNameWithoutExtension}${fileExtension}`; // Include extension in public_id

    const options = {
      resource_type: resourceType,
      public_id: publicId, // Set the public_id with extension
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const uploadStream = cloudinary.uploader.upload(
      `data:${mimetype};base64,${buffer.toString("base64")}`,
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Cloudinary upload failed"));
        }
        console.log("Cloudinary upload result:", result);
        resolve(result);
      }
    );
  });
};

// Get Active Unity Package
const getActivePackage = async (req, res) => {
  try {
    // Find the latest package based on creation time
    const activePackage = await Package.findOne().sort({ createdAt: -1 });

    if (!activePackage) {
      return res.status(404).json({ message: "No package found." });
    }

    // Use the uploadPath field to provide the file URL
    const buildUrl = `${activePackage.uploadPath}/index.html`; // Assuming the build entry point is index.html
    const zipUrl = activePackage.uploadPath; // Direct URL to the ZIP file stored in Cloudinary

    res.status(200).json({
      build_url: buildUrl,
      zip_url: zipUrl, // Provide the Cloudinary URL for the ZIP file
      version: activePackage.version,
    });
  } catch (error) {
    console.error("Error in getActivePackage:", error);
    res.status(500).json({ message: "Failed to fetch the package." });
  }
};

const getAllPackages = async (req, res) => {
  try {

    const packages = await Package.find({  deleted_at: null}).sort({ createdAt: -1 });

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


const deletePackage = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters
console.log(id)
  try {

    const result = await Package.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "package not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating data: " + err.message });
  }
};

module.exports = { insertUpdatePackage, getAllPackages, getActivePackage ,deletePackage};
