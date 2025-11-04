import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb';
import { motion } from 'framer-motion';
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';


export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chartData = selectedStudent
    ? [
        {
          name: "Present",
          value: selectedStudent.present ?? 0,
          color: "hsl(var(--success))",
        },
        {
          name: "Absent",
          value: selectedStudent.absent ?? 0,
          color: "hsl(var(--destructive))",
        },
        {
          name: "Late",
          value: selectedStudent.late ?? 0,
          color: "hsl(var(--warning))",
        },
      ]
    : [];

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getStudents(); // Use your API utility
        setStudents(res.data || []);
        setSelectedStudent((res.data && res.data[0]) || null);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Students" }]}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Students</h1>
        <p className="mt-2 text-muted-foreground">
          Manage student information and view attendance history
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md lg:col-span-1">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && students.length === 0 && (
              <p>No students found.</p>
            )}
            {!loading && !error && students.length > 0 && (
              <div className="space-y-2">
                {students.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      selectedStudent && selectedStudent._id === student._id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.student_id}
                        </p>
                      </div>
                      <Badge
                        className={
                          student.attendanceRate >= 90
                            ? "bg-success text-success-foreground"
                            : student.attendanceRate >= 75
                            ? "bg-warning text-warning-foreground"
                            : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {student.attendanceRate}%
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* <Card className="shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedStudent ? (
              <div className="flex flex-col gap-2">
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Student ID:</strong> {selectedStudent.student_id}</p>
                <p><strong>Department:</strong> {selectedStudent.department}</p>
                <p><strong>Class:</strong> {selectedStudent.class}</p>
                <p><strong>Fingerprint ID:</strong> {selectedStudent.fingerprint_id}</p>
                <p><strong>Registered At:</strong> {selectedStudent.registered_at}</p>
                <p><strong>Status:</strong> {selectedStudent.is_active ? 'Active' : 'Inactive'}</p>
                <p><strong>Created At:</strong> {selectedStudent.createdAt}</p>
                <p><strong>Updated At:</strong> {selectedStudent.updatedAt}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a student to view details.</p>
            )}
          </CardContent>
        </Card> */}
        <Card className="shadow-lg lg:col-span-2 border border-muted bg-white">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {selectedStudent?.name
                      ? selectedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-primary">
                    {selectedStudent?.name}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedStudent?.is_active
                        ? "bg-success text-white"
                        : "bg-destructive text-white"
                    }`}
                  >
                    {selectedStudent?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedStudent ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Student ID:</span>
                      <span className="ml-2">{selectedStudent.student_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground">
                        Class
                      </Badge>
                      <span>{selectedStudent.class}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">
                        Department
                      </Badge>
                      <span>{selectedStudent.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">
                        Fingerprint ID
                      </Badge>
                      <span>{selectedStudent.fingerprint_id}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">
                        Registered
                      </Badge>
                      <span>
                        {new Date(
                          selectedStudent.registered_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">
                        Created
                      </Badge>
                      <span>
                        {new Date(
                          selectedStudent.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">
                        Updated
                      </Badge>
                      <span>
                        {new Date(
                          selectedStudent.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gradient-success p-4 text-white">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Attendance Rate</p>
                    <p className="text-2xl font-bold">
                      {selectedStudent?.attendanceRate}%
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 mt-5 text-lg font-semibold">
                    Attendance Summary
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Select a student to view details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
