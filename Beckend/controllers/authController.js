
const User =require('../models/User')
const bcrypt = require('bcryptjs');
 const TokenService = require('../Service/TokenService');
const crypto = require("crypto");


 exports.Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ create JWT token after user is successfully created
    const token = TokenService.createToken(user); 

    res.status(201).json({ message: "User registered", token,user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = TokenService.createToken(user);
  res.json({ success: true, token,user });
};



exports.UpdateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    // Find user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    const token = TokenService.createToken(user);

    res.json({ success: true, message: "User updated successfully", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
};


exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  // 👉 abhi email nahi bhej rahe, console me de rahe
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  console.log("RESET LINK 👉", resetLink);

  res.json({
    success: true,
    message: "Password reset link generated",
    resetLink, // frontend testing ke liye
  });
};


exports.ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};
