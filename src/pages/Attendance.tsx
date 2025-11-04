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
import 'jspdf-autotable';
import { api } from "@/lib/api";


export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  const exportToCSV = async () => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate export
    const csv = [
      ['Student ID', 'Name', 'Department', 'Course', 'Period', 'Device', 'Date', 'Timestamp', 'Status'],
      ...attendance.map((row) => [
        row.fingerprint_id || row.studentId,
        row.student_name || row.studentName,
        row.department,
        row.course,
        row.period,
        row.device_id || row.deviceId,
        row.date ? new Date(row.date).toLocaleDateString() : '',
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
        "Student ID": row.fingerprint_id || row.studentId,
        Name: row.student_name || row.studentName,
        Department: row.department,
        Course: row.course,
        Period: row.period,
        Device: row.device_id || row.deviceId,
        Date: row.date ? new Date(row.date).toLocaleDateString() : '',
        Timestamp: row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
        Status: row.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'attendance.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 15);
    
    (doc as any).autoTable({
      head: [
        [
          "Student ID",
          "Name",
          "Department",
          "Course",
          "Period",
          "Device",
          "Date",
          "Timestamp",
          "Status",
        ],
      ],
      body: attendance.map((row) => [
        row.fingerprint_id || row.studentId,
        row.student_name || row.studentName,
        row.department,
        row.course,
        row.period,
        row.device_id || row.deviceId,
        row.date ? new Date(row.date).toLocaleDateString() : '',
        row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
        row.status,
      ]),
      startY: 20,
    });
    
    doc.save('attendance.pdf');
  };

  return (
    <div className="space-y-6">
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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
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

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {!loading && !error && attendance.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-1">No Attendance Records</h3>
                  <p className="max-w-md text-sm text-muted-foreground">There are currently no attendance records to display. Once students are marked present, their records will appear here.</p>
                </div>
              )}
              {!loading && !error && attendance.length > 0 && (
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell className="font-medium">{record.fingerprint_id || record.studentId}</TableCell>
                      <TableCell>{record.student_name || record.studentName}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.course}</TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>{record.device_id || record.deviceId}</TableCell>
                      <TableCell>{record.date ? new Date(record.date).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{record.timestamp ? new Date(record.timestamp).toLocaleString() : ''}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
