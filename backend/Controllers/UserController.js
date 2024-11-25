const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const Promocode = require("../Models/User");

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({success: false, message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    res
      .status(201)
      .json({success: true, message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({success: false, error: error.message });
  }
};
const profile = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find user by ID
    const user = await User.findById(user_id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({success: false, message: "User not found" });
    }

    res.status(200).json({success: true,
      username: user.username,
      email: user.email,
      highScore: user.highScore,
      coins: user.coins,
      achievements: user.achievements,
    });
  } catch (error) {
    res.status(500).json({ success: false,error: error.message });
  }
};

const updateprofile = async(req,res ) => {
  try {
    const { user_id } = req.params;
    const { username, email, avatar } = req.body;

    // Find the user by ID
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false,message: "User not found" });
    }

    // Update the user fields (only if provided in the request)
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        highScore: user.highScore,
        coins: user.coins,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false,error: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({ success: false,message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({success: true, token, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({success: false, error: error.message });
  }
};

module.exports = {
  register,
  login,
  profile,
  updateprofile
};
