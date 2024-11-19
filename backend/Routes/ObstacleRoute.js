const {    insertobstacles,
    updateobstacles,
    getAllobstacles,
    getSingleobstacles,
    deleteobstacles,} = require('../Controllers/ObstacleController');
const express = require('express')
const router = express.Router();
const multer = require('multer');
 
// Configure multer storage and file handling
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
  
router.post('/insertobstacles', upload.fields([{ name: 'photo', maxCount: 1 }]),insertobstacles);
router.put('/updateobstacles', upload.fields([{ name: 'photo', maxCount: 1 }]),updateobstacles);
router.post('/getSingleobstacles',getSingleobstacles);
router.get('/getAllobstacles',getAllobstacles);
router.delete('/deleteobstacles',deleteobstacles);

module.exports =router;