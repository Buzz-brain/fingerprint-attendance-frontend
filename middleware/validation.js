const validateAttendance = (req, res, next) => {
  const { fingerprint_id, course, period } = req.body;

  if (!fingerprint_id || !course || !period) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: fingerprint_id, course, period",
    });
  }

  if (typeof fingerprint_id !== "number" || fingerprint_id < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid fingerprint_id",
    });
  }

  const validCourses = [
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "english",
  ];
  const validPeriods = ["morning", "midmorning", "afternoon", "evening"];

  if (!validCourses.includes(course)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course",
    });
  }

  if (!validPeriods.includes(period)) {
    return res.status(400).json({
      success: false,
      message: "Invalid period",
    });
  }

  next();
};

const validateStudentRegistration = (req, res, next) => {
  const { fingerprint_id, name, department } = req.body;

  if (!fingerprint_id || !name || !department) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: fingerprint_id, name, department",
    });
  }

  if (
    typeof fingerprint_id !== "number" ||
    fingerprint_id < 1 ||
    fingerprint_id > 1000
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid fingerprint_id (must be between 1-1000)",
    });
  }

  if (name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Name must be between 2-100 characters",
    });
  }

  if (department.trim().length < 2 || department.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: "Department must be between 2-50 characters",
    });
  }

  next();
};

module.exports = {
  validateAttendance,
  validateStudentRegistration,
};
