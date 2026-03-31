import React, { useState, useEffect } from 'react';
import './SampleData.css';

const SampleDashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes, bookRes, notifRes, feesRes] = await Promise.all([
          fetch('http://localhost:5000/api/sample/dashboard-stats'),
          fetch('http://localhost:5000/api/sample/transactions'),
          fetch('http://localhost:5000/api/sample/bookings'),
          fetch('http://localhost:5000/api/sample/notifications'),
          fetch('http://localhost:5000/api/sample/pending-fees')
        ]);
        
        setStats((await statsRes.json()).stats);
        setTransactions((await transRes.json()).data);
        setBookings((await bookRes.json()).data);
        setNotifications((await notifRes.json()).data);
        setPendingFees((await feesRes.json()).data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard - Sample Data</h1>
      
      <div className="dashboard-stats">
        <div className="dashboard-stat">
          <h3>{stats.totalRooms}</h3>
          <p>Total Rooms</p>
        </div>
        <div className="dashboard-stat">
          <h3>{stats.occupiedRooms}</h3>
          <p>Occupied</p>
        </div>
        <div className="dashboard-stat">
          <h3>{stats.availableRooms}</h3>
          <p>Available</p>
        </div>
        <div className="dashboard-stat warning">
          <h3>{stats.occupancyRate}%</h3>
          <p>Occupancy Rate</p>
        </div>
        <div className="dashboard-stat danger">
          <h3>₹{stats.pendingAmount.toLocaleString()}</h3>
          <p>Pending Amount</p>
        </div>
        <div className="dashboard-stat danger">
          <h3>{stats.pendingCount}</h3>
          <p>Pending Fees</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Recent Transactions</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td>{t.studentName}</td>
                  <td>{t.room}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.type}</td>
                  <td>
                    <span className={`status-badge-table ${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <h2>Bookings</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.studentName}</td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td>
                    <span className={`status-badge-table ${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <h2>Pending Fees</h2>
          {pendingFees.map((fee, i) => (
            <div key={i} className="pending-fee-card">
              <div className="student-info">
                <h4>{fee.studentName}</h4>
                <p>Room {fee.room} • {fee.daysOverdue} days overdue</p>
              </div>
              <div className="fee-amount">
                <h4>₹{fee.amount}</h4>
                <p>Reminders: {fee.reminderCount}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-section">
          <h2>Recent Notifications</h2>
          {notifications.map(n => (
            <div key={n.id} className="notification-card">
              <h4>{n.studentName}</h4>
              <p>{n.message}</p>
              <div className="channels">
                {n.sentVia.map((c, i) => (
                  <span key={i} className="channel-badge">{c.toUpperCase()}</span>
                ))}
                <span className={`status-badge-table ${n.status}`}>{n.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SampleDashboard;
