const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      autoIncrement: true, // This will require a counter collection for sequence generation
    },
    username: {
      type: String,
       },
    email: {
      type: String,
     },
    password: {
      type: String,
     },
    highScore: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    achievements: {
      type: Array, // Can store any JSON-like structure
      default: [],
    },
    status: {
      type: Number,
      default: 1, // Equivalent to Tinyint
    },
    createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true, 
    collection: "user" 
  }
);

// Export the schema
module.exports = mongoose.model("user", UserSchema);
