const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  category:    {
    type: String,
    enum: ['Vegetables', 'Groceries', 'Electricity', 'Water', 'Gas', 'Maintenance', 'Repairs', 'Cleaning Supplies', 'Medicine', 'Other'],
    required: true
  },
  description: { type: String },
  amount:      { type: Number, required: true },
  expenseDate: { type: Date, default: Date.now },
  paidBy:      { type: String, default: 'Admin' },
  receipt:     { type: String }, // URL or reference
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
