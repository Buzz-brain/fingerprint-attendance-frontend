const express = require('express');
const router = express.Router();

// Example: Replace with real device data source
const devices = [
  {
    id: 'ESP32-001',
    deviceId: 'ESP32-001',
    location: 'Building A - Entrance',
    lastHeartbeat: new Date().toISOString(),
    lastSync: new Date().toISOString(),
    status: 'online',
  },
  {
    id: 'ESP32-002',
    deviceId: 'ESP32-002',
    location: 'Building B - Main Hall',
    lastHeartbeat: new Date(Date.now() - 300000).toISOString(),
    lastSync: new Date().toISOString(),
    status: 'offline',
  },
];

router.get('/', (req, res) => {
  res.json(devices);
});

module.exports = router;
