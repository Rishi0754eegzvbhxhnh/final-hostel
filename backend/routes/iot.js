const express = require('express');
const router = express.Router();
const IoTDevice = require('../models/IoTDevice');

// ─── SEED DEFAULT DEVICES ───────────────────────────────────────────────────
const DEFAULT_DEVICES = [
  // Block A - Room 101
  { deviceId: 'A101-LIGHT-1',  name: 'Main Light',    type: 'light',       room: '101', block: 'A' },
  { deviceId: 'A101-FAN-1',    name: 'Ceiling Fan',   type: 'fan',         room: '101', block: 'A' },
  { deviceId: 'A101-AC-1',     name: 'Split AC',      type: 'ac',          room: '101', block: 'A' },
  { deviceId: 'A101-GEYSER-1', name: 'Water Geyser',  type: 'geyser',      room: '101', block: 'A', autoOff: true, autoOffMinutes: 30 },
  // Block A - Room 102
  { deviceId: 'A102-LIGHT-1',  name: 'Main Light',    type: 'light',       room: '102', block: 'A' },
  { deviceId: 'A102-LIGHT-2',  name: 'Study Lamp',    type: 'light',       room: '102', block: 'A' },
  { deviceId: 'A102-FAN-1',    name: 'Ceiling Fan',   type: 'fan',         room: '102', block: 'A' },
  { deviceId: 'A102-AC-1',     name: 'Split AC',      type: 'ac',          room: '102', block: 'A' },
  { deviceId: 'A102-GEYSER-1', name: 'Water Geyser',  type: 'geyser',      room: '102', block: 'A', autoOff: true, autoOffMinutes: 30 },
  // Block B - Room 204
  { deviceId: 'B204-LIGHT-1',  name: 'Main Light',    type: 'light',       room: '204', block: 'B' },
  { deviceId: 'B204-FAN-1',    name: 'Ceiling Fan',   type: 'fan',         room: '204', block: 'B' },
  { deviceId: 'B204-AC-1',     name: 'Split AC',      type: 'ac',          room: '204', block: 'B' },
  { deviceId: 'B204-GEYSER-1', name: 'Water Geyser',  type: 'geyser',      room: '204', block: 'B', autoOff: true, autoOffMinutes: 30 },
  // Block B - Room 209
  { deviceId: 'B209-LIGHT-1',  name: 'Main Light',    type: 'light',       room: '209', block: 'B' },
  { deviceId: 'B209-FAN-1',    name: 'Ceiling Fan',   type: 'fan',         room: '209', block: 'B' },
  // Common Areas
  { deviceId: 'CMN-MOTOR-1',   name: 'Water Motor 1', type: 'water_motor', room: 'common', block: 'A', autoOff: true, autoOffMinutes: 60 },
  { deviceId: 'CMN-MOTOR-2',   name: 'Water Motor 2', type: 'water_motor', room: 'common', block: 'B', autoOff: true, autoOffMinutes: 60 },
  { deviceId: 'CMN-LIGHT-LOBBY', name: 'Lobby Light', type: 'light',       room: 'lobby',  block: 'A', scheduledOnTime: '18:00', scheduledOffTime: '06:00' },
];

// Seed on server start
const seedDevices = async () => {
  try {
    for (const d of DEFAULT_DEVICES) {
      await IoTDevice.findOneAndUpdate(
        { deviceId: d.deviceId },
        { $setOnInsert: d },
        { upsert: true, new: true }
      );
    }
    console.log('✅ IoT Devices seeded');
  } catch (e) {
    console.error('IoT seed failed:', e.message);
  }
};
seedDevices();

// ─── VIRTUAL MQTT SIMULATION ─────────────────────────────────────────────────
// We simulate MQTT by logging the "publish" action and storing in DB
const publishMQTT = (topic, payload) => {
  const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  console.log(`[MQTT] [${ts}] PUBLISH → ${topic} = ${JSON.stringify(payload)}`);
  // In a real system this would be: mqttClient.publish(topic, JSON.stringify(payload))
};

// ─── AUTOMATION ENGINE ────────────────────────────────────────────────────────
// Runs every 60 seconds: enforce auto-off timers
setInterval(async () => {
  try {
    const now = new Date();
    // Auto-off for geyser & water motor
    const devicesToCheck = await IoTDevice.find({ status: true, autoOff: true });
    for (const device of devicesToCheck) {
      if (!device.lastToggled) continue;
      const minutesOn = (now - new Date(device.lastToggled)) / 1000 / 60;
      if (minutesOn >= device.autoOffMinutes) {
        device.status = false;
        device.lastToggled = now;
        await device.save();
        publishMQTT(device.mqttTopic, { status: 'OFF', reason: 'auto-off-timer', device: device.name });
        console.log(`[AUTOMATION] ⚡ Auto-OFF: ${device.name} in Room ${device.room} (was ON for ${minutesOn.toFixed(1)} min)`);
      }
    }
    // Simulate energy usage for ON devices (0.5 kWh per hour = ~0.008 per minute)
    await IoTDevice.updateMany({ status: true }, { $inc: { energyUsed: 0.008 } });
  } catch (e) {
    console.error('Automation engine error:', e.message);
  }
}, 60000);

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// GET /api/iot/devices — all devices (optionally filter by room/block)
router.get('/devices', async (req, res) => {
  try {
    const filter = {};
    if (req.query.room)  filter.room  = req.query.room;
    if (req.query.block) filter.block = req.query.block;
    const devices = await IoTDevice.find(filter).sort({ block: 1, room: 1, type: 1 });
    res.json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/iot/stats — summary stats
router.get('/stats', async (req, res) => {
  try {
    const all    = await IoTDevice.find();
    const on     = all.filter(d => d.status).length;
    const energy = all.reduce((sum, d) => sum + d.energyUsed, 0);
    res.json({
      success: true,
      stats: {
        total:    all.length,
        on,
        off:      all.length - on,
        energyUsed: parseFloat(energy.toFixed(2)),
        byType: {
          lights: all.filter(d => d.type === 'light').length,
          fans:   all.filter(d => d.type === 'fan').length,
          acs:    all.filter(d => d.type === 'ac').length,
          geysers:all.filter(d => d.type === 'geyser').length,
          motors: all.filter(d => d.type === 'water_motor').length,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/iot/toggle/:deviceId — toggle ON/OFF
router.patch('/toggle/:deviceId', async (req, res) => {
  try {
    const device = await IoTDevice.findOne({ deviceId: req.params.deviceId });
    if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

    device.status      = !device.status;
    device.lastToggled = new Date();
    await device.save();

    // Simulate MQTT publish
    publishMQTT(device.mqttTopic, {
      status: device.status ? 'ON' : 'OFF',
      device: device.name,
      room:   device.room,
      block:  device.block,
      timestamp: device.lastToggled
    });

    res.json({ success: true, device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/iot/control/:deviceId — update settings (intensity, temperature, schedule)
router.patch('/control/:deviceId', async (req, res) => {
  try {
    const allowedFields = ['intensity', 'temperature', 'autoOff', 'autoOffMinutes', 'scheduledOnTime', 'scheduledOffTime', 'occupancyBased'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const device = await IoTDevice.findOneAndUpdate(
      { deviceId: req.params.deviceId },
      { $set: updates },
      { new: true }
    );
    if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

    publishMQTT(device.mqttTopic, { ...updates, device: device.name });
    res.json({ success: true, device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/iot/bulk — turn all ON or all OFF for a room/block
router.post('/bulk', async (req, res) => {
  try {
    const { action, room, block, type } = req.body; // action: 'on' | 'off'
    const filter = {};
    if (room)  filter.room  = room;
    if (block) filter.block = block;
    if (type)  filter.type  = type;

    const status = action === 'on';
    const result = await IoTDevice.updateMany(filter, { $set: { status, lastToggled: new Date() } });

    // Simulate bulk MQTT
    publishMQTT(`hostel/${block || 'ALL'}/${room || 'ALL'}/bulk`, { action: action.toUpperCase(), filter });

    res.json({ success: true, modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/iot/mqtt-log — simulated MQTT event log (last 20 events from DB timestamps)
router.get('/activity', async (req, res) => {
  try {
    const recent = await IoTDevice.find({ lastToggled: { $ne: null } })
      .sort({ lastToggled: -1 })
      .limit(15)
      .select('name room block type status lastToggled mqttTopic');

    const log = recent.map(d => ({
      topic:   d.mqttTopic,
      payload: d.status ? 'ON' : 'OFF',
      device:  d.name,
      room:    d.room,
      block:   d.block,
      time:    d.lastToggled
    }));

    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
