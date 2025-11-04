const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const { broadcastEvent } = require("../routes/events");

// Register new student
const registerStudent = async (req, res) => {
  console.log(req.body)
  try {
    const {
      fingerprint_id,
      name,
      department,
      device_id,
    } = req.body;

    // Check if fingerprint ID is already taken
    const existingStudent = await Student.findOne({ fingerprint_id });
    if (existingStudent) {
      console.log("Fingerprint ID already registered:", fingerprint_id);
      // Broadcast duplicate registration event
      broadcastEvent({
        eventType: "student_registration_failed",
        reason: "duplicate",
        fingerprint_id,
        name,
        department,
        device_id,
        timestamp: new Date(),
        details: `Duplicate registration attempt for fingerprint ID: ${fingerprint_id}`,
      });
      return res.status(409).json({
        success: false,
        message: "Fingerprint ID already registered",
      });
    }

    // Create new student
      const student = new Student({
        fingerprint_id,
        name: name.trim(),
        department: department.trim(),
        // Generate student_id automatically (MongoDB ObjectId as string)
        student_id: new Student()._id.toString(),
        class: device_id ? device_id.trim() : undefined,
        // registered_at will be set by default (schema)
      });

    await student.save();

    console.log("Student registered successfully:", student.fingerprint_id);
    res.status(200).json({
      success: true,
      message: "Student registered successfully",
      data: {
        fingerprint_id: student.fingerprint_id,
        name: student.name,
        department: student.department,
        student_id: student.student_id,
        class: student.class,
        registered_at: student.registered_at,
      }
    });

    // Log event
    const event = new Event({
      eventType: "student_registered",
      studentId: student.student_id || student._id,
      studentName: student.name,
      deviceId: device_id || "esp32_classroom_1",
      timestamp: new Date(),
      details: `Student registered: ${student.name} (${student.fingerprint_id})`,
    });
    await event.save();
  broadcastEvent(event);
  
  } catch (error) {
    console.error("Student registration error:", error);

    if (error.code === 11000) {
      console.log("Fingerprint ID already exists error:", error);
      // Broadcast duplicate registration event (error)
      broadcastEvent({
        eventType: "student_registration_failed",
        reason: "duplicate_error",
        fingerprint_id: req.body.fingerprint_id,
        name: req.body.name,
        department: req.body.department,
        device_id: req.body.device_id,
        timestamp: new Date(),
        details: `Duplicate registration error for fingerprint ID: ${req.body.fingerprint_id}`,
      });
      return res.status(409).json({
        success: false,
        message: "Fingerprint ID already exists",
      });
    }

    // Broadcast generic registration error
    broadcastEvent({
      eventType: "student_registration_failed",
      reason: "server_error",
      fingerprint_id: req.body.fingerprint_id,
      name: req.body.name,
      department: req.body.department,
      device_id: req.body.device_id,
      timestamp: new Date(),
      details: `Server error while registering student: ${error.message}`,
    });
    res.status(500).json({
      success: false,
      message: "Server error while registering student",
    });
  }
};

// Get all students with attendance summary
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    const totalDays = await Attendance.distinct('timestamp');
    const studentsWithSummary = await Promise.all(students.map(async (student) => {
      const present = await Attendance.countDocuments({ fingerprint_id: student.fingerprint_id });
      // If you track lateness, e.g. { fingerprint_id, status: 'late' }
      const late = await Attendance.countDocuments({ fingerprint_id: student.fingerprint_id, status: 'late' });
      const absent = totalDays.length - present;
      const attendanceRate = totalDays.length > 0 ? ((present / totalDays.length) * 100).toFixed(2) : 0;
      return {
        ...student._doc,
        present,
        absent: absent < 0 ? 0 : absent,
        late,
        attendanceRate: Number(attendanceRate),
      };
    }));
    res.json({
      success: true,
      data: studentsWithSummary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

// Get student by fingerprint ID
const getStudentByFingerprintId = async (req, res) => {
  try {
    const { fingerprint_id } = req.params;

    const student = await Student.findOne({
      fingerprint_id: parseInt(fingerprint_id),
      is_active: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get recent attendance for this student
    const recentAttendance = await Attendance.find({
      fingerprint_id: parseInt(fingerprint_id),
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .select("course period timestamp")
      .exec();

    res.json({
      success: true,
      data: {
        student,
        recent_attendance: recentAttendance,
      },
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student",
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { fingerprint_id } = req.params;
    const updateData = req.body;

    // Remove immutable fields
    delete updateData.fingerprint_id;
    delete updateData.registered_at;

    const student = await Student.findOneAndUpdate(
      { fingerprint_id: parseInt(fingerprint_id) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating student",
    });
  }
};

// Delete student (soft delete)
const deleteStudent = async (req, res) => {
  try {
    const { fingerprint_id } = req.params;

    const student = await Student.findOneAndUpdate(
      { fingerprint_id: parseInt(fingerprint_id) },
      { is_active: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deactivated successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deactivating student",
    });
  }
};

// Clear all registered students
const clearAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All students have been deleted."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete students.",
      error: error.message
    });
  }
};

module.exports = {
  registerStudent,
  getStudents,
  getStudentByFingerprintId,
  updateStudent,
  deleteStudent,
  clearAllStudents,
};
