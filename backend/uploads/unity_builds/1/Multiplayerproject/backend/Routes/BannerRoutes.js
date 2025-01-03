const {
  insertBanner,
  getAllBanners,
  deleteBanner,
} = require("../Controllers/BannerController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB for images
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG are allowed."), false);
    }
  },
});

router.post("/insertbanner", upload.single("banner"), insertBanner);
router.get("/getallbanners", getAllBanners);
router.delete("/deletebanner/:id", deleteBanner);

module.exports = router;
