const Transaction = require("../Models/Transaction");
const User = require("../Models/User");
// const razorpay = require('razorpay');
const { options } = require("../Routes/PlayerRoutes");

// const razorpay =new razorpay({
//     Key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// })

const createmanualpayment = async (req, res) => {
  const {
    user_id,
    amount,
    transactionId,
    transactionType,
    paymentType,
    screenshot,
  } = req.body;
  try {
    const transaction = new Transaction({
      user_id,
      paymentType: paymentType,
      transactionType,
      amount,
      transactionId,
      status: "pending",
    });
    await transaction.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error creating manual payment",
        error: err.message,
      });
  }
};

const updatemanualpayment = async (req, res) => {
  const { paymentId, status } = req.body;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.paymentType !== "manual") {
      return res
        .status(404)
        .json({ success: false, message: "manual payment not found" });
    }
    payment.status = status;
    await payment.save();
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error updating manual payment",
        error: err.message,
      });
  }
};

// const createRazorpayPayment = async (req, res) => {
//     const { playerId, amount } = req.body;

//     try {
//         const options = {
//             amount: amount * 100, // Amount in paise
//             currency: 'INR',
//             receipt: `receipt_${Math.random().toString(36).substring(2)}`,
//         };

//         const razorpayOrder = await razorpay.orders.create(options);

//         const payment = new Payment({
//             playerId,
//             paymentType: 'razorpay',
//             amount,
//             transactionId: razorpayOrder.id,
//             status: 'pending',
//         });

//         await payment.save();

//         res.json({
//             success: true,
//             orderId: razorpayOrder.id,
//             amount: razorpayOrder.amount,
//             currency: razorpayOrder.currency,
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Error creating Razorpay payment', err });
//     }
// };

// const verifyRazorpayPayment = async (req, res) => {
//     const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId } = req.body;

//     try {
//         // Validate Razorpay payment signature
//         const crypto = require('crypto');
//         const generatedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//             .update(razorpayOrderId + '|' + razorpayPaymentId)
//             .digest('hex');

//         if (generatedSignature !== razorpaySignature) {
//             return res.status(400).json({ success: false, message: 'Invalid signature' });
//         }

//         const payment = await Payment.findById(paymentId);

//         if (!payment || payment.paymentType !== 'razorpay') {
//             return res.status(404).json({ success: false, message: 'Razorpay payment not found' });
//         }

//         payment.status = 'completed';
//         payment.razorpayPaymentId = razorpayPaymentId;
//         await payment.save();

//         res.json({ success: true, payment });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Error verifying payment', err });
//     }
// };

const getpayment = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const transactionType = req.query.transactionType;
    const paymentType = req.query.paymentType;
    const status = req.query.status;
    const query = {
      deleted_at: null,
    };
    // if (search) {
    //     query.amount = { $regex: search, $options: "i" };
    // }

    // If search is provided, handle it as a numeric range or exact match
    if (search) {
      const searchValue = parseFloat(search);
      if (!isNaN(searchValue)) {
        query.amount = searchValue;
      }
    }

    if (paymentType) {
      query.paymentType = paymentType; // e.g., 'manual' or 'razorpay'
    }
    if (status) {
      query.status = status; // e.g., 'manual' or 'razorpay'
    }

    if (transactionType) {
      query.transactionType = transactionType; // e.g., 'recharge' or 'withdraw'
    }
    const result = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Transaction.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "error fetching transaction",
        error: error.message,
      });
  }
};

const updatetransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;
    const transaction = await Transaction.findById(id);
    transaction.status = status;
    await transaction.save();
    console.log(req.body.type);
    if (req.body.type === "recharge") {
      if (req.body.status === "approved") {
        const user = await User.findById(transaction.user_id);
        user.balance += transaction.amount;
        await user.save();
      }
    } else if (req.body.type === "withdraw") {
      if (req.body.status === "approved") {
        const user = await User.findById(transaction.user_id);
        user.balance -= transaction.amount;
        await user.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error fetching transaction",
        error: err.message,
      });
  }
};

const getpaymentid = async (req, res) => {
  const { id, transactionType } = req.query; // Destructure id and transactionType from req.query

  console.log(req.query);

  try {
    const query = { _id: id }; // Build the query with _id

    if (transactionType) {
      query.transactionType = transactionType; // Add transactionType if it exists
    }

    const result = await Transaction.find(query); // Query the database
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createmanualpayment,
  updatemanualpayment,
  // createRazorpayPayment,
  // verifyRazorpayPayment,
  getpaymentid,
  getpayment,
  updatetransaction,
};
