const Banner = require("../Models/Banner");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const path = require("path");

const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
      return reject(new Error("MIME type is required and must be a string"));
    }

    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are allowed"));
    }

    const fileExtension = path.extname(originalname);
    const fileNameWithoutExtension = path.basename(originalname, fileExtension);
    const publicId = `${fileNameWithoutExtension}${fileExtension}`; // Include extension in public_id

    const options = {
      resource_type: "image", // Explicitly set the resource type to image
      public_id: publicId, // Set the public_id with extension
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    cloudinary.uploader.upload(
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

const insertBanner = async (req, res) => {
  //const { user_id, username, totalcoinwin } = req.body;
  try {
    let imageData = null;
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      if (!mimetype || typeof mimetype !== "string") {
        console.error("Invalid MIME type:", mimetype);
        return res
          .status(400)
          .json({ success: false, message: "Invalid MIME type" });
      }

      const uploadResult = await uploadImage(buffer, originalname, mimetype);
      if (!uploadResult) {
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      }
      imageData = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        originalname,
        mimetype,
      };
    }
    const newBanner = new Banner({
      imageUrl: imageData,
    });

    // Save the new question to the database
    const result = await newBanner.save();
    if (result) {
      res.status(201).json({
        success: true,
        message: "Banner created successfully",
        data: result,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to insert banner" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error inserting banner",
      error: err.message,
    });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const query = {
      deleted_at: null, // Only fetch banners that are not soft deleted
    };

    const banners = await Banner.find(query).sort({ createdAt: -1 }); // Fetch banners, sorted by creation date
    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    if (banner.deleted_at) {
      return res.status(400).json({
        success: false,
        message: "Banner is already deleted",
      });
    }

    banner.deleted_at = new Date();
    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner soft deleted successfully",
    });
  } catch (error) {
    console.error("Error soft deleting banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to soft delete banner",
    });
  }
};

module.exports = {
  insertBanner,
  getAllBanners,
  deleteBanner,
};
