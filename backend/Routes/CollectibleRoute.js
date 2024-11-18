const {  insertCollectible,
    updateCollectible,
    getAllCollectible,
    getSingleCollectible,
    deleteCollectible,} = require('../Controllers/CollectibleController');
const express = require('express')
const router = express.Router();
router.post('/insertCollectible',insertCollectible);
router.put('/updateCollectible',updateCollectible);
router.post('/getSingleCollectible',getSingleCollectible);
router.get('/getAllCollectible',getAllCollectible);
router.delete('/deleteCollectible',deleteCollectible);

module.exports =router;