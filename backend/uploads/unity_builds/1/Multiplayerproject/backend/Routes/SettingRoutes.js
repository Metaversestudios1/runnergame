const {
  updatesetting,
  getsetting,
  insertsetting,
  changegamestatus,
} = require("../Controllers/SettingController");
const express = require("express");
const router = express.Router();

router.put("/updatesetting", updatesetting);
router.get("/getAllSetting", getsetting);
router.post("/insertsetting", insertsetting);
router.put("/changeGameStatus", changegamestatus);

module.exports = router;
