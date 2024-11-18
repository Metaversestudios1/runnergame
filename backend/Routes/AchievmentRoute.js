const {    insertachievement,
    updateachievement,
    getAllachievement,
    getSingleachievement,
    deleteachievement,} = require('../Controllers/AchievmentController');
const express = require('express')
const router = express.Router();
router.post('/insertachievement',insertachievement);
router.put('/updateachievement',updateachievement);
router.post('/getSingleachievement',getSingleachievement);
router.get('/getAllachievement',getAllachievement);
router.delete('/deleteachievement',deleteachievement);

module.exports =router;