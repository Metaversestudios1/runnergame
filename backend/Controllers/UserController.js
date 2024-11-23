const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const Promocode = require("../Models/User");

const sendmailsms = async (req, res) => {
  const { email, contact } = req.body;
  try {
    let existingUser;

    // Check for existing user by email or contact
    if (email) {
      existingUser = await User.findOne({ email });
    }

    if (contact) {
      existingUser = await User.findOne({ contact });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or mobile number already used." });
    }

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");

    // Check if email is present and send OTP via email
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
      console.log(`OTP sent to email: ${email}`);
    }

    // Check if contact is present and send OTP via SMS
    if (contact) {
      const formattedContact = contact.startsWith("+")
        ? contact
        : `+91${contact}`; // Assuming +91 is the country code for India
      const twilioClient = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      const message = await twilioClient.messages.create({
        body: `Your registration confirmation code is ${otp}`, // Customize the message body
        from: process.env.TWILIO_PHONE_NUMBER, // This should be a valid Twilio number
        to: formattedContact, // Ensure this is the correct format for the recipient number
      });
      console.log(`OTP sent to SMS: ${formattedContact}`);
    }

    const otpExpires = Date.now() + 10 * 60 * 1000;

    const newUser = new User({
      email,
      contact,
      otp, // Store OTP
      otpExpires,
      isVerified: false, // Mark as unverified until OTP is confirmed
    });

    await newUser.save();
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyotpreg = async (req, res) => {
  const { email, contact, otp } = req.body;
  try {
    let user;

    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found with this email." });
      }
    }

    if (contact) {
      user = await User.findOne({ contact });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found with this contact." });
      }
    }

    // Check if OTP exists for the user
    if (!user.otp) {
      return res.status(400).json({
        message: "OTP has not been generated or has already been used.",
      });
    }

    // Check if the OTP has expired
    if (user.otpExpiresreg && user.otpExpiresreg < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }
    if (user.otp == otp) {
      user.isVerified = true;
      user.otp = undefined; // Remove OTP after verification
      user.otpExpiresAt = undefined; // Clear expiration time
      await user.save();

      return res.status(200).json({ message: "User verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const insertuser = async (req, res) => {
  const { password, promocode, ...userData } = req.body;

  try {
    // Validate required fields
    if (!password || (!userData.email && !userData.contact)) {
      return res.status(400).json({
        success: false,
        message: "Please provide password and either email or contact.",
      });
    }

    // Validate password length
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must contain a minimum of 4 characters.",
      });
    }

    // Check if user already exists by email or contact
    const query = {};
    if (userData.email) query.email = userData.email;
    if (userData.contact) query.contact = userData.contact;

    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with the provided email or contact.",
      });
    }

    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique user ID
    let uniqueUserId;
    let isUnique = false;
    while (!isUnique) {
      uniqueUserId = `T${Math.floor(10000 + Math.random() * 90000)}`;
      const existingId = await User.findOne({ user_id: uniqueUserId });
      if (!existingId) {
        isUnique = true;
      }
    }

    // Set promocode if not provided
    const generatedPromocode = `PROMO_${uniqueUserId.slice(0, 4).toUpperCase()}`;

    // Create new user data
    const newUser = new User({
      ...userData,
      password: hashedPassword,
      user_id: uniqueUserId,
      promocode: promocode || generatedPromocode,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { user_id: newUser.user_id, promocode: newUser.promocode },
    });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({
      success: false,
      message: "Error registering user.",
      error: err.message,
    });
  }
};

module.exports = { insertuser };


const updateuser = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error in updating the user",
      error: err.message,
    });
  }
};

const userlogin = async (req, res) => {
  const { email, password, contact } = req.body;
  try {
    if (!password || (!email && !contact)) {
      return res
        .status(404)
        .json({ sucess: false, message: "please provide all fields" });
    }
    const query = {};
    if (email) query.email = email;
    if (contact) query.contact = contact;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ sucess: false, message: "user not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(404)
        .json({ sucess: false, message: "Password does not match" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const getAlluser = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.username = { $regex: search, $options: "i" };
    }

    const result = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await User.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting user" });
  }
};
const getSingleuser = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await User.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching user" });
  }
};

const deleteuser = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await User.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching user" });
  }
};
const userlogout = async (req, res) => {
  res.clearCookie("connect.sid"); // Name of the session ID cookie
  res.clearCookie("token"); // Name of the session ID cookie
  res.status(200).json({ status: true, message: "Successfully logged out" });
};

const sendotp = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const update = await User.updateOne(
      { email: user.email },
      {
        $set: {
          resetOtp: otp,
          otpExpires: otpExpires,
        },
      }
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find employee by email and OTP
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (User.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if both email and new password are provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
module.exports = {
  insertuser,
  updateuser,
  userlogin,
  getAlluser,
  getSingleuser,
  deleteuser,
  userlogout,
  sendotp,
  verifyOtp,
  resetPassword,
  sendmailsms,
  verifyotpreg,
};
