const mongoose = require("mongoose");

const UserbankSchma = new mongoose.Schema(
  {
    user_id: { type: String },
    bankName: { type: String },
    accountNo: { type: String },
    accountholdername: { type: String },
    ifscCode: { type: String },
    mobileNo: { type: String },
    upiId: { type: String },
    KYCStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    aadharNo: { type: String },
    panNo: { type: String },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "userbankdetails",
  }
);

module.exports = mongoose.model("UserBank", UserbankSchma);
