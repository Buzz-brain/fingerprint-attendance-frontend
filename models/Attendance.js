const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    fingerprint_id: {
      type: Number,
      required: true,
      ref: "Student",
    },
    student_name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
      enum: ["mathematics", "physics", "chemistry", "biology", "english"],
      lowercase: true,
    },
    period: {
      type: String,
      required: true,
      enum: ["morning", "midmorning", "afternoon", "evening"],
      lowercase: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    device_id: {
      type: String,
      required: true,
      default: "esp32_classroom_1",
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique attendance per student per course per day
attendanceSchema.index(
  {
    fingerprint_id: 1,
    course: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// Index for common queries
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ course: 1 });
attendanceSchema.index({ department: 1 });
attendanceSchema.index({ period: 1 });

// Pre-save middleware to set date to beginning of day
attendanceSchema.pre("save", function (next) {
  if (this.isNew) {
    const now = new Date();
    this.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
