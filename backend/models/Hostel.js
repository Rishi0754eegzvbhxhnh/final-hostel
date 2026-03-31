const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String },
  price: { type: Number, required: true },
  type: { type: String, enum: ['boys', 'girls', 'co-ed'], required: true },
  rating: { type: Number, default: 4.0 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String },
  facilities: [{ type: String }],
  foodIncluded: { type: Boolean, default: false },
  foodType: { type: String, enum: ['veg', 'nonveg', 'both', 'none'], default: 'both' },
  washrooms: { type: String, enum: ['attached', 'shared', 'any'], default: 'any' },
  ac: { type: Boolean, default: false },
  wifi: { type: Boolean, default: true },
  security: { type: Boolean, default: true },
  lateGate: { type: Boolean, default: false },
  studyRoom: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  powerBackup: { type: Boolean, default: true },
  cleaning: { type: Boolean, default: true },
  distanceToCollege: { type: Number },
  ownerName: { type: String },
  ownerPhone: { type: String },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
