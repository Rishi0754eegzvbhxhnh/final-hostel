const mongoose = require('mongoose');

const iotDeviceSchema = new mongoose.Schema({
  deviceId:   { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  type:       { type: String, enum: ['light', 'fan', 'ac', 'geyser', 'water_motor'], required: true },
  room:       { type: String, required: true },
  block:      { type: String, default: 'A' },
  status:     { type: Boolean, default: false },         // false = OFF, true = ON
  intensity:  { type: Number, default: 100, min: 0, max: 100 }, // for fans/ACs (%)
  temperature:{ type: Number, default: 24 },             // for ACs (°C)
  autoOff:    { type: Boolean, default: false },          // auto-off timer enabled
  autoOffMinutes: { type: Number, default: 30 },          // auto-off after N minutes
  scheduledOnTime:  { type: String, default: null },      // "06:00" format
  scheduledOffTime: { type: String, default: null },      // "09:00" format
  occupancyBased: { type: Boolean, default: false },      // auto-off if room vacant
  energyUsed: { type: Number, default: 0 },               // kWh (simulated)
  lastToggled: { type: Date, default: null },
  mqttTopic:  { type: String },
}, { timestamps: true });

// Auto-generate MQTT topic before save
iotDeviceSchema.pre('save', function(next) {
  if (!this.mqttTopic) {
    this.mqttTopic = `hostel/${this.block}/${this.room}/${this.type}`;
  }
  next();
});

module.exports = mongoose.model('IoTDevice', iotDeviceSchema);
