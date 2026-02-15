const StudyTask = require('../models/StudyTask');
const Notification = require("../models/Notification");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await StudyTask.find({ userId: req.user.id });
    res.json(tasks);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { subject, task, date, time } = req.body;

    const newTask = await StudyTask.create({
      userId: req.user.id,
      subject,
      task,
      date,
      time,
    });

    // 🔔 NOTIFICATION
    await Notification.create({
      userId: req.user.id,
      title: "📚 New Study Task",
      message: `${subject}: ${task}`,
      type: "task",
    });

    res.json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await StudyTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await Notification.create({
      userId: req.user.id,
      title: "✏️ Task Updated",
      message: `${task.subject}: ${task.task}`,
      type: "task",
    });

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    await StudyTask.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Task deleted successfully' });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};
