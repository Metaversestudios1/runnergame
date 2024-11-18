// Achievement Schema
const mongoose =require('mongoose')

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  criteria: { type: String },
  deleted_at: {
    type: Date,
    default: null,
  },
}, 
// stat boost or weight reduction
{ timestamps: true, collection: "achievement" }
);

module.exports = mongoose.model("Achievement", AchievementSchema);

