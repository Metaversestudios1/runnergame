const mongoose = require("mongoose");

const LeadBoardSchma = new mongoose.Schema(
  {
    user_id: { type: String },
    username: { type: String },
    totalcoinwin: { type: Number },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "leadboard",
  }
);

module.exports = mongoose.model("LeadBoard", LeadBoardSchma);
