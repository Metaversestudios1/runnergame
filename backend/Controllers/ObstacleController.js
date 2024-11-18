
const obstacles = require('../Models/Obstacle');
const bcrypt = require('bcrypt');
const insertobstacles = async (req, res) => {    
    try {
        const newobstacles = new obstacles(req.body); // Pass req.body directly
        await newobstacles.save();
        res.status(201).json({ success: true, message: "obstacles inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting obstacles",
            error: err.message,
        });
    }
};

  const updateobstacles = async (req, res) => {
    const { id, oldData } = req.body;

    try {
        if (!id || !oldData) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await obstacles.updateOne(
            { _id: id },
            { $set: oldData } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "obstacles not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "obstacles updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating obstacles", error: err.message });
    }
};

const getAllobstacles = async (req,res) => {
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

        const result = await obstacles.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await obstacles.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting obstacles"});
     }
}
const getSingleobstacles = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await obstacles.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "obstacles not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching obstacles" });
    }
}

const deleteobstacles = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await obstacles.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "obstacles not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching obstacles" });
    }
}  
module.exports= {
    insertobstacles,
    updateobstacles,
    getAllobstacles,
    getSingleobstacles,
    deleteobstacles,
}