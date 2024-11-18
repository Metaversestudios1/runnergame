const {    insertobstacles,
    updateobstacles,
    getAllobstacles,
    getSingleobstacles,
    deleteobstacles,} = require('../Controllers/ObstacleController');
const express = require('express')
const router = express.Router();
router.post('/insertobstacles',insertobstacles);
router.put('/updateobstacles',updateobstacles);
router.post('/getSingleobstacles',getSingleobstacles);
router.get('/getAllobstacles',getAllobstacles);
router.delete('/deleteobstacles',deleteobstacles);

module.exports =router;