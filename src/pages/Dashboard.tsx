import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Server, ServerOff, TrendingUp } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { NotificationPanel } from '@/components/dashboard/NotificationPanel';
import { EventFeed } from '@/components/dashboard/EventFeed';
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb';
import { SummaryCardSkeleton } from '@/components/common/LoadingSkeleton';
import { usePolling } from '@/hooks/usePolling';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [clearLoading, setClearLoading] = useState(false);
  const [clearType, setClearType] = useState('');
  const [clearError, setClearError] = useState('');
  const [clearSuccess, setClearSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    attendanceToday: 0,
    devicesOnline: 0,
    devicesOffline: 0,
    attendanceRate: 0,
  });

  const fetchDashboardData = async () => {
    const res = await api.getDashboardSummary();
    const data = res.data || {};
    setSummary({
      totalStudents: data.total_students || 0,
      attendanceToday: data.present_today || 0,
      devicesOnline: 0, // Set from another endpoint if available
      devicesOffline: 0,
      attendanceRate: parseFloat(data.attendance_rate) || 0,
    });
    setLoading(false);
  };

  usePolling(fetchDashboardData, 5000);

  const handleClear = async (type: 'attendance' | 'students') => {
    setClearLoading(true);
    setClearType(type);
    setClearError('');
    setClearSuccess('');
    try {
      if (type === 'attendance') {
        await api.clearAttendance();
        setClearSuccess('Attendance records cleared!');
      } else {
        await api.clearStudents();
        setClearSuccess('Student records cleared!');
      }
    } catch (err) {
      setClearError('Failed to clear ' + type);
    } finally {
      setClearLoading(false);
      setTimeout(() => {
        setClearSuccess('');
        setClearError('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-8">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time overview of your attendance system
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total Students"
              value={
                summary.totalStudents
                  ? summary.totalStudents.toLocaleString()
                  : "0"
              }
              icon={Users}
              gradient="bg-gradient-primary"
            />
            <SummaryCard
              title="Attendance Today"
              value={
                summary.attendanceToday
                  ? summary.attendanceToday.toLocaleString()
                  : "0"
              }
              icon={UserCheck}
              gradient="bg-gradient-success"
              trend={{ value: 5.2, isPositive: true }}
            />
            <SummaryCard
              title="Devices Online"
              value={summary.devicesOnline}
              icon={Server}
              gradient="bg-gradient-primary"
            />
            <SummaryCard
              title="Attendance Rate"
              value={`${summary.attendanceRate}%`}
              icon={TrendingUp}
              gradient="bg-gradient-success"
              trend={{ value: 2.1, isPositive: true }}
            />
          </>
        )}
      </div>
      {/* Clear buttons and feedback */}
      <div className="flex gap-4 items-center mb-4">
        <Button
          variant="destructive"
          disabled={clearLoading}
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear all attendance records?"
              )
            ) {
              handleClear("attendance");
            }
          }}
        >
          Clear Attendance
        </Button>
        <Button
          variant="destructive"
          disabled={clearLoading}
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear all student records?"
              )
            ) {
              handleClear("students");
            }
          }}
        >
          Clear Students
        </Button>
        {clearLoading && (
          <span className="text-xs text-muted-foreground">
            Clearing {clearType}...
          </span>
        )}
        {clearSuccess && (
          <span className="text-xs text-green-600">{clearSuccess}</span>
        )}
        {clearError && (
          <span className="text-xs text-red-600">{clearError}</span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationPanel />
        <EventFeed />
      </div>
    </div>
  );
}
