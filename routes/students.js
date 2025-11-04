const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getStudents,
  getStudentByFingerprintId,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
// const { validateStudentRegistration } = require("../middleware/validation");

// Register new student (from ESP32)
router.post("/", registerStudent);

// Clear all registered students
router.delete("/clear", require("../controllers/studentController").clearAllStudents);

// Get all students
router.get(["/", ""], getStudents);

// Get student by fingerprint ID
router.get("/:fingerprint_id", getStudentByFingerprintId);

// Update student
router.put("/:fingerprint_id", updateStudent);

// Delete student
router.delete("/:fingerprint_id", deleteStudent);

module.exports = router;
