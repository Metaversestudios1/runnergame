const { register, login,profile,updateprofile} = require('../Controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/users/register',register);
router.post('/users/login',login);
router.get('/users/:id/profile',profile);
router.put('/users/:id/updateprofile',updateprofile);


module.exports=router;
