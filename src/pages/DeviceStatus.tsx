import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function DeviceStatus() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDevices() {
      setLoading(true);
      setError('');
      try {
        const data = await api.getDevices();
        setDevices(data);
      } catch (err) {
        setError('Failed to load device status');
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : devices.length === 0 ? (
          <p>No devices found.</p>
        ) : (
          <div className="space-y-4">
            {devices.map(device => (
              <div key={device.deviceId} className="flex items-center gap-4 p-2 border rounded">
                <span className="font-medium">{device.deviceId}</span>
                <span>{device.location}</span>
                <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                  {device.status}
                </Badge>
                <span className="text-xs text-muted-foreground">Last heartbeat: {new Date(device.lastHeartbeat).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
