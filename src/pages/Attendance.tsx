import { useState, useEffect } from 'react';
import { Download, Filter, Search, Edit, FileSpreadsheet, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from "@/lib/api";


export default function Attendance() {
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseFilter, setCourseFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      present: { className: 'bg-success text-success-foreground', label: 'Present' },
      late: { className: 'bg-warning text-warning-foreground', label: 'Late' },
      absent: { className: 'bg-destructive text-destructive-foreground', label: 'Absent' },
    };

    const config = variants[status] || variants.present;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  useEffect(() => {
    async function fetchAttendance() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getAttendance(); // Use your API utility
        setAttendance(res.data || []);
      } catch (err) {
        setError("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
    // Listen for attendance-updated event
    const handler = () => fetchAttendance();
    window.addEventListener('attendance-updated', handler);
    return () => {
      window.removeEventListener('attendance-updated', handler);
    };
  }, []);

  const exportToCSV = async () => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate export
    const csv = [
      ['Student ID', 'Name', 'Department', 'Course', 'Period', 'Device', 'Date', 'Timestamp', 'Status'],
      ...attendance.map((row) => [
        row.student_id || row.studentId,
        row.student_name || row.studentName,
        row.department,
        row.course,
        row.period,
        row.device_id || row.deviceId,
        row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
        row.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
    setExporting(false);
  };

  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      attendance.map((row) => ({
        "Student ID": row.student_id || row.studentId,
        Name: row.student_name || row.studentName,
        Department: row.department,
        Course: row.course,
        Period: row.period,
        Device: row.device_id || row.deviceId,
        Timestamp: row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
        Status: row.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'attendance.xlsx');
  };

  const exportToPDF = () => {
    try {
      alert('Exporting PDF...'); // Debug: confirm function is called
      const doc = new jsPDF();
      doc.text('Attendance Report', 14, 15);
      autoTable(doc, {
        head: [
          [
            "Student ID",
            "Name",
            "Department",
            "Course",
            "Period",
            "Device",
            "Timestamp",
            "Status",
          ],
        ],
        body: attendance.map((row) => [
          row.student_id || row.studentId,
          row.student_name || row.studentName,
          row.department,
          row.course,
          row.period,
          row.device_id || row.deviceId,
          row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
          row.status,
        ]),
        startY: 20,
      });
      doc.save('attendance.pdf');
    } catch (err) {
      alert('PDF export failed: ' + err);
    }
  };

  // Filter attendance based on searchTerm
  const filteredAttendance = attendance.filter((record) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (record.student_id && record.student_id.toLowerCase().includes(term)) ||
      (record.student_name && record.student_name.toLowerCase().includes(term)) ||
      (record.department && record.department.toLowerCase().includes(term)) ||
      (record.course && record.course.toLowerCase().includes(term)) ||
      (record.period && record.period.toLowerCase().includes(term));
    const matchesCourse = courseFilter ? record.course === courseFilter : true;
    const matchesPeriod = periodFilter ? record.period === periodFilter : true;
    const device = record.device_id || record.deviceId || '';
    const matchesDevice = deviceFilter ? device === deviceFilter : true;
    let matchesDate = true;
    let matchesTime = true;
    if (dateFilter) {
      const recordDate = record.date ? new Date(record.date).toISOString().slice(0, 10) : '';
      matchesDate = recordDate === dateFilter;
    }
    if (timeFilter) {
      const recordTime = record.timestamp ? new Date(record.timestamp).toTimeString().slice(0, 5) : '';
      matchesTime = recordTime === timeFilter;
    }
    return matchesSearch && matchesCourse && matchesPeriod && matchesDevice && matchesDate && matchesTime;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-10 px-2 sm:px-6 space-y-8">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Attendance" }]}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Attendance</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track student attendance records
        </p>
      </motion.div>

      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-t-3xl p-6 shadow-md">
          <CardTitle className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 mt-7 flex-1 max-w-2xl">
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                <Input
                  placeholder="Search students..."
                  className="pl-9 bg-blue-50/60 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl text-blue-900 placeholder:text-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                style={{ minWidth: 130 }}
                className="border border-blue-200 rounded-xl px-2 py-1 bg-blue-50/60 text-blue-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Courses</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="english">English</option>
              </select>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                style={{ minWidth: 120 }}
                className="border border-blue-200 rounded-xl px-2 py-1 bg-blue-50/60 text-blue-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Periods</option>
                <option value="morning">Morning</option>
                <option value="midmorning">Midmorning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                style={{ minWidth: 120 }}
                className="border border-blue-200 rounded-xl px-2 py-1 bg-blue-50/60 text-blue-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Devices</option>
                <option value="esp32_classroom_1">esp32_classroom_1</option>
                <option value="esp32_classroom_2">esp32_classroom_2</option>
                {/* Add more device options as needed */}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-blue-200 rounded-xl px-2 py-1 bg-blue-50/60 text-blue-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                style={{ minWidth: 120 }}
              />
              <input
                type="time"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-blue-200 rounded-xl px-2 py-1 bg-blue-50/60 text-blue-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                style={{ minWidth: 120 }}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-7">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToXLSX}
                disabled={exporting}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                XLSX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={exporting}
              >
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 via-white to-purple-100/80 backdrop-blur border-b">
                <TableRow>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Student ID
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Department
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Course
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Period
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Device
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Timestamp
                  </TableHead>
                  <TableHead className="py-4 px-3 text-base font-semibold">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-muted-foreground bg-gray-50"
                    >
                      <span className="animate-pulse">
                        Loading attendance records...
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-destructive bg-gray-50"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !error && attendance.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-20 text-center bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          width="56"
                          height="56"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="mx-auto mb-4 text-accent opacity-70"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6v6l4 2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                        <h3 className="text-xl font-semibold mb-1 text-gray-700">
                          No Attendance Records
                        </h3>
                        <span className="max-w-md text-base text-muted-foreground">
                          There are currently no attendance records to display.
                          Once students are marked present, their records will
                          appear here.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  !error &&
                  filteredAttendance.length > 0 &&
                  filteredAttendance.map((record, idx) => (
                    <TableRow
                      key={record._id || record.id}
                      className={
                        idx % 2 === 0
                          ? "bg-blue-50/60 hover:bg-blue-100/80 transition-colors"
                          : "bg-purple-50/60 hover:bg-purple-100/80 transition-colors"
                      }
                    >
                      <TableCell className="font-medium py-3 px-3 rounded-l-xl text-blue-900">
                        {record.student_id || record.studentId}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-blue-900">
                        {record.student_name || record.studentName}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-blue-900">
                        {record.department}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-indigo-700 font-semibold">
                        {record.course}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-purple-700 font-semibold">
                        {record.period}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-blue-700">
                        {record.device_id || record.deviceId}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {record.timestamp
                          ? new Date(record.timestamp).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell className="py-3 px-3 rounded-r-xl">
                        {getStatusBadge(record.status)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
