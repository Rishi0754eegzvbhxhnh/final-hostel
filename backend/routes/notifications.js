// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const { sendFeeReminderEmail, sendFeeReminderSMS } = require('../services/notificationService');

// In-memory log for demo (replace with MongoDB model in production)
const notificationLog = [];

// POST /api/notifications/send-fee-reminder
router.post('/send-fee-reminder', async (req, res) => {
  const {
    studentId,
    studentName,
    studentEmail,
    phone,
    roomNumber,
    amount,
    daysOverdue,
    lateFee,
    channel, // 'email' | 'sms' | 'both'
  } = req.body;

  if (!studentId || !studentName || !channel) {
    return res.status(400).json({ success: false, error: 'Missing required fields: studentId, studentName, channel' });
  }

  const results = { email: null, sms: null };
  const errors = [];

  try {
    // ── Email ──────────────────────────────────
    if (channel === 'email' || channel === 'both') {
      if (!studentEmail) {
        errors.push('Email channel selected but studentEmail not provided');
      } else {
        results.email = await sendFeeReminderEmail({
          studentName,
          studentEmail,
          roomNumber,
          amount,
          daysOverdue,
          lateFee,
          studentId,
        });
      }
    }

    // ── SMS ────────────────────────────────────
    if (channel === 'sms' || channel === 'both') {
      if (!phone) {
        errors.push('SMS channel selected but phone number not provided');
      } else {
        results.sms = await sendFeeReminderSMS({
          studentName,
          phone,
          roomNumber,
          amount,
          daysOverdue,
        });
      }
    }

    // ── Log the notification ───────────────────
    const logEntry = {
      id: Date.now(),
      studentId,
      studentName,
      studentEmail,
      phone,
      roomNumber,
      amount,
      channel,
      sentAt: new Date().toISOString(),
      results,
    };
    notificationLog.unshift(logEntry);
    if (notificationLog.length > 100) notificationLog.pop(); // cap log

    const success = (results.email?.success !== false) && (results.sms?.success !== false);

    return res.json({
      success,
      message: success
        ? `Reminder sent successfully via ${channel}`
        : 'Partial send — check errors',
      results,
      errors,
      logEntry,
    });

  } catch (err) {
    console.error('Notification route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/notifications/log — View sent notification log
router.get('/log', (req, res) => {
  res.json({ success: true, total: notificationLog.length, data: notificationLog });
});

// POST /api/notifications/bulk-reminder — Send to ALL pending students at once
router.post('/bulk-reminder', async (req, res) => {
  const { students, channel } = req.body;

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ success: false, error: 'students array is required' });
  }

  const summary = { sent: 0, failed: 0, results: [] };

  for (const student of students) {
    const emailResult = (channel === 'email' || channel === 'both') && student.email
      ? await sendFeeReminderEmail({
          studentName: student.studentName,
          studentEmail: student.email,
          roomNumber: student.room,
          amount: student.amount,
          daysOverdue: student.daysOverdue,
          lateFee: student.lateFee,
          studentId: student.studentId,
        })
      : null;

    const smsResult = (channel === 'sms' || channel === 'both') && student.phone
      ? await sendFeeReminderSMS({
          studentName: student.studentName,
          phone: student.phone,
          roomNumber: student.room,
          amount: student.amount,
          daysOverdue: student.daysOverdue,
        })
      : null;

    const ok = emailResult?.success !== false && smsResult?.success !== false;
    ok ? summary.sent++ : summary.failed++;
    summary.results.push({ studentId: student.studentId, studentName: student.studentName, email: emailResult, sms: smsResult, ok });
  }

  res.json({ success: true, summary });
});

module.exports = router;
