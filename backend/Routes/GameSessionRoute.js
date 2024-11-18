const {    insertgamesession,
  updategamesession,
  getAllgamesession,
  getSinglegamesession,
  deletegamesession,} = require('../Controllers/GameSessionController');
const express = require('express')
const router = express.Router();
router.post('/insertgamesession',insertgamesession);
router.put('/updategamesession',updategamesession);
router.post('/getSinglegamesession',getSinglegamesession);
router.get('/getAllgamesession',getAllgamesession);
router.delete('/deletegamesession',deletegamesession);

module.exports =router;