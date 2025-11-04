const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fingerprint_id: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 1000,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    student_id: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    class: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    last_attendance: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
studentSchema.index({ fingerprint_id: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ is_active: 1 });

// Virtual for attendance count (you can populate this)
studentSchema.virtual("attendance_count", {
  ref: "Attendance",
  localField: "fingerprint_id",
  foreignField: "fingerprint_id",
  count: true,
});


// Pre-save hook to set student_id to _id as string if not set
studentSchema.pre('save', function(next) {
  if (!this.student_id) {
    this.student_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
