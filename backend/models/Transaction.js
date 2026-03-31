const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'refunded'],
    default: 'successful',
  },
  referenceNo: {
    type: String,
    required: true,
    unique: true,
  },
  paymentType: {
    type: String,
    enum: ['tuition', 'residential', 'meal_plan', 'other'],
    required: true,
  },
  room: { type: String, default: null },
  studentName: { type: String, default: null },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
