const mongoose = require('mongoose');

const studyTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  task: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('StudyTask', studyTaskSchema);
