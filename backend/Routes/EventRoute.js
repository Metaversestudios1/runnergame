const { insertEvent,
    updateEvent,
    getAllEvent,
    getSingleEvent,
    deleteEvent,getUpcomingEvents,sendNotification} = require('../Controllers/EventController');
const express = require('express');
const router = express.Router();

router.post('/insertEvent',insertEvent);
router.put('/updateEvent',updateEvent);
router.get('/getAllEvent',getAllEvent);
router.post('/getSingleEvent',getSingleEvent);
router.delete('/deleteEvent',deleteEvent);
router.get("/events/upcoming", getUpcomingEvents);
router.post("/notifications/send", sendNotification);


module.exports=router;
