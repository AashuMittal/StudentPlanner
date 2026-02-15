const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: Date,
});

module.exports = mongoose.model("UserProgress", UserProgressSchema); 