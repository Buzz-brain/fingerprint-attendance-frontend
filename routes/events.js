const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

let clients = [];

// SSE stream for live events
router.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send a comment to keep connection alive
  res.write(':\n\n');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
});

// Utility to broadcast new events to all SSE clients
function broadcastEvent(event) {
  console.log('[SSE] Broadcasting event:', event.eventType, 'to', clients.length, 'clients');
  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach((res, idx) => {
    try {
      res.write(data);
      console.log(`[SSE] Event sent to client #${idx + 1}`);
    } catch (err) {
      console.error('[SSE] Error sending event to client:', err);
    }
  });
}

// Event history endpoint
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  try {
    const events = await Event.find({})
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: err.message });
  }
});

// Export broadcastEvent for use in controllers
module.exports = { router, broadcastEvent };
