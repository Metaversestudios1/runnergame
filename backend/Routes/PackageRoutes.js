const express =require('express');
const {insertUpdatePackage,getAllPackages, getActivePackage,deletePackage}=require("../Controllers/PackageController");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

router.use(express.json({ limit: '1gb' })); // Limit the request body size to 2GB

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: (req, file, cb) => { 
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only certain files are allowed!'), false);
    }
  }
});

// Handle the form submission using multer middleware
router.post('/insertUpdatePackage', upload.single('file'),  insertUpdatePackage);
router.get('/getAllPackages',getAllPackages)
router.get("/active-package", getActivePackage);
router.delete("/deletePackage", deletePackage);

  

module.exports = router;