const User = require("../Models/User");
const Collectible = require("../Models/Collectible");
const obstacles = require('../Models/Obstacle');

const getusercount = async (req, res) => {
    try {
        const dashboardCount = await User.countDocuments({ deleted_at: null });
        res.status(200).json({ count: dashboardCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const fetchcollectibleCount = async(req, res)=>{
    try{
        const query = {
          deleted_at: null,
        };        
        const sitecount = await Collectible.countDocuments(query);
        res.status(200).json({success:true,count:sitecount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getobstaclescount = async(req, res)=>{
    try{
        const projectcount = await obstacles.countDocuments({ deleted_at: null });
        res.status(200).json({success:true,count:projectcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getrankcount = async(req,res)=>{
    try{
        const agentcount = await Rank.countDocuments({ deleted_at: null });
        res.status(200).json({success:true,count:agentcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const getrankcount5 = async (req, res) => {
    try {
        const agentcount = await Rank.find({ deleted_at: null })
            .sort({ createdAt: -1 }) // Replace 'createdAt' with the actual field you want to sort by
            .limit(5); // Limit the results to the last 5 documents

        res.status(200).json({ success: true, count: agentcount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', err: err.message });
    }
};

module.exports={
    getusercount,
    fetchcollectibleCount,
    getobstaclescount,
    getrankcount,
    getrankcount5,
}
