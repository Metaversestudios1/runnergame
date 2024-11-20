const {  insertimpact,
    updateimpact,
    getAllimpact,
    getSingleimpact,
    deleteimpact,} = require('../Controllers/impactController');
const express = require('express')
const router = express.Router();
router.post('/insertimpact',insertimpact);
router.put('/updateimpact',updateimpact);
router.post('/getSingleimpact',getSingleimpact);
router.get('/getAllimpact',getAllimpact);
router.delete('/deleteimpact',deleteimpact);

module.exports =router;