
const mongoose = require("mongoose");

const ObstacleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  damage: { type: Number, required: true },
  deleted_at: {
    type: Date,
    default: null,
  },
},
  { timestamps: true, collection: "obstacle" }
 );
  
module.exports = mongoose.model("Obstacle", ObstacleSchema);
  