const achievement = require('../Models/achievement');
const bcrypt = require('bcrypt');
const insertachievement = async (req, res) => {    
    try {
        const newachievement = new achievement(req.body); // Pass req.body directly
        await newachievement.save();
        res.status(201).json({ success: true, message: "achievement inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting achievement",
            error: err.message,
        });
    }
};

  const updateachievement = async (req, res) => {
    const { id, oldData } = req.body;

    try {
        if (!id || !oldData) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await achievement.updateOne(
            { _id: id },
            { $set: oldData } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "achievement not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "achievement updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating achievement", error: err.message });
    }
};

const getAllachievement = async (req,res) => {
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

        const result = await achievement.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await achievement.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting achievement"});
     }
}
const getSingleachievement = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await achievement.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "achievement not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching achievement" });
    }
}

const deleteachievement = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await achievement.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "achievement not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching achievement" });
    }
}  
module.exports= {
    insertachievement,
    updateachievement,
    getAllachievement,
    getSingleachievement,
    deleteachievement,
  
}