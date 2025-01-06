// /api/PackageRoutes.js

// Vercel API route configuration to increase the size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2gb', // Allow file size up to 2GB
    },
  },
};

import { insertUpdatePackage, getAllPackages, getActivePackage, deletePackage } from "../Controllers/PackageController";
import multer from "multer";
import express from "express";

const router = express.Router();

// Set up multer for file uploads with memory storage
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only certain files are allowed!"), false);
    }
  },
});

// Route handler for inserting/updating a package with file upload
router.post("/insertUpdatePackage", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }
    insertUpdatePackage(req, res); // Call the controller function
  });
});

// Route handler for fetching all packages
router.get("/getAllPackages", (req, res) => {
  getAllPackages(req, res);
});

// Route handler for fetching the active package
router.get("/active-package", (req, res) => {
  getActivePackage(req, res);
});

// Route handler for deleting a package
router.delete("/deletePackage", (req, res) => {
  deletePackage(req, res);
});

export default router;
