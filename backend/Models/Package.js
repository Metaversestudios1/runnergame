const mongoose =require('mongoose')

const PackageSchema = new mongoose.Schema({
    file: {
        publicId: { type: String },
        url: { type: String },
        originalname: { type: String },
        mimetype: { type: String },
      },
    description: {
        type: String, // Optional description provided by the user
    },
    size: {
        type: String, // File size in bytes
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'deleted'], // Status of the package
        default: 'active',
    },
    previousFile: {
        file: {
          publicId: { type: String }, // Public ID of the previous file
          url: { type: String },      // File URL of the previous file
          originalname: { type: String }, // Original file name of the previous file
          mimetype: { type: String },     // MIME type of the previous file
        },
        expiresAt: {
          type: Date, // Expiration date of the previous file
        },
      },
      
} ,{ timestamps: true, collection: "package" });

module.exports= mongoose.model("Package",PackageSchema);