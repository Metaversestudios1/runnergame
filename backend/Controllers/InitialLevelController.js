const initiallevel = require('../Models/Initiallevel');
const bcrypt = require('bcrypt');
const insertinitiallevel = async (req, res) => {    
    try {
        const newinitiallevel = new initiallevel(req.body); // Pass req.body directly
        await newinitiallevel.save();
        res.status(201).json({ success: true, message: "initiallevel inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting initiallevel",
            error: err.message,
        });
    }
};

  const updateinitiallevel = async (req, res) => {
    const { id, data } = req.body;
console.log(req.body)
    try {
        if (!id || !data) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await initiallevel.updateOne(
            { _id: id },
            { $set: data } // Ensure oldData contains only fields to be updated
        );
console.log(result)
        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "initiallevel not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "initiallevel updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating initiallevel", error: err.message });
    }
};

const getAllinitiallevel = async (req,res) => {
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

        const result = await initiallevel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await initiallevel.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting initiallevel"});
     }
}
const getSingleinitiallevel = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await initiallevel.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "initiallevel not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching initiallevel" });
    }
}

const deleteinitiallevel = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await initiallevel.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "initiallevel not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching initiallevel" });
    }
}  
module.exports= {
    insertinitiallevel,
    updateinitiallevel,
    getAllinitiallevel,
    getSingleinitiallevel,
    deleteinitiallevel,
  
}