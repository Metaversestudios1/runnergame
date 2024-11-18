const Collectible = require('../Models/Collectible');
const bcrypt = require('bcrypt');
const insertCollectible = async (req, res) => {    
    try {
        const newCollectible = new Collectible(req.body); // Pass req.body directly
        await newCollectible.save();
        res.status(201).json({ success: true, message: "Collectible inserted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error inserting Collectible",
            error: err.message,
        });
    }
};

  const updateCollectible = async (req, res) => {
    const { id, oldData } = req.body;

    try {
        if (!id || !oldData) {
            return res.status(400).json({ success: false, message: "ID and update data are required" });
        }

        const result = await Collectible.updateOne(
            { _id: id },
            { $set: oldData } // Ensure oldData contains only fields to be updated
        );

        if (result.nModified === 0) {
            return res.status(404).json({ success: false, message: "Collectible not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "Collectible updated successfully", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating Collectible", error: err.message });
    }
};

const getAllCollectible = async (req,res) => {
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

        const result = await Collectible.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Collectible.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting Collectible"});
     }
}
const getSingleCollectible = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await Collectible.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "Collectible not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Collectible" });
    }
}

const deleteCollectible = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Collectible.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "Collectible not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Collectible" });
    }
}  
module.exports= {
    insertCollectible,
    updateCollectible,
    getAllCollectible,
    getSingleCollectible,
    deleteCollectible,
  
}