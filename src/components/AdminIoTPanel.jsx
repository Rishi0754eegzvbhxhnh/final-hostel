import React, { useState, useEffect, useRef } from 'react';

const BACKEND = 'http://127.0.0.1:5000';

const TYPE_META = {
  light:  { icon: '💡', color: '#f59e0b', bg: '#fffbeb', label: 'Light' },
  fan:    { icon: '🌀', color: '#3b82f6', bg: '#eff6ff', label: 'Fan' },
  ac:     { icon: '❄️', color: '#06b6d4', bg: '#ecfeff', label: 'AC' },
  geyser: { icon: '🔥', color: '#ef4444', bg: '#fef2f2', label: 'Geyser' },
  motor:  { icon: '💧', color: '#8b5cf6', bg: '#f5f3ff', label: 'Motor' },
};

const Toggle = ({ on, onToggle, disabled }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    style={{
      width: '52px', height: '28px', borderRadius: '14px', border: 'none',
      background: on ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e2e8f0',
      position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.3s', flexShrink: 0,
      boxShadow: on ? '0 0 12px rgba(34,197,94,0.4)' : 'none',
    }}
  >
    <span style={{
      position: 'absolute', top: '3px',
      left: on ? '27px' : '3px',
      width: '22px', height: '22px', borderRadius: '50%',
      background: 'white', transition: 'left 0.3s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    }} />
  </button>
);

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
    <div style={{ fontSize: '28px', width: '48px', height: '48px', borderRadius: '14px', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '3px' }}>{label}</div>
    </div>
  </div>
);

export default function AdminIoTPanel() {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({});
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterRoom, setFilterRoom] = useState('All');
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const activityRef = useRef(null);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [devRes, statsRes, actRes] = await Promise.all([
        fetch(`${BACKEND}/api/iot/devices`).then(r => r.json()),
        fetch(`${BACKEND}/api/iot/stats`).then(r => r.json()),
        fetch(`${BACKEND}/api/iot/activity`).then(r => r.json()),
      ]);
      if (devRes.success) setDevices(devRes.devices || []);
      if (statsRes.success) setStats(statsRes.stats);
      if (actRes.success) setActivity(actRes.activity || []);
    } catch (e) {
      console.error('IoT fetch error:', e);
    }
    setLoading(false);
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/iot/activity`).then(r => r.json());
      if (res.success) setActivity(res.activity || []);
    } catch {}
  };

  const toggleDevice = async (deviceId) => {
    setToggling(p => ({ ...p, [deviceId]: true }));
    try {
      const res = await fetch(`${BACKEND}/api/iot/toggle/${deviceId}`, { method: 'PATCH' }).then(r => r.json());
      if (res.success) {
        setDevices(prev => prev.map(d => d._id === deviceId ? { ...d, status: !d.status } : d));
        fetchActivity();
        const devRes = await fetch(`${BACKEND}/api/iot/stats`).then(r => r.json());
        if (devRes.success) setStats(devRes.stats);
      }
    } catch {}
    setToggling(p => ({ ...p, [deviceId]: false }));
  };

  const bulkAction = async (action, type = null, room = null) => {
    setBulkLoading(true);
    try {
      await fetch(`${BACKEND}/api/iot/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type, room }),
      });
      await fetchAll();
    } catch {}
    setBulkLoading(false);
  };

  // Derive unique blocks and rooms
  const blocks = ['All', ...new Set(devices.map(d => d.block).filter(Boolean))];
  const rooms  = ['All', ...new Set(
    devices.filter(d => filterBlock === 'All' || d.block === filterBlock).map(d => d.room).filter(Boolean)
  )];

  const filtered = devices.filter(d => {
    if (filterBlock !== 'All' && d.block !== filterBlock) return false;
    if (filterRoom  !== 'All' && d.room  !== filterRoom)  return false;
    return true;
  });

  const onCount  = devices.filter(d => d.status).length;
  const offCount = devices.length - onCount;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', color: '#64748b' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading IoT devices...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (devices.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔌</div>
      <h3 style={{ color: '#475569', fontWeight: 800 }}>No IoT Devices Found</h3>
      <p style={{ color: '#94a3b8', marginTop: '6px' }}>Restart the backend — devices will auto-seed on startup.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard icon="✅" label="Devices ON"  value={onCount}  color="#16a34a" />
        <StatCard icon="⭕" label="Devices OFF" value={offCount} color="#64748b" />
        <StatCard icon="⚡" label="kWh Used"    value={stats?.totalEnergyUsed?.toFixed(2) ?? '0.00'} color="#f59e0b" />
        <StatCard icon="📡" label="Total Devices" value={devices.length} color="#1d4ed8" />
      </div>

      {/* ── Filters & Bulk Actions ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', background: 'white', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        {/* Block filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {blocks.map(b => (
            <button key={b} onClick={() => { setFilterBlock(b); setFilterRoom('All'); }}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer', background: filterBlock === b ? '#1d4ed8' : '#f1f5f9', color: filterBlock === b ? 'white' : '#475569', transition: 'all 0.2s' }}>
              {b === 'All' ? '🌐 All Blocks' : `🏢 ${b}`}
            </button>
          ))}
        </div>

        {/* Room filter */}
        <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 700, color: '#475569', background: '#f8fafc', cursor: 'pointer' }}>
          {rooms.map(r => <option key={r} value={r}>{r === 'All' ? 'All Rooms' : `Room ${r}`}</option>)}
        </select>

        {/* Bulk buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {[
            { label: '⚡ ALL ON',    action: 'on',  color: '#16a34a' },
            { label: '🌑 ALL OFF',   action: 'off', color: '#dc2626' },
            { label: '❄️ ACs OFF',  action: 'off', type: 'ac',    color: '#0891b2' },
            { label: '💡 Lights OFF',action: 'off', type: 'light', color: '#d97706' },
          ].map(b => (
            <button key={b.label} onClick={() => bulkAction(b.action, b.type || null)}
              disabled={bulkLoading}
              style={{ padding: '7px 13px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '11px', cursor: 'pointer', background: b.color, color: 'white', opacity: bulkLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Device Grid + Live Feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        {/* Device cards */}
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>
            {filtered.filter(d => d.status).length} ON · {filtered.filter(d => !d.status).length} OFF · {filtered.length} total
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {filtered.map(device => {
              const meta = TYPE_META[device.type] || TYPE_META.light;
              const isExpanded = expandedDevice === device._id;
              return (
                <div key={device._id} style={{
                  background: device.status ? meta.bg : 'white',
                  borderRadius: '18px', padding: '18px',
                  border: `1.5px solid ${device.status ? meta.color + '44' : '#e2e8f0'}`,
                  boxShadow: device.status ? `0 4px 20px ${meta.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ fontSize: '24px', width: '44px', height: '44px', borderRadius: '12px', background: meta.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e293b' }}>{device.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{meta.label} · Room {device.room} · {device.block}</div>
                      </div>
                    </div>
                    <Toggle on={device.status} onToggle={() => toggleDevice(device._id)} disabled={!!toggling[device._id]} />
                  </div>

                  {/* Status row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: device.status ? meta.color : '#94a3b8' }}>
                      {device.status ? '● ON' : '○ OFF'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      ⚡ {(device.energyUsed || 0).toFixed(2)} kWh
                    </span>
                    {device.autoOffMinutes && (
                      <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>
                        🕐 Auto-off: {device.autoOffMinutes}min
                      </span>
                    )}
                  </div>

                  {/* Expand toggle */}
                  <button onClick={() => setExpandedDevice(isExpanded ? null : device._id)}
                    style={{ marginTop: '10px', width: '100%', padding: '6px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '11px', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
                    {isExpanded ? '▲ Hide Controls' : '▼ Advanced Controls'}
                  </button>

                  {/* Advanced controls */}
                  {isExpanded && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {device.type === 'ac' && (
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>Temperature: {device.temperature || 24}°C</label>
                          <input type="range" min="16" max="30" value={device.temperature || 24}
                            style={{ width: '100%', accentColor: meta.color }}
                            onChange={e => setDevices(prev => prev.map(d => d._id === device._id ? { ...d, temperature: +e.target.value } : d))}
                          />
                        </div>
                      )}
                      {device.type === 'fan' && (
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>Speed: {device.intensity || 3}/5</label>
                          <input type="range" min="1" max="5" value={device.intensity || 3}
                            style={{ width: '100%', accentColor: meta.color }}
                            onChange={e => setDevices(prev => prev.map(d => d._id === device._id ? { ...d, intensity: +e.target.value } : d))}
                          />
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: '#475569' }}>
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: '3px' }}>Schedule ON</div>
                          <input type="time" defaultValue={device.scheduleOn || '06:00'} style={{ width: '100%', padding: '5px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: '3px' }}>Schedule OFF</div>
                          <input type="time" defaultValue={device.scheduleOff || '22:00'} style={{ width: '100%', padding: '5px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MQTT Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '80px' }}>
          {/* Live feed */}
          <div style={{ background: '#0f172a', borderRadius: '18px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>📡</span>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '13px' }}>MQTT Activity Feed</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />LIVE
              </span>
            </div>
            <div ref={activityRef} style={{ height: '280px', overflowY: 'auto', padding: '12px' }}>
              {activity.length === 0 ? (
                <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', padding: '40px 0' }}>No activity yet. Toggle a device!</p>
              ) : (
                activity.map((a, i) => (
                  <div key={i} style={{ marginBottom: '8px', padding: '8px 10px', background: '#1e293b', borderRadius: '10px', borderLeft: `3px solid ${a.status ? '#22c55e' : '#ef4444'}` }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>{a.topic}</div>
                    <div style={{ fontSize: '12px', color: 'white', fontWeight: 700 }}>
                      {a.status ? '▶' : '⏹'} {a.status ? 'ON' : 'OFF'} · {a.deviceName}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      {new Date(a.timestamp).toLocaleTimeString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Automation Rules */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e293b', marginBottom: '12px' }}>🤖 Automation Rules</div>
            {[
              { icon: '🔥', label: 'Geyser auto-off', value: '30 min', color: '#ef4444' },
              { icon: '💧', label: 'Motor auto-off',  value: '45 min', color: '#8b5cf6' },
              { icon: '❄️', label: 'AC eco-mode',    value: '25°C',    color: '#06b6d4' },
              { icon: '⚡', label: 'Energy alert',   value: '>5 kWh',  color: '#f59e0b' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px' }}>{r.icon}</span>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{r.label}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: r.color, background: r.color + '15', padding: '3px 8px', borderRadius: '8px' }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* AI Suggestions */}
          {stats && (
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3730a3)', borderRadius: '18px', padding: '16px', color: 'white' }}>
              <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '10px' }}>💡 AI Suggestions</div>
              {stats.onCount > 10
                ? <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.5 }}>⚠️ High load: {stats.onCount} devices active. Consider turning off idle devices to save energy.</p>
                : <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.5 }}>✅ Energy usage is optimal. {stats.onCount} devices running efficiently.</p>
              }
              {stats.byType?.geyser > 0 && <p style={{ fontSize: '12px', opacity: 0.85, marginTop: '6px', lineHeight: 1.5 }}>🔥 {stats.byType.geyser} geyser(s) ON — will auto-off after 30 minutes.</p>}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
