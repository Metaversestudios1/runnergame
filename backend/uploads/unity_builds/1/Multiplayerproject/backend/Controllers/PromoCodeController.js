const PromoCode = require("../Models/PromoCode");

const getsetting = async(req,res)=>{
   try {
         const result = await PromoCode.find(); // Update the first document found
        if (!result) {
            return res.status(404).json({ success: false, message: "No files present" });
        }

        res.status(200).json({ success: true, result: result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error in get setting", error: err.message });
    }
  }
const updatesetting = async(req,res)=>{
   try {
         const result = await PromoCode.updateOne({ $set: req.body }); // Update the first document found
        if (!result) {
            return res.status(404).json({ success: false, message: "No changes made to the setting." });
        }

        res.status(200).json({ success: true, result: result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error in updating the setting", error: err.message });
    }
  }
  const insertsetting = async (req, res) => {    
    try {
        const promoCode = new PromoCode({...req.body});
        await promoCode.save();
        res.status(201).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, message: "Error inserting setting", error: err.message });
    }
  };

module.exports= {
    updatesetting,  
    getsetting,
    insertsetting
}