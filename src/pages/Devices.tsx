import { useEffect, useState } from 'react';
import { Server, Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageBreadcrumb } from '@/components/common/PageBreadcrumb';
import { motion } from 'framer-motion';
import { usePolling } from '@/hooks/usePolling';
import { api } from '@/lib/api';

interface Device {
  id: string;
  deviceId: string;
  location: string;
  lastHeartbeat: string;
  lastSync: string;
  status: 'online' | 'offline';
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = async () => {
    const data = await api.getDevices();
    setDevices(data);
  };

  usePolling(fetchDevices, 5000);

  const getStatusColor = (status: string) => {
    return status === 'online'
      ? 'bg-success text-success-foreground'
      : 'bg-destructive text-destructive-foreground';
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Devices' }]} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground">Devices</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor ESP32 device status and connectivity
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${
                      device.status === 'online' 
                        ? 'bg-gradient-success' 
                        : 'bg-destructive'
                    }`}>
                      <Server className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{device.deviceId}</CardTitle>
                      <p className="text-sm text-muted-foreground">{device.location}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {device.status === 'online' ? (
                      <Wifi className="mr-1 h-3 w-3" />
                    ) : (
                      <WifiOff className="mr-1 h-3 w-3" />
                    )}
                    {device.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Heartbeat</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{getTimeAgo(device.lastHeartbeat)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <div className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{getTimeAgo(device.lastSync)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
