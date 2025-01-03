const mongoose= require('mongoose');
const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    paymentType: {
        type: String,
        enum: ['manual', 'razorpay'], // Payment types
    },
    transactionType: {
        type: String,
        enum: ['recharge', 'withdraw'], // Transaction types
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    transactionId: {
        type: String, // For Razorpay or manual reference
    },
    razorpayPaymentId: {
        type: String, // Only for Razorpay payments
    },
    requested_date:{
        type: Date, 
        default: Date.now 
    },
    deleted_at: {
      type: Date,
      default: null,
    },
},{ timestamps: true, collection: "transaction" });

module.exports = mongoose.model('Transaction',  transactionSchema )
