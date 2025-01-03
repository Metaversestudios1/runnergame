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
    balance: {
      type: Number,
      default: 0,
    },
    last_recharge: {
      type: Number,
      default: 0,
    },
    promocode: {
      type: String,
    },
    promocodeStatus: {
      // New field to store promocode status
      type: Boolean,
      default: false, // Default to false if not set
    },
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    otp: { type: String }, // Store OTP temporarily
    isVerified: { type: Boolean, default: false }, // Status to track verification
    otpExpiresreg: {
      type: Date,
    },
    currency: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    coins: { type: Number, default: 0 }, // New: In-game currency
    bonus: { type: Number, default: 0 }, // New: Promotional credits
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);
