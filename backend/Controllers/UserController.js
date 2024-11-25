const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const { id } = req.params;
    // Find user by ID
    const user = await User.findById(id); // Exclude the password field
    if (!user) {
      return res.status(404).json({success: false, message: "User not found" });
    }
    res.status(200).json({success: true,
     userprofileData:{ username: user.username,
      email: user.email,
      highScore: user.highScore,
      coins: user.coins,
      achievements: user.achievements,
    }});
  } catch (error) {
    res.status(500).json({ success: false,error: error.message });
  }
};

const updateprofile = async(req,res ) => {
  try {
    const { id } = req.params;
    const { username, email, avatar } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false,message: "User not found" });
    }
    Object.keys(req.body).forEach((key) => {
      if (user[key] !== undefined) { // Check if the field exists in the user object
        user[key] = req.body[key];
      }
    });
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
    const { email, username, password } = req.body;

    // Ensure at least one of email or username is provided
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Either email or username and password are required.",
      });
    }
    
    // Determine the query based on whether email or username is provided
    const query = email ? { email } : { username };
    
    console.log(query);
    
    // Find user by email or username
    const user = await User.findOne(query);

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
