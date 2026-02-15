const Achievement = require('../models/Achievement');
const UserProgress = require("../models/UserProgress");

exports.addAchievement = async (req, res) => {
  try {
    const { name } = req.body;
    const newAchievement = new Achievement({ userId: req.user.id, name });
    await newAchievement.save();
    res.json(newAchievement);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await UserProgress.create({ userId: req.user.id });
    }

    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      userId: req.user.id,
    });
    res.json(achievements);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
