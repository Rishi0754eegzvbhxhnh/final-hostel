const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/payments/my
router.get('/my', auth, async (req, res) => {
  try {
    const tx = await Transaction.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/payments
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, paymentType } = req.body;
    const tx = new Transaction({
      student: req.user.id,
      title,
      amount,
      paymentType,
      referenceNo: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'successful'
    });
    await tx.save();
    res.status(201).json({ message: 'Payment successful', transaction: tx });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/payments/status - Get payment status and countdown
router.get('/status', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ student: req.user.id }).sort({ createdAt: -1 });
    
    const lastPayment = transactions.find(t => t.status === 'successful');
    const nextDueDate = new Date();
    if (lastPayment) {
      nextDueDate.setTime(lastPayment.createdAt.getTime());
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else {
      nextDueDate.setDate(nextDueDate.getDate() + 30);
    }
    
    const today = new Date();
    const daysLeft = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
    
    const totalPaid = transactions
      .filter(t => t.status === 'successful')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      nextDueDate: nextDueDate.toISOString(),
      daysLeft,
      totalPaid,
      lastPayment: lastPayment || null,
      hasPending: transactions.some(t => t.status === 'pending')
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
