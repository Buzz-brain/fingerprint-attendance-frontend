const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // 'attendance_marked', 'student_registered', etc.
  studentId: { type: String },
  studentName: { type: String },
  deviceId: { type: String },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

module.exports = mongoose.model('Event', eventSchema);