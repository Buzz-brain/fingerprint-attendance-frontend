import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export const SummaryCard = ({ title, value, icon: Icon, trend, gradient }: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg">
        <div className={`absolute inset-0 opacity-5 ${gradient || 'bg-gradient-primary'}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
              {trend && (
                <div className="mt-2 flex items-center gap-1">
                  <span
                    className={`text-sm font-medium ${
                      trend.isPositive ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {trend.isPositive ? '+' : ''}
                    {trend.value}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last week</span>
                </div>
              )}
            </div>
            <div className={`rounded-xl p-3 ${gradient || 'bg-gradient-primary'}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
