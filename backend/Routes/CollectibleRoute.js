const {  insertCollectible,
    updateCollectible,
    getAllCollectible,
    getSingleCollectible,
    deleteCollectible,} = require('../Controllers/CollectibleController');
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
  
router.post('/insertCollectible', upload.fields([{ name: 'photo', maxCount: 1 }]),insertCollectible);
router.put('/updateCollectible', upload.fields([{ name: 'photo', maxCount: 1 }]),updateCollectible);
router.post('/getSingleCollectible',getSingleCollectible);
router.get('/getAllCollectible',getAllCollectible);
router.delete('/deleteCollectible',deleteCollectible);

module.exports =router;