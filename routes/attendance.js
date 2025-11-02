const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAttendanceStats,
} = require("../controllers/attendanceController");
// const { validateAttendance } = require("../middleware/validation");

// Mark attendance (from ESP32)
router.post("/", markAttendance);

// Clear all marked attendance
router.delete("/clear", require("../controllers/attendanceController").clearAllAttendance);

// Get attendance records
router.get("/", getAttendance);

// Get attendance statistics
router.get("/stats", getAttendanceStats);

module.exports = router;
