const Notification = require("../models/Notification");

// GET all notifications
exports.getNotifications = async (req, res) => {
  const data = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(data);
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });

    res.json({ success: true, message: "All notifications deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting notifications" });
  }
};

