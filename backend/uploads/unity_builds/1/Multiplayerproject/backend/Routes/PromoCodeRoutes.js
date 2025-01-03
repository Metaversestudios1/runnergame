const { updatesetting, getsetting ,insertsetting} = require('../Controllers/PromoCodeController');
const express = require('express')
const router = express.Router();

router.put('/updatePromoCodesetting',updatesetting);
router.get('/getPromoCodeSetting',getsetting);
router.post('/insertPromoCodesetting',insertsetting);

module.exports =router;