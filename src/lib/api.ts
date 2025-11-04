
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = {
  // Dashboard summary
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE_URL}/api/attendance/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard summary");
    return await res.json();
  },

  // Events (history)
  async getEvents(limit = 100) {
    const res = await fetch(`${API_BASE_URL}/api/events?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  },

  // Students
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/register?${query}`);
    if (!res.ok) throw new Error("Failed to fetch students");
    return await res.json();
  },

  async getStudent(fingerprint_id) {
    const res = await fetch(`${API_BASE_URL}/api/register/${fingerprint_id}`);
    if (!res.ok) throw new Error("Failed to fetch student");
    return await res.json();
  },

  // Attendance
  async getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/attendance?${query}`);
    if (!res.ok) throw new Error("Failed to fetch attendance");
    return await res.json();
  },

  async updateAttendance(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/attendance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update attendance");
    return await res.json();
  },

  // Devices
  async getDevices() {
    const res = await fetch(`${API_BASE_URL}/api/devices`);
    if (!res.ok) throw new Error("Failed to fetch devices");
    return await res.json();
  },

  // Clear all attendance
  async clearAttendance() {
    const res = await fetch(`${API_BASE_URL}/api/attendance/clear`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear attendance");
    return await res.json();
  },

  // Clear all students
  async clearStudents() {
    const res = await fetch(`${API_BASE_URL}/api/register/clear`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear students");
    return await res.json();
  },

  // Update student
  async updateStudent(fingerprint_id, data) {
    const res = await fetch(`${API_BASE_URL}/api/register/${fingerprint_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return await res.json();
  },

  // Delete student
  async deleteStudent(fingerprint_id) {
    const res = await fetch(`${API_BASE_URL}/api/register/${fingerprint_id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete student");
    return await res.json();
  },

  // Event history
  async getEventHistory(limit = 100) {
    const res = await fetch(`${API_BASE_URL}/api/events?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch event history");
    return await res.json();
  },
  
};
