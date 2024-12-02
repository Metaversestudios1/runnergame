const { register, login,profile,updateprofile,deleteUser} = require('../Controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/users/register',register);
router.post('/users/login',login);
router.post('/users/:id',profile);
router.put('/users/:id',updateprofile);
router.delete('/users/:id',deleteUser);



module.exports=router;
