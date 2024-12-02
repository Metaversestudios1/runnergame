const express =require('express');
const {insertUpdatePackage,getAllPackages}=require("../Controllers/PackageController");
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => { 
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only certain files are allowed!'), false);
    }
  }
});
router.post('/insertUpdatePackage',upload.fields([
    { name: 'file', maxCount: 1 },
  ]),insertUpdatePackage);
router.post('/getAllPackages',getAllPackages)
  

module.exports = router;