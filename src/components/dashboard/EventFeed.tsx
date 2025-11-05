import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEventStream } from '@/hooks/useEventStream';
import { api } from '@/lib/api';

interface Event {
  id?: string;
  eventType: string;
  studentName?: string;
  deviceId?: string;
  timestamp: string;
}

export const EventFeed = () => {
  const [events, setEvents] = useState<Event[]>([]);
  // Fetch recent events on mount
  useEffect(() => {
    (async () => {
      try {
        const recent = await api.getEventHistory(100);
        setEvents(recent);
      } catch {}
    })();
  }, []);

  // Append live events via SSE
  useEventStream((event: Event) => {
    setEvents((prev) => [event, ...prev].slice(0, 100));
  });

    const getEventBadge = (type: string) => {
      const variants: Record<string, { variant: any; label: string }> = {
        attendance_marked: { variant: 'default', label: 'Attendance' },
        student_registered: { variant: 'secondary', label: 'Registration' },
        duplicate_attempt: { variant: 'destructive', label: 'Duplicate' },
        device_offline: { variant: 'destructive', label: 'Device Offline' },
      };
      const config = variants[type] || { variant: 'default', label: type };
      return (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      );
    };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Live Event Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {events.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No recent events
            </p>
          ) : (
            <div className="space-y-4">
              {events.map((event, idx) => (
                <div
                  key={event.id || idx}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{event.studentName || 'Unknown'}</p>
                      {getEventBadge(event.eventType)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Device: {event.deviceId || 'N/A'}</span>
                      <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
