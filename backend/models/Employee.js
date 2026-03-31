const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, enum: ['Cook', 'Warden', 'Security Guard', 'Cleaner', 'Electrician', 'Plumber', 'Manager'], required: true },
  salary:     { type: Number, required: true },
  salaryDate: { type: Date, default: Date.now },
  isActive:   { type: Boolean, default: true },
  phone:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
