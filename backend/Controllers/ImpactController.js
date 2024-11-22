const impact = require('../Models/impact');
const bcrypt = require('bcrypt');
const insertimpact = async (req, res) => {    
    try {
        const newimpact = new impact(req.body); // Pass req.body directly
        await newimpact.save();
        res.status(201).json({ success: true, message: "impact inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting impact",
            error: err.message,
        });
    }
};

  const updateimpact = async (req, res) => {
    const { id, data } = req.body;

    try {
        if (!id || !data) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await impact.updateOne(
            { _id: id },
            { $set: data } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "impact not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "impact updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating impact", error: err.message });
    }
};

const getAllimpact = async (req,res) => {
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

        const result = await impact.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await impact.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting impact"});
     }
}
const getSingleimpact = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await impact.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "impact not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching impact" });
    }
}

const deleteimpact = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await impact.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "impact not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching impact" });
    }
}  
module.exports= {
    insertimpact,
    updateimpact,
    getAllimpact,
    getSingleimpact,
    deleteimpact,
  
}