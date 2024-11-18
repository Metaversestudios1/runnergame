const {  insertlevel,
    updatelevel,
    getAlllevel,
    getSinglelevel,
    deletelevel,} = require('../Controllers/LevelController');
const express = require('express')
const router = express.Router();
router.post('/insertlevel',insertlevel);
router.put('/updatelevel',updatelevel);
router.post('/getSinglelevel',getSinglelevel);
router.get('/getAlllevel',getAlllevel);
router.delete('/deletelevel',deletelevel);

module.exports =router;