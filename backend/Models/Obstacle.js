
const mongoose = require("mongoose");

const ObstacleSchema = new mongoose.Schema({
  name: { type: String},
  type: { type: String },
  damage: { type: Number },
  photo: {
    publicId: { type: String },
    url: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
  },
  deleted_at: {
    type: Date,
    default: null,
  },
},
  { timestamps: true, collection: "obstacle" }
 );
  
module.exports = mongoose.model("Obstacle", ObstacleSchema);
  