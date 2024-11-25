const { insertEvent,
    updateEvent,
    getAllEvent,
    getSingleEvent,
    deleteEvent,} = require('../Controllers/EventController');
const express = require('express');
const router = express.Router();

router.post('insertEvent',insertEvent);
router.put('updateEvent',updateEvent);
router.get('getAllEvent',getAllEvent);
router.post('getSingleEvent',getSingleEvent);
router.delete('deleteEvent',deleteEvent);


module.exports=router;
