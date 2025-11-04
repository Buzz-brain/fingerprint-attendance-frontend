// Fetch logs, students, and attendance from API endpoints
async function fetchData() {
  // Store previous counts for notifications
  if (!window._prevStudentCount) window._prevStudentCount = 0;
  if (!window._prevAttendanceCount) window._prevAttendanceCount = 0;

  // Fetch students
  const studentsRes = await fetch('/api/register');
  const students = await studentsRes.json();
  const studentsTable = document.querySelector('#students-table tbody');
  studentsTable.innerHTML = '';
  (students.data || []).forEach(s => {
    studentsTable.innerHTML += `<tr>
      <td>${s.fingerprint_id}</td>
      <td>${s.name}</td>
      <td>${s.department}</td>
      <td>${s.student_id}</td>
      <td>${s.class || s.device_id || ''}</td>
      <td>${new Date(s.registered_at).toLocaleString()}</td>
    </tr>`;
  });

  // Notification for new student registration
  if ((students.data || []).length > window._prevStudentCount) {
    const newStudent = (students.data || [])[0];
    showLog(`New student registered: ${newStudent ? newStudent.name : ''}`, 'success');
  }
  window._prevStudentCount = (students.data || []).length;

  // Fetch attendance
  const attendanceRes = await fetch('/api/attendance');
  const attendance = await attendanceRes.json();
  const attendanceTable = document.querySelector('#attendance-table tbody');
  attendanceTable.innerHTML = '';
  (attendance.data || []).forEach(a => {
    attendanceTable.innerHTML += `<tr>
      <td>${a.fingerprint_id}</td>
      <td>${a.student_name || ''}</td>
      <td>${a.department}</td>
      <td>${a.course}</td>
      <td>${a.period}</td>
      <td>${new Date(a.date).toLocaleDateString()}</td>
      <td>${a.device_id}</td>
      <td>${a.status}</td>
    </tr>`;
  });

  // Notification for new attendance record
  if ((attendance.data || []).length > window._prevAttendanceCount) {
    const newAttendance = (attendance.data || [])[0];
    showLog(`Attendance marked for: ${newAttendance ? newAttendance.student_name || '' : ''}`, 'success');
  }
  window._prevAttendanceCount = (attendance.data || []).length;
}

// Display logs for registration and attendance
function showLog(message, type = 'success') {
  const logsDiv = document.getElementById('logs');
  const logId = 'notif-log';
  logsDiv.innerHTML = `<div id="${logId}" class="log ${type}">${message}</div>` + logsDiv.innerHTML;
  setTimeout(() => {
    const notif = document.getElementById(logId);
    if (notif) notif.remove();
  }, 5000);
}

// Example: showLog('Student registered successfully!', 'success');
// Example: showLog('Attendance marked!', 'success');

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
});
