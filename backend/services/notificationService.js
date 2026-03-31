// backend/services/notificationService.js
// Handles Email + SMS (simulated) notifications for fee reminders

const HOSTEL_NAME = process.env.HOSTEL_NAME || 'Smart Hostel Management System';

// ─────────────────────────────────────────────
// EMAIL via Nodemailer + Gmail SMTP
// ─────────────────────────────────────────────
const sendFeeReminderEmail = async ({ studentName, studentEmail, roomNumber, amount, daysOverdue, lateFee, studentId }) => {
  try {
    const nodemailer = require('nodemailer');

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass || pass === 'your_16_char_app_password_here') {
      // DEMO MODE: Return simulated success with preview
      console.log(`📧 [DEMO EMAIL] Would send to ${studentEmail} about fee of ₹${amount}`);
      return {
        success: true,
        mode: 'demo',
        message: `Demo email logged for ${studentEmail}. Configure GMAIL_APP_PASSWORD in .env for live sending.`,
        preview: buildEmailHTML({ studentName, roomNumber, amount, daysOverdue, lateFee, studentId }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const html = buildEmailHTML({ studentName, roomNumber, amount, daysOverdue, lateFee, studentId });

    const info = await transporter.sendMail({
      from: `"${HOSTEL_NAME}" <${user}>`,
      to: studentEmail,
      subject: `⚠️ Fee Payment Reminder — Room ${roomNumber} | ${HOSTEL_NAME}`,
      html,
    });

    console.log(`✅ Email sent to ${studentEmail}: ${info.messageId}`);
    return { success: true, mode: 'live', messageId: info.messageId };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────
// SMS - Realistic simulation (logged to console & DB)
// Replace with Fast2SMS / Msg91 API calls when available
// ─────────────────────────────────────────────
const sendFeeReminderSMS = async ({ studentName, phone, roomNumber, amount, daysOverdue }) => {
  try {
    const message = `[${HOSTEL_NAME}] Dear ${studentName}, your hostel fee of Rs.${amount} for Room ${roomNumber} is ${daysOverdue > 0 ? `OVERDUE by ${daysOverdue} days` : 'due soon'}. Please pay immediately to avoid late charges. -Hostel Admin`;

    console.log(`📱 [SMS] To: ${phone}`);
    console.log(`📱 [SMS] Message: ${message}`);

    // ── Plug in your SMS provider here ──────────────────
    // OPTION A: Fast2SMS (Indian free tier)
    // const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
    //   route: 'q', numbers: phone, message, language: 'english', flash: 0
    // }, { headers: { authorization: process.env.FAST2SMS_KEY } });

    // OPTION B: Msg91 (popular in India)
    // await axios.post('https://api.msg91.com/api/v5/otp', {...})

    // Simulated response for demo
    await new Promise(resolve => setTimeout(resolve, 300)); // realistic delay

    return {
      success: true,
      mode: 'demo',
      message: `SMS logged for ${phone}. Integrate Fast2SMS/Msg91 API for live sending.`,
      smsContent: message,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────
// HTML Email Template
// ─────────────────────────────────────────────
const buildEmailHTML = ({ studentName, roomNumber, amount, daysOverdue, lateFee, studentId }) => {
  const totalDue = amount + (lateFee || 0);
  const urgencyColor = daysOverdue > 20 ? '#dc2626' : daysOverdue > 0 ? '#d97706' : '#2563eb';
  const urgencyLabel = daysOverdue > 20 ? '🔴 CRITICALLY OVERDUE' : daysOverdue > 0 ? '🟡 OVERDUE' : '🔵 DUE SOON';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🏠</div>
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:800;letter-spacing:-0.5px;">${HOSTEL_NAME}</h1>
      <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Student Fee Payment Reminder</p>
    </div>

    <!-- Urgency Badge -->
    <div style="background:${urgencyColor};color:#fff;text-align:center;padding:12px;font-weight:800;font-size:13px;letter-spacing:1px;">
      ${urgencyLabel}${daysOverdue > 0 ? ` — ${daysOverdue} DAYS PAST DUE` : ''}
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="font-size:16px;color:#1e293b;margin:0 0 24px;">Dear <strong>${studentName}</strong>,</p>
      
      <p style="color:#475569;line-height:1.7;margin:0 0 24px;">
        This is a formal reminder that your hostel fee payment is ${daysOverdue > 0 ? `<strong style="color:${urgencyColor}">overdue by ${daysOverdue} days</strong>` : 'due soon'}. 
        Please make the payment at the earliest to avoid additional late charges and hostel entry restrictions.
      </p>

      <!-- Fee Summary Box -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
        <h3 style="margin:0 0 16px;color:#1e293b;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Payment Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Student ID</td>
            <td style="padding:10px 0;font-weight:700;font-family:monospace;color:#1e293b;">${studentId}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Room Number</td>
            <td style="padding:10px 0;font-weight:700;color:#1e293b;">${roomNumber}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Fee Amount</td>
            <td style="padding:10px 0;font-weight:700;color:#1e293b;">₹${amount.toLocaleString()}</td>
          </tr>
          ${lateFee > 0 ? `
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#dc2626;font-size:14px;">Late Fee (penalty)</td>
            <td style="padding:10px 0;font-weight:700;color:#dc2626;">+ ₹${lateFee}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:12px 0 0;color:#1e293b;font-size:16px;font-weight:800;">Total Due</td>
            <td style="padding:12px 0 0;font-weight:900;font-size:20px;color:${urgencyColor};">₹${totalDue.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:28px 0;">
        <a href="http://localhost:5173/payment" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:50px;font-weight:800;font-size:15px;letter-spacing:0.5px;">
          💳 Pay Now Online →
        </a>
      </div>

      <!-- Rules -->
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#991b1b;font-size:13px;font-weight:600;">
          ⚠️ <strong>Important:</strong> Non-payment beyond 30 days may result in hostel exit restrictions. 
          A late fee of ₹50/day is applicable after the due date.
        </p>
      </div>

      <p style="color:#94a3b8;font-size:12px;margin:0;">
        If you have already made the payment, please ignore this message or contact the hostel office with your receipt.
        <br>Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        ${HOSTEL_NAME} · Automated Notification System<br>
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = { sendFeeReminderEmail, sendFeeReminderSMS };
