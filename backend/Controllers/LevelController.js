const level = require('../Models/level');
const bcrypt = require('bcrypt');
const insertlevel = async (req, res) => {    
    try {
        const newlevel = new level(req.body); // Pass req.body directly
        await newlevel.save();
        res.status(201).json({ success: true, message: "level inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting level",
            error: err.message,
        });
    }
};

  const updatelevel = async (req, res) => {
    const { id, oldData } = req.body;

    try {
        if (!id || !oldData) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await level.updateOne(
            { _id: id },
            { $set: oldData } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "level not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "level updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating level", error: err.message });
    }
};

const getAlllevel = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.type = { $regex: search, $options: "i" };
        }

        const result = await level.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await level.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting level"});
     }
}
const getSinglelevel = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await level.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "level not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching level" });
    }
}

const deletelevel = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await level.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "level not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching level" });
    }
}  
module.exports= {
    insertlevel,
    updatelevel,
    getAlllevel,
    getSinglelevel,
    deletelevel,
  
}