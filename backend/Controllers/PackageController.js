const Package = require("../Models/Package");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const unzipper = require("unzipper");
require("dotenv").config();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Configure the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const insertUpdatePackage = async (req, res) => {
  console.log(req.file);
  if (req.file) {
    console.log("req.file is present");
    const { originalname, buffer, mimetype } = req.file;

    if (!mimetype || typeof mimetype !== "string") {
      console.error("Invalid MIME type:", mimetype);
      return res.status(400).json({ success: false, message: "Invalid MIME type" });
    }

    try {
      const { version, description } = req.body;

      // Upload the package to S3
      const uploadResult = await uploadFileToS3(originalname, buffer);
      if (!uploadResult) {
        return res.status(500).json({ success: false, message: "File upload error" });
      }

      // Save the new package to the database with S3 URL
      const newPackage = new Package({
        version,
        description,
        uploadPath: uploadResult.Location, // Save the S3 file URL
      });

      await newPackage.save();
      res.status(200).json({
        success: true,
        message: "Package uploaded successfully to S3!",
      });
    } catch (error) {
      console.error("Error inserting package:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting package",
        error: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "No file provided in the request",
    });
  }
};

// Function to upload a file to AWS S3
const uploadFileToS3 = async (fileName, fileContent) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Bucket name from .env
    Key: fileName, // File name
    Body: fileContent, // File content (buffer)
    ACL: "public-read", // Optional: Makes the file publicly accessible
    ContentType: "application/octet-stream", // Default content type
  };

  try {
    const command = new PutObjectCommand(params); // Create the command
    const result = await s3.send(command); // Send the command to S3
    console.log("File uploaded successfully:", result);
    return {
      Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`, // Construct the public URL
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    throw new Error("Failed to upload file to S3");
  }
};


// dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const insertUpdatePackage = async (req, res) => {
//   console.log(req.file)
//   if (req.file) {
//     console.log("req.file is present");
//     const { originalname, buffer, mimetype } = req.file;
    
//     if (!mimetype || typeof mimetype !== 'string') {
//       console.error("Invalid MIME type:", mimetype);
//       return res.status(400).json({ success: false, message: "Invalid MIME type" });
//     }

//     try {
//       const { version, description } = req.body;

//       // Ensure the version is unique
//       // const existingPackage = await Package.findOne({ version });
//       // if (existingPackage) {
//       //   return res.status(400).json({ success: false, message: "Version already exists!" });
//       // }

//       // Upload the package to Cloudinary
//       const uploadResult = await uploadImage(buffer, originalname, mimetype);
//       if (!uploadResult) {
//         return res.status(500).json({ success: false, message: "File upload error" });
//       }

//       // Set expiration date for the existing latest package
//       // const currentDate = new Date();
//       // const expirationDate = new Date(currentDate.setDate(currentDate.getDate() + 25));
//       // await Package.findOneAndUpdate(
//       //   { expiresAt: null }, // Find the currently active package
//       //   { expiresAt: expirationDate }, // Set expiration date
//       //   { new: true }
//       // );
      

//       // Save the new package to the database with Cloudinary URL
//       const newPackage = new Package({
//         version,
//         description,
//         uploadPath: uploadResult.secure_url, // Save Cloudinary URL
//         // expiresAt: expirationDate, // Latest package has no expiration
//       });

//       await newPackage.save();
//       res.status(200).json({
//         success: true,
//         message: "Package uploaded successfully to Cloudinary!",
//       });
//     } catch (error) {
//       console.error("Error inserting package:", error.message);
//       res.status(500).json({
//         success: false,
//         message: "Error inserting package",
//         error: error.message,
//       });
//     }
//   } 
// };

// // Function to upload file to Cloudinary
// const uploadImage = (buffer, originalname, mimetype) => {
//   return new Promise((resolve, reject) => {
//     if (!mimetype || typeof mimetype !== 'string') {
//       return reject(new Error("MIME type is required and must be a string"));
//     }

//     let resourceType = "raw"; // Default to 'raw' for non-image/video files

//     if (mimetype.startsWith("image")) {
//       resourceType = "image";
//     } else if (mimetype.startsWith("video")) {
//       resourceType = "video";
//     } else if (mimetype === "application/pdf") {
//       resourceType = "raw"; // Explicitly set PDFs as raw
//     }
//     const fileExtension = path.extname(originalname);
//     const fileNameWithoutExtension = path.basename(originalname, fileExtension);
//     const publicId = `${fileNameWithoutExtension}${fileExtension}`; // Include extension in public_id

//     const options = {
//       resource_type: resourceType,
//       public_id: publicId, // Set the public_id with extension
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//     };

//     const uploadStream = cloudinary.uploader.upload(
//       `data:${mimetype};base64,${buffer.toString("base64")}`,
//       options,
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return reject(new Error("Cloudinary upload failed"));
//         }
//         console.log("Cloudinary upload result:", result);
//         resolve(result);
//       }
//     );
//   });
// };

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
  const { id } = req.body; // Get the ID from the request body
  console.log(id);

  try {
    // Find the package in the database
    const package = await Package.findById(id);

    if (!package) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    // Delete file from AWS S3 if there is a file
    if (package.s3FilePath) {
      const params = {
        Bucket: 'your-s3-bucket-name', // replace with your bucket name
        Key: package.s3FilePath, // the file path/key in S3
      };

      // Delete the file from S3
      await s3.deleteObject(params).promise();
      console.log(`File deleted from S3: ${package.s3FilePath}`);
    }

    // Mark the package as deleted in the database
    const result = await Package.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Package deleted successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting package: ' + err.message });
  }
};

module.exports = { insertUpdatePackage, getAllPackages, getActivePackage ,deletePackage};
