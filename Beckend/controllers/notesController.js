const Note = require("../models/Note");
const UserProgress = require("../models/UserProgress");
const Achievement = require("../models/Achievement");
const Notification = require("../models/Notification");

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const note = await Note.create({
       userId: req.user.id,
      subject: req.body.subject,
      content: req.body.content,
      fileUrl: req.file ? `uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    });

    // 🔔 NOTIFICATION
    await Notification.create({
      userId: req.user.id,
      title: "📝 Note Added",
      message: `Your note "${req.body.subject}" was added`,
      type: "note",
    });

    let progress = await UserProgress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await UserProgress.create({ userId: req.user.id });
    }

    // 🎯 XP
    progress.xp += 10;
    progress.level = Math.floor(progress.xp / 100) + 1;

    // 🔥 STREAK
    const today = new Date().toDateString();
    if (progress.lastActive?.toDateString() !== today) {
      progress.streak += 1;
    }
    progress.lastActive = new Date();
    await progress.save();

    // 🏆 ACHIEVEMENTS
    const achievements = [
      { condition: progress.streak === 3, name: "🔥 3 Day Streak", icon: "🔥" },
      { condition: progress.level === 2, name: "⬆️ Level Up", icon: "⬆️" },
      { condition: progress.xp >= 100, name: "💯 XP Earned", icon: "💯" },
    ];

    let unlocked = null;
    for (let a of achievements) {
      if (a.condition) {
        const exists = await Achievement.findOne({
          userId: req.user.id,
          name: a.name,
        });
        if (!exists) {
          unlocked = await Achievement.create({
            userId: req.user.id,
            name: a.name,
            icon: a.icon,
          });

          // 🔔 ACHIEVEMENT NOTIFICATION
          await Notification.create({
            userId: req.user.id,
            title: "🏆 Achievement Unlocked",
            message: a.name,
            type: "achievement",
          });
        }
      }
    }

    res.json({ note, progress, unlocked });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateNote = async (req, res) => {
  try {

    const updateData = {
      subject: req.body.subject,
      content: req.body.content,
    };

    if (req.file) {
      updateData.fileName = req.file.filename;
      updateData.fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Notification.create({
      userId: req.user.id,
      title: "✏️ Note Updated",
      message: `Your note "${note.subject}" was updated`,
      type: "note",
    });

    res.json(note);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
