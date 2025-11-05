import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to backend SSE endpoint
    const eventSource = new EventSource('/api/events');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Map backend event to notification type/message
        let type: Notification['type'] = 'info';
        let message = data.details || data.message || 'New event';
        if (data.eventType === 'student_registered') type = 'success';
        if (data.eventType === 'student_registration_failed') type = 'warning';
        if (data.eventType === 'attendance_marked') type = 'success';
        if (data.eventType === 'attendance_duplicate') type = 'warning';
        if (data.eventType === 'error') type = 'error';
        setNotifications((prev) => [
          {
            id: data._id || data.id || Math.random().toString(36).slice(2),
            type,
            message,
            timestamp: data.timestamp || new Date().toISOString(),
          },
          ...prev.slice(0, 19), // keep max 20 notifications
        ]);
      } catch (err) {
        // ignore parse errors
      }
    };
    eventSource.onerror = () => {
      // Optionally handle connection errors
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Live Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No new notifications
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  >
                    {getIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
