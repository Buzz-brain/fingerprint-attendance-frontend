import { Download, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const mockWeeklyData = [
  { day: 'Mon', present: 1156, late: 45, absent: 47 },
  { day: 'Tue', present: 1178, late: 38, absent: 32 },
  { day: 'Wed', present: 1145, late: 52, absent: 51 },
  { day: 'Thu', present: 1192, late: 31, absent: 25 },
  { day: 'Fri', present: 1134, late: 58, absent: 56 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Reports' }]} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Generate and download attendance reports
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Daily Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Download today's attendance summary
            </p>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Download this week's attendance data
            </p>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download XLSX
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Custom Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Generate a custom date range report
            </p>
            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Weekly Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))' }}
                name="Present"
              />
              <Line
                type="monotone"
                dataKey="late"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--warning))' }}
                name="Late"
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
                name="Absent"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
