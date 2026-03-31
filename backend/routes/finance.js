// backend/routes/finance.js
// MongoDB + Gemini AI — Real-time finance chatbot for hostel owners
const express    = require('express');
const router     = express.Router();
const Transaction = require('../models/Transaction');
const User        = require('../models/User');
const Employee    = require('../models/Employee');
const Expense     = require('../models/Expense');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// SEED DEMO DATA
// ─────────────────────────────────────────────────────────────────────────────
const seedFinanceData = async () => {
  try {
    // Seed Transactions
    const txnCount = await Transaction.countDocuments();
    if (txnCount <= 5) {
      const students = await User.find({ role: 'student' }).limit(10);
      if (students.length > 0) {
        const types   = ['residential', 'meal_plan', 'tuition', 'other'];
        const rooms   = ['101','102','201','202','203','301','302','305','401','402'];
        const titles  = { residential:'Hostel Rent', meal_plan:'Mess Fee', tuition:'Tuition Fee', other:'Electricity Charge' };
        const amounts = { residential:6500, meal_plan:2500, tuition:15000, other:800 };
        const now = new Date();
        for (let i = 0; i < students.length; i++) {
          const s = students[i];
          for (const type of types) {
            for (let m = 0; m < 3; m++) {
              const date = new Date(now);
              date.setMonth(date.getMonth() - m);
              date.setDate(Math.floor(Math.random() * 28) + 1);
              const status = m === 0 && i % 4 === 0 ? 'pending' : 'successful';
              const ref = `TXN-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
              await Transaction.findOneAndUpdate(
                { referenceNo: ref },
                { $setOnInsert: { student: s._id, title: titles[type], amount: amounts[type], paymentType: type, status, room: rooms[i % rooms.length], studentName: s.fullName, referenceNo: ref, createdAt: date, updatedAt: date } },
                { upsert: true }
              );
            }
          }
        }
        console.log('✅ Transactions seeded');
      }
    }

    // Seed Employees
    const empCount = await Employee.countDocuments();
    if (empCount === 0) {
      await Employee.insertMany([
        { name: 'Suresh Kumar',  role: 'Cook',           salary: 15000, salaryDate: new Date('2026-03-05'), phone: '9876500001' },
        { name: 'Ramu Lal',     role: 'Cook',           salary: 14000, salaryDate: new Date('2026-03-05'), phone: '9876500002' },
        { name: 'Govind Singh', role: 'Security Guard', salary: 12000, salaryDate: new Date('2026-03-01'), phone: '9876500003' },
        { name: 'Anil Verma',   role: 'Security Guard', salary: 12000, salaryDate: new Date('2026-03-01'), phone: '9876500004' },
        { name: 'Priya Devi',   role: 'Cleaner',        salary: 10000, salaryDate: new Date('2026-03-03'), phone: '9876500005' },
        { name: 'Rajesh Mishra',role: 'Warden',         salary: 20000, salaryDate: new Date('2026-03-01'), phone: '9876500006' },
        { name: 'Deepak Yadav', role: 'Electrician',    salary: 16000, salaryDate: new Date('2026-03-07'), phone: '9876500007' },
        { name: 'Meena Sharma', role: 'Manager',        salary: 25000, salaryDate: new Date('2026-03-01'), phone: '9876500008' },
      ]);
      console.log('✅ Employees seeded');
    }

    // Seed Expenses (last 3 months)
    const expCount = await Expense.countDocuments();
    if (expCount === 0) {
      const expenseData = [];
      const categories = [
        { category: 'Vegetables',        amounts: [12000, 11500, 13000] },
        { category: 'Groceries',         amounts: [18000, 17000, 19500] },
        { category: 'Electricity',       amounts: [8500,  9000,  7800]  },
        { category: 'Water',             amounts: [2000,  1800,  2100]  },
        { category: 'Gas',               amounts: [4500,  4200,  4800]  },
        { category: 'Maintenance',       amounts: [6000,  3000,  5500]  },
        { category: 'Cleaning Supplies', amounts: [3000,  2800,  3200]  },
      ];
      const now = new Date();
      for (let m = 0; m < 3; m++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - m);
        date.setDate(10);
        for (const cat of categories) {
          expenseData.push({
            category: cat.category,
            amount: cat.amounts[m],
            expenseDate: new Date(date),
            description: `${cat.category} expense for ${date.toLocaleString('en-IN',{month:'long'})}`,
          });
        }
      }
      await Expense.insertMany(expenseData);
      console.log('✅ Expenses seeded');
    }
  } catch (e) {
    console.error('Finance seed error:', e.message);
  }
};

seedFinanceData();

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const periodRange = (period) => {
  const now = new Date();
  if (period === 'today')  { const s = new Date(now); s.setHours(0,0,0,0); return { $gte: s }; }
  if (period === 'week')   { const s = new Date(now); s.setDate(s.getDate()-7); return { $gte: s }; }
  if (period === 'month')  { return { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }; }
  if (period === 'year')   { return { $gte: new Date(now.getFullYear(), 0, 1) }; }
  return {};
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/finance/summary (unchanged - used by Finance AI dashboard charts)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    const [allTxns, totalStudents, employees, expenses] = await Promise.all([
      Transaction.find(),
      User.countDocuments({ role: 'student' }),
      Employee.find({ isActive: true }),
      Expense.find(),
    ]);

    const paid    = allTxns.filter(t => t.status === 'successful');
    const pending = allTxns.filter(t => t.status === 'pending');
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);

    const totalCollected   = paid.reduce((s,t) => s+t.amount, 0);
    const totalPending     = pending.reduce((s,t) => s+t.amount, 0);
    const monthCollection  = paid.filter(t => new Date(t.createdAt) >= monthStart).reduce((s,t)=>s+t.amount,0);
    const todayCollection  = paid.filter(t => new Date(t.createdAt) >= todayStart).reduce((s,t)=>s+t.amount,0);
    const totalSalaries    = employees.reduce((s,e) => s+e.salary, 0);
    const totalExpenses    = expenses.filter(e => new Date(e.expenseDate) >= monthStart).reduce((s,e)=>s+e.amount,0);
    const netProfit        = monthCollection - totalSalaries - totalExpenses;

    const byType = {};
    for (const t of paid) byType[t.paymentType] = (byType[t.paymentType]||0)+t.amount;

    const roomDues = {};
    for (const t of pending) { const r = t.room||'Unknown'; roomDues[r]=(roomDues[r]||0)+t.amount; }
    const topDueRooms = Object.entries(roomDues).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([room,due])=>({room,due}));

    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth()-i);
      const label = d.toLocaleString('en-IN',{month:'short',year:'2-digit'});
      const mStart = new Date(d.getFullYear(),d.getMonth(),1);
      const mEnd   = new Date(d.getFullYear(),d.getMonth()+1,0);
      const total  = paid.filter(t=>new Date(t.createdAt)>=mStart&&new Date(t.createdAt)<=mEnd).reduce((s,t)=>s+t.amount,0);
      monthlyTrend.push({ label, total });
    }

    res.json({
      success: true,
      summary: {
        totalCollected, totalPending, monthCollection, todayCollection,
        totalSalaries, totalExpenses, netProfit,
        totalTransactions: allTxns.length,
        paidCount: paid.length, pendingCount: pending.length,
        totalStudents, byType, topDueRooms, monthlyTrend,
        employeeCount: employees.length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/finance/random-payment ────────────────────────────────────────
// Adds a quick random paid transaction to test real-time P&L changes in the Chatbot
router.post('/random-payment', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).limit(10);
    if (!students.length) return res.status(400).json({ success: false, message: 'No students found' });

    const s = students[Math.floor(Math.random() * students.length)];
    const types = ['residential', 'meal_plan', 'other'];
    const titles = { residential: 'Hostel Rent', meal_plan: 'Mess Fee', other: 'Fine/Late Fee' };
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = type === 'residential' ? 6500 : type === 'meal_plan' ? 2500 : Math.floor(Math.random() * 500) + 100;

    const ref = `TXN-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
    const newTxn = await Transaction.create({
      student: s._id,
      title: titles[type],
      amount,
      paymentType: type,
      status: 'successful',
      room: ['101','102','201','202','203','301','302'][Math.floor(Math.random() * 7)],
      studentName: s.fullName,
      referenceNo: ref
    });

    res.json({ success: true, message: `Random ${titles[type]} payment of ₹${amount} recorded for ${s.fullName}!`, data: newTxn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.room)   filter.room   = req.query.room;
    if (req.query.type)   filter.paymentType = req.query.type;
    if (req.query.period) filter.createdAt = periodRange(req.query.period);
    const txns = await Transaction.find(filter).populate('student','fullName email').sort({createdAt:-1}).limit(50);
    res.json({ success: true, transactions: txns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Employees CRUD
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).sort({ role: 1 });
    res.json({ success: true, data: employees });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Expenses CRUD
router.get('/expenses', async (req, res) => {
  try {
    const filter = {};
    if (req.query.period) filter.expenseDate = periodRange(req.query.period);
    if (req.query.category) filter.category = req.query.category;
    const expenses = await Expense.find(filter).sort({ expenseDate: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/expenses', async (req, res) => {
  try {
    const exp = new Expense(req.body);
    await exp.save();
    res.json({ success: true, data: exp });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/finance/chat — Gemini AI + Live MongoDB Finance Chatbot
// ─────────────────────────────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ success: false, message: 'Query required' });

  try {
    // ── Step 1: Pull LIVE data from MongoDB ─────────────────────────────────
    const now       = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

    const [allTxns, employees, currentMonthExpenses, lastMonthExpenses, totalStudents] = await Promise.all([
      Transaction.find().populate('student','fullName email'),
      Employee.find({ isActive: true }),
      Expense.find({ expenseDate: { $gte: monthStart } }),
      Expense.find({ expenseDate: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      User.countDocuments({ role: 'student' }),
    ]);

    const paid    = allTxns.filter(t => t.status === 'successful');
    const pending = allTxns.filter(t => t.status === 'pending');
    const monthPaid = paid.filter(t => new Date(t.createdAt) >= monthStart);

    // Aggregated financial context
    const rentCollected   = monthPaid.filter(t=>t.paymentType==='residential').reduce((s,t)=>s+t.amount,0);
    const messCollected   = monthPaid.filter(t=>t.paymentType==='meal_plan').reduce((s,t)=>s+t.amount,0);
    const totalCollected  = monthPaid.reduce((s,t)=>s+t.amount,0);
    const totalDues       = pending.reduce((s,t)=>s+t.amount,0);
    const totalSalaries   = employees.reduce((s,e)=>s+e.salary,0);
    const currentExpTotal = currentMonthExpenses.reduce((s,e)=>s+e.amount,0);
    const lastExpTotal    = lastMonthExpenses.reduce((s,e)=>s+e.amount,0);
    const netProfit       = totalCollected - totalSalaries - currentExpTotal;

    // By expense category
    const expByCategory = {};
    for (const e of currentMonthExpenses) expByCategory[e.category] = (expByCategory[e.category]||0)+e.amount;

    // Monthly 6-month trend
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth()-i);
      const mS = new Date(d.getFullYear(),d.getMonth(),1);
      const mE = new Date(d.getFullYear(),d.getMonth()+1,0);
      const income = paid.filter(t=>new Date(t.createdAt)>=mS&&new Date(t.createdAt)<=mE).reduce((s,t)=>s+t.amount,0);
      const exp = (await Expense.find({ expenseDate: { $gte: mS, $lte: mE } })).reduce((s,e)=>s+e.amount,0);
      trend.push({ month: d.toLocaleString('en-IN',{month:'short'}), income, expenses: exp+totalSalaries, net: income-exp-totalSalaries });
    }

    const roomDues = {};
    for (const t of pending) { const r=t.room||'?'; roomDues[r]=(roomDues[r]||0)+t.amount; }
    const topDueRooms = Object.entries(roomDues).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const financeContext = {
      currentMonth: now.toLocaleString('en-IN',{month:'long',year:'numeric'}),
      totalStudents,
      rent: { collected: rentCollected, pending: pending.filter(t=>t.paymentType==='residential').reduce((s,t)=>s+t.amount,0) },
      mess: { collected: messCollected, pending: pending.filter(t=>t.paymentType==='meal_plan').reduce((s,t)=>s+t.amount,0) },
      totalRevenue: { collected: totalCollected, dues: totalDues },
      expenses: { total: currentExpTotal, lastMonth: lastExpTotal, byCategory: expByCategory },
      salaries: { total: totalSalaries, employeeCount: employees.length, breakdown: employees.map(e=>({ name: e.name, role: e.role, salary: e.salary })) },
      netProfit,
      pendingStudentCount: [...new Set(pending.map(t=>t.student?.toString()).filter(Boolean))].length,
      topDueRooms: topDueRooms.map(([room,due])=>({ room, due: `₹${due.toLocaleString('en-IN')}` })),
      sixMonthTrend: trend,
      collectionRate: totalCollected+totalDues>0 ? `${((totalCollected/(totalCollected+totalDues))*100).toFixed(1)}%` : '0%',
    };

    // ── Step 2: Send to Gemini AI with full context ───────────────────────────
    let answer, data = null, type = 'text';

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a smart, concise finance assistant for a hostel owner. 
      
LIVE MONGODB DATA (current month: ${financeContext.currentMonth}):
${JSON.stringify(financeContext, null, 2)}

OWNER'S QUESTION: "${query}"

Instructions:
- Give a clear, actionable answer using ONLY the data above
- Use ₹ symbols and proper Indian number formatting (lakhs/thousands)
- Use emojis to make it engaging (💰 ✅ ⚠️ 📊 📈 etc.)
- If asked for expenses breakdown, list each category
- If asked for salary details, list each employee's role and salary
- Keep answer under 200 words
- End with 1 actionable insight or recommendation
- Respond in markdown bold for key numbers`;

      const result = await model.generateContent(prompt);
      answer = result.response.text();

      // Try to extract table data for specific queries
      const q = query.toLowerCase();
      if (q.includes('expense') || q.includes('category')) {
        data = Object.entries(expByCategory).map(([cat,amt]) => ({ Category: cat, Amount: fmt(amt) }));
        type = 'table';
      } else if (q.includes('salary') || q.includes('employee')) {
        data = employees.map(e => ({ Name: e.name, Role: e.role, Salary: fmt(e.salary) }));
        type = 'table';
      } else if (q.includes('pending') || q.includes('due')) {
        data = topDueRooms.map(([room,due]) => ({ Room: room, 'Due Amount': fmt(due) }));
        type = 'table';
      } else if (q.includes('trend') || q.includes('monthly')) {
        data = trend.map(t => ({ Month: t.month, Income: fmt(t.income), Expenses: fmt(t.expenses), 'Net P&L': fmt(t.net) }));
        type = 'table';
      }
    } catch (aiErr) {
      // Graceful fallback if Gemini quota exceeded
      console.warn('Gemini AI error, using structured fallback:', aiErr.message);
      answer = buildFallbackAnswer(query, financeContext);
    }

    res.json({ success: true, answer, data, type, context: financeContext });
  } catch (err) {
    console.error('Finance chat error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Fallback answer builder (no AI needed)
// ─────────────────────────────────────────────────────────────────────────────
function buildFallbackAnswer(query, ctx) {
  const q = query.toLowerCase();
  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  if (q.includes('expense') || q.includes('grocery') || q.includes('food cost')) {
    const cats = Object.entries(ctx.expenses.byCategory).map(([c,a])=>`• ${c}: ${fmt(a)}`).join('\n');
    return `📦 **${ctx.currentMonth} Expenses: ${fmt(ctx.expenses.total)}**\n\n${cats}\n\n💡 Expenses ${ctx.expenses.total > ctx.expenses.lastMonth ? 'increased' : 'decreased'} by ${fmt(Math.abs(ctx.expenses.total - ctx.expenses.lastMonth))} vs last month.`;
  }
  if (q.includes('salary') || q.includes('employee')) {
    const list = ctx.salaries.breakdown.map(e=>`• ${e.name} (${e.role}): ${fmt(e.salary)}`).join('\n');
    return `👥 **Staff Salaries — ${ctx.currentMonth}: ${fmt(ctx.salaries.total)}**\n\n${list}\n\n💡 Salary bill is ${((ctx.salaries.total/ctx.totalRevenue.collected)*100).toFixed(1)}% of your revenue.`;
  }
  if (q.includes('profit') || q.includes('net') || q.includes('balance')) {
    return `📊 **${ctx.currentMonth} P&L**\n\n💰 Revenue: **${fmt(ctx.totalRevenue.collected)}**\n👥 Salaries: **${fmt(ctx.salaries.total)}**\n📦 Expenses: **${fmt(ctx.expenses.total)}**\n\n🏆 **Net Profit: ${fmt(ctx.netProfit)}**\n\n💡 Collection rate is ${ctx.collectionRate} — recover ${fmt(ctx.totalRevenue.dues)} in dues for better margins.`;
  }
  if (q.includes('summary') || q.includes('overview') || q.includes('march') || q.includes('april')) {
    return `📊 **Finance Summary — ${ctx.currentMonth}**\n\n💰 Rent Collected: ${fmt(ctx.rent.collected)}\n🍽️ Mess Fees: ${fmt(ctx.mess.collected)}\n👥 Salaries: ${fmt(ctx.salaries.total)}\n📦 Expenses: ${fmt(ctx.expenses.total)}\n⚠️ Dues: ${fmt(ctx.totalRevenue.dues)}\n\n**🏆 Net Profit: ${fmt(ctx.netProfit)}**\n\n💡 ${ctx.pendingStudentCount} students have pending dues.`;
  }
  return `📊 **Quick Finance Overview for ${ctx.currentMonth}:**\n\n• Revenue: ${fmt(ctx.totalRevenue.collected)}\n• Pending Dues: ${fmt(ctx.totalRevenue.dues)}\n• Salaries: ${fmt(ctx.salaries.total)}\n• Expenses: ${fmt(ctx.expenses.total)}\n• Net Profit: **${fmt(ctx.netProfit)}**\n• Collection Rate: ${ctx.collectionRate}\n\nAsk me about: *expenses*, *salaries*, *pending dues*, *monthly trend*, or *profit forecast*.`;
}

module.exports = router;
