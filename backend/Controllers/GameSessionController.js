const gamesession = require('../Models/gamesession');
const bcrypt = require('bcrypt');
const insertgamesession = async (req, res) => {    
    try {
        const newgamesession = new gamesession(req.body); // Pass req.body directly
        await newgamesession.save();
        res.status(201).json({ success: true, message: "gamesession inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting gamesession",
            error: err.message,
        });
    }
};

  const updategamesession = async (req, res) => {
    const { id, oldData } = req.body;

    try {
        if (!id || !oldData) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await gamesession.updateOne(
            { _id: id },
            { $set: oldData } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "gamesession not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "gamesession updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating gamesession", error: err.message });
    }
};

const getAllgamesession = async (req,res) => {
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

        const result = await gamesession.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await gamesession.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting gamesession"});
     }
}
const getSinglegamesession = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await gamesession.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "gamesession not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching gamesession" });
    }
}

const deletegamesession = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await gamesession.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "gamesession not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching gamesession" });
    }
}  
module.exports= {
    insertgamesession,
    updategamesession,
    getAllgamesession,
    getSinglegamesession,
    deletegamesession,
  
}