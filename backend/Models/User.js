const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    user_id: {
      type: String,
    },
    contact: { type: String },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    current_level: {
      type: Number,
    },
    current_stats: {
      heart_rate: { type: Number },
      kidney_rate: { type: Number },
      weight: { type: Number },
    },
    achievements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
    ],
    health_history: { type: String },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);
