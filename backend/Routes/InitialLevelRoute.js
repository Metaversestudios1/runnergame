const {   insertinitiallevel,
    updateinitiallevel,
    getAllinitiallevel,
    getSingleinitiallevel,
    deleteinitiallevel,} = require('../Controllers/InitialLevelController');
const express = require('express')
const router = express.Router();
router.post('/insertinitiallevel',insertinitiallevel);
router.put('/updateinitiallevel',updateinitiallevel);
router.post('/getSingleinitiallevel',getSingleinitiallevel);
router.get('/getAllinitiallevel',getAllinitiallevel);
router.delete('/deleteinitiallevel',deleteinitiallevel);

module.exports =router;