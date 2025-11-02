// Clear all marked attendance
const clearAllAttendance = async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All attendance records have been deleted."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance records.",
      error: error.message
    });
  }
};
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { fingerprint_id, course, period, device_id } = req.body;

    // Check if student exists
    const student = await Student.findOne({
      fingerprint_id,
      is_active: true,
    });

    if (!student) {
      console.log("Student not found or inactive for fingerprint_id:", fingerprint_id);
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
    }

    // Check for duplicate attendance (same student, same course, same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      fingerprint_id,
      course,
      date: today,
    });

    if (existingAttendance) {
      console.log("Duplicate attendance attempt for:", student.name);
      return res.status(409).json({
        success: false,
        message: "Attendance already marked for today",
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      fingerprint_id,
      student_name: student.name,
      department: student.department,
      course,
      period,
      device_id: device_id || "esp32_classroom_1",
    });

    await attendance.save();

    // Update student's last attendance timestamp
    student.last_attendance = new Date();
    await student.save();

    console.log("Attendance marked successfully for:", student.name);
    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: {
        attendance_id: attendance._id,
        student_name: student.name,
        department: student.department,
        course,
        period,
        timestamp: attendance.timestamp,
      },
    });
  } catch (error) {
    console.error("Attendance marking error:", error);

    if (error.code === 11000) {
      console.log("Duplicate attendance detected for:", student.name);
      return res.status(409).json({
        success: false,
        message: "Duplicate attendance detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while marking attendance",
    });
  }
};

// Get attendance records with filtering
const getAttendance = async (req, res) => {
  try {
    const {
      course,
      department,
      period,
      date,
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object
    const filter = {};

    if (course) filter.course = course;
    if (department) filter.department = department;
    if (period) filter.period = period;

    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.timestamp = {
        $gte: filterDate,
        $lt: nextDay,
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { timestamp: -1 },
      populate: {
        path: "fingerprint_id",
        select: "name student_id class",
      },
    };

    const attendance = await Attendance.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Attendance.countDocuments(filter);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching attendance",
    });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { course, department, date } = req.query;

    const filterDate = date ? new Date(date) : new Date();
    filterDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const filter = {
      timestamp: {
        $gte: filterDate,
        $lt: nextDay,
      },
    };

    if (course) filter.course = course;
    if (department) filter.department = department;

    // Get total students
    const totalStudents = await Student.countDocuments({
      is_active: true,
      ...(department && { department }),
    });

    // Get present students for the day
    const presentStudents = await Attendance.distinct("fingerprint_id", filter);

    // Get attendance by course
    const attendanceByCourse = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get attendance by period
    const attendanceByPeriod = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$period",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        date: filterDate.toISOString().split("T")[0],
        total_students: totalStudents,
        present_today: presentStudents.length,
        absent_today: totalStudents - presentStudents.length,
        attendance_rate:
          totalStudents > 0
            ? ((presentStudents.length / totalStudents) * 100).toFixed(2)
            : 0,
        by_course: attendanceByCourse,
        by_period: attendanceByPeriod,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceStats,
  clearAllAttendance,
};
