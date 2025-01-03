const {
  insertleadboard,
  getAllleadboard,
  getSingleLeadboard,
  deleteleadboard,
} = require("../Controllers/LeadBoard");
const express = require("express");
const router = express.Router();

router.post("/insertleadboard", insertleadboard);

router.get("/getallleadboard", getAllleadboard);
router.post("/getsingleleadboard", getSingleLeadboard);
router.delete("/deleteleadboard", deleteleadboard);
module.exports = router;
