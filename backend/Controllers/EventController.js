const Event = require('../Models/Event');
const bcrypt = require('bcrypt');
const insertEvent = async (req, res) => {    
    try {
       
        const newEvent = new Event({...req.body});
        await newEvent.save();
        res.status(201).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting Event", error: err.message });
    }
  };

  const updateEvent = async(req,res)=>{
    const updatedata = req.body;
    const id = updatedata.id;
    try{
        // console.log(updatedata.oldData)
     
        const result = await Event.updateOne(
            {_id:id},
            { $set :updatedata.oldData,
            }
        );
        if(!result){
            res.status(404).json({success:false,message:"Event not found"});
        }
        res.status(201).json({ success: true, result: result });
    }catch(err){
        res.status(500).json({success:false,message:"error in updating the Event",error:err.message});

    }
  }



const getAllEvent = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.Event_level = { $regex: search, $options: "i" };
        }

        const result = await Event.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Event.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting Event"});
     }
}
const getSingleEvent = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await Event.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Event" });
    }
}

const deleteEvent = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Event.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "Event not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Event" });
    }
}  
module.exports= {
    insertEvent,
    updateEvent,
    getAllEvent,
    getSingleEvent,
    deleteEvent,
  
}