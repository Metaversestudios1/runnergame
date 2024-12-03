const Package = require("../Models/Package");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
require("dotenv").config();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDocument = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
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
    const publicId = `${fileNameWithoutExtension}${fileExtension}`;

    const options = {
      resource_type: resourceType,
      public_id: publicId,
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
        resolve(result);
      }
    );
  });
};

// const insertUpdatePackage = async (req, res) => {
//   try {
//     console.log(req.files);
//     if (!req.files || !req.files["file"] || !req.files["file"][0]) {
//       return res.status(400).json({
//         success: false,
//         message: "No file provided",
//       });
//     }

//     const documentFile = req.files["file"][0];
//     const { description } = req.body; // Optional description
//     const fileBuffer = documentFile.buffer;
//     const originalname = documentFile.originalname.toLowerCase();
//     const mimetype = documentFile.mimetype;
//     const fileSize = documentFile.size; // File size in bytes

//     if (!fileBuffer) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid file data",
//       });
//     }

//     // Upload new package to Cloudinary
//     const uploadResult = await uploadDocument(fileBuffer, originalname, mimetype);
//     document = {
//         publicId: uploadResult.public_id,
//         url: uploadResult.secure_url,
//         originalname: documentFile.originalname,
//         mimetype: documentFile.mimetype,
//       };
//     // Check if a package with the same name exists
//     const existingPackage = await Package.findOne();
//     console.log(existingPackage);

//     if (existingPackage) {
//       // Mark the existing package as expired and set expiration date
//       existingPackage.previousFile = {
//         file: existingPackage.filePath, // Store the current file path in previousFile
//         expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
//         size: existingPackage.size, // Optional: retain size of the previous file
//       };

//       await existingPackage.save();
//     }
//     // Save the new package details to the database
//     const newPackage = new Package({
//       name: originalname,
//       file: document,
//       description: description || undefined,
//       size: fileSize,
//       status: 'active',
//       expiresAt: null, // New packages have no expiration
//     });

//     await newPackage.save();

//     res.status(201).json({
//       success: true,
//       message: "Package uploaded successfully",
//       data: {
//         name: newPackage.name,
//         filePath: newPackage.filePath,
//         size: newPackage.size,
//         description: newPackage.description,
//       },
//     });
//   } catch (error) {
//     console.error("Error in insertUpdatePackage:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error uploading package",
//       error: error.message,
//     });
//   }
// };
const convertFileSize = (sizeInBytes) => {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (sizeInBytes < kb) {
    return `${sizeInBytes} B`; // In bytes
  } else if (sizeInBytes < mb) {
    return `${(sizeInBytes / kb).toFixed(2)} KB`; // Convert to KB
  } else if (sizeInBytes < gb) {
    return `${(sizeInBytes / mb).toFixed(2)} MB`; // Convert to MB
  } else {
    return `${(sizeInBytes / gb).toFixed(2)} GB`; // Convert to GB
  }
};

const insertUpdatePackage = async (req, res) => {
  try {
    console.log(req.files);

    // Check if the file is provided
    if (!req.files || !req.files["file"] || !req.files["file"][0]) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const documentFile = req.files["file"][0];
    const { description } = req.body; // Optional description
    const fileBuffer = documentFile.buffer;
    const originalname = documentFile.originalname.toLowerCase();
    const mimetype = documentFile.mimetype;
    const fileSize = documentFile.size; // File size in bytes

    if (!fileBuffer) {
      return res.status(400).json({
        success: false,
        message: "Invalid file data",
      });
    }
    const fileSizeFormatted = convertFileSize(fileSize);

    // Upload the new file to Cloudinary
    const uploadResult = await uploadDocument(
      fileBuffer,
      originalname,
      mimetype
    );

    const newFile = {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      originalname: originalname,
      mimetype: mimetype,
    };

    // Check if a package already exists
    const existingPackage = await Package.findOne({ status: "active" });

    if (existingPackage) {
      // Update the existing package as "deleted" and set its expiration
      existingPackage.status = "deleted";
      existingPackage.expiresAt = new Date(
        Date.now() + 25 * 24 * 60 * 60 * 1000
      );
      await existingPackage.save();
    }

    // Insert the new package as active
    const newPackage = new Package({
      file: newFile,
      description: description || undefined,
      size: fileSizeFormatted,
      status: "active",
      expiresAt: null, // Active packages have no expiration initially
    });

    await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Package uploaded successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error("Error in insertUpdatePackage:", error.message);
    res.status(500).json({
      success: false,
      message: "Error uploading package",
      error: error.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const currentDate = new Date();

    // Remove expired packages from the database
    await Package.deleteMany({ expiresAt: { $lte: currentDate } });

    // Fetch active and valid packages
    const packages = await Package.find({
      $or: [
        { expiresAt: null }, // Active packages with no expiration
        { expiresAt: { $gt: currentDate } }, // Packages that haven't expired yet
      ],
    }).sort({ createdAt: -1 }); // Sort by creation date in descending order

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

module.exports = { insertUpdatePackage, getAllPackages };
