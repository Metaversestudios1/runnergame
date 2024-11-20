const Collectible = require('../Models/Collectible');
const bcrypt = require('bcrypt');
const path = require("path");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
   
  const uploadImage = (buffer, originalname, mimetype) => {
    return new Promise((resolve, reject) => {
      if (!mimetype || typeof mimetype !== "string") {
        return reject(new Error("MIME type is required and must be a string"));
      }
  
      if (!mimetype.startsWith("image")) {
        return reject(new Error("Only image files are supported"));
      }
  
      const fileNameWithoutExtension = path.parse(originalname).name; // Parse to remove the extension
      const publicId = `${fileNameWithoutExtension}`;
      const options = {
        resource_type: "image", // Only images are allowed
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
  
      // Direct upload using Cloudinary's upload_stream
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve(result);
      });
  
      // Pipe the buffer to the stream
      const readableBuffer = Buffer.from(buffer);
      require("stream").Readable.from(readableBuffer).pipe(stream);
    });
  };
  
  const insertCollectible = async (req, res) => {
    try {
      // Create a new obstacle instance with the request body
      const newCollectible = new Collectible(req.body);
      // Check if a photo file is provided in the request
      if (req.files && req.files["photo"] && req.files["photo"][0].buffer) {

        console.log("OK")
        const photoFile = req.files["photo"][0];
      
        // Upload the image using your helper function
        const uploadResult = await uploadImage(
          photoFile.buffer,
          photoFile.originalname,
          photoFile.mimetype
        );
     
        // Assign photo details to the Collectible document
        newCollectible.photo = {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: photoFile.originalname,
          mimetype: photoFile.mimetype,
        };
        console.log(newCollectible)
      } else {
        console.log("No photo file provided in the request.");
      }
      // Save the obstacle to the database
      await newCollectible.save();
  
      // Send a success response
      res.status(201).json({
        success: true,
        message: "Collectible inserted successfully",
        data: newCollectible,
      });
    } catch (err) {
       // Send an error response
      res.status(500).json({
        success: false,
        message: "Error inserting collectible",
        error: err.message,
      });
    }
  };
  const updateCollectible = async (req, res) => {
    const { id } = req.body;
    const dataString = req.body.data; // Extract the `data` field as a string
  
    try {
      // Validate ID and data
      if (!id || !dataString) {
        return res.status(400).json({
          success: false,
          message: "ID and update data are required",
        });
      }
  
      // Parse the `data` string into an object
      const updateData = JSON.parse(dataString);
  
      // Check if a photo file exists
      if (req.files && req.files["photo"] && req.files["photo"][0]?.buffer) {
        const photoFile = req.files["photo"][0];
  
        // Upload the image
        const uploadResult = await uploadImage(
          photoFile.buffer,
          photoFile.originalname,
          photoFile.mimetype
        );
  
        // Add photo details to update object
        updateData.photo = {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: photoFile.originalname,
          mimetype: photoFile.mimetype,
        };
      }
  
      // Update the document in the database
      const updatedCollectible = await Collectible.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true, runValidators: true } // Return updated document and validate the schema
      );
  
      console.log(updatedCollectible);
  
      // Check if the document was updated
      if (!updatedCollectible) {
        return res.status(404).json({
          success: false,
          message: "Collectible not found or no changes made",
        });
      }
  
      // Respond with success
      return res.status(200).json({
        success: true,
        message: "Collectible updated successfully",
        result: updatedCollectible,
      });
    } catch (err) {
      // Handle unexpected errors
      console.error("Error updating collectible:", err.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the collectible",
        error: err.message,
      });
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