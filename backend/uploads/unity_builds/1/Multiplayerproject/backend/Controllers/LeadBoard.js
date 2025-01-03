const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const Promocode = require("../Models/User");
const LeadBoard = require("../Models/LeadBoard");

const insertleadboard = async (req, res) => {
  const { user_id, username, totalcoinwin } = req.body;
  //console.log(req.body);
  try {
    //console.log("insert user:", req.body);
    if (!user_id || !username || !totalcoinwin) {
      return res.status(401).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingLead = await LeadBoard.findOne({ user_id: user_id });

    if (existingLead) {
      // Update existing lead board fields
      const result = await LeadBoard.updateOne(
        { user_id },
        { $set: { username, totalcoinwin } }
      );
      if (!result) {
        res
          .status(404)
          .json({ success: false, message: "Lead board details not found " });
      }
      res.status(201).json({ success: true, result: result });

      return res.status(200).json({
        success: true,
        message: "Leadboard data updated successfully",
      });
    } else {
      //Inser lead board details
      const newLeadBoard = new LeadBoard({ user_id, username, totalcoinwin });
      await newLeadBoard.save();
      return res.status(201).json({
        success: true,
        message: "Leaderboard data inserted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registration user",
      error: err.message,
    });
  }
};

// const updateleadboard = async (req, res) => {
//   const updatedata = req.body;
//   const id = updatedata.id;
//   try {
//     const result = await User.updateOne(
//       { _id: id },
//       { $set: updatedata.oldData }
//     );
//     if (!result) {
//       res.status(404).json({ success: false, message: "user not found" });
//     }
//     res.status(201).json({ success: true, result: result });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "error in updating the user",
//       error: err.message,
//     });
//   }
// };

const getAllleadboard = async (req, res) => {
  try {
    const query = {
      deleted_at: null,
    };

    const result = await LeadBoard.find(query).sort({ createdAt: -1 });
    const count = await LeadBoard.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in geting leadboard data" });
  }
};
const getSingleLeadboard = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await LeadBoard.findOne({ _id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Lead board details not found" });
    }
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching leadboard details" });
  }
};

const deleteleadboard = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await LeadBoard.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Leadboard details not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching leadboard details" });
  }
};

module.exports = {
  insertleadboard,
  getAllleadboard,
  getSingleLeadboard,
  deleteleadboard,
};
