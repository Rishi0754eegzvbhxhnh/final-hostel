import React, { useState, useEffect, useRef } from 'react';
import './HostelSmartOS.css';

// ============================================================
// MOCK DATA 
// ============================================================
const DEMO_ARTICLES = {
  general:[
    {title:"G20 Leaders Reach Historic Climate Agreement on Carbon Emissions",description:"World leaders at the G20 summit have agreed to cut carbon emissions by 50% before 2040.",source:{name:"Reuters"},publishedAt:new Date().toISOString(),url:"#"},
    {title:"New UN Report: Global Poverty Rates Hit Record Low Since 1990",description:"The United Nations released a comprehensive report showing extreme global poverty has dropped to under 5%.",source:{name:"UN News"},publishedAt:new Date().toISOString(),url:"#"},
  ],
  technology:[
    {title:"OpenAI Launches GPT-5 with Real-Time Reasoning Capabilities",description:"OpenAI's latest model achieves near-human reasoning on complex scientific and mathematical tasks.",source:{name:"TechCrunch"},publishedAt:new Date().toISOString(),url:"#"},
    {title:"India's Semiconductor Industry Surges: ₹2 Lakh Crore Investment",description:"Major global chipmakers commit to building fabrication plants in India.",source:{name:"Economic Times"},publishedAt:new Date().toISOString(),url:"#"},
  ]
};

const HOSTEL_ROOMS = [
  {id:'204',type:'AC Double',floor:2,rent:'₹6,500/mo',near:'Study Hall',status:'occupied'},
  {id:'209',type:'AC Single',floor:2,rent:'₹8,000/mo',near:'Library',status:'available'},
  {id:'215',type:'Non-AC',floor:2,rent:'₹4,000/mo',near:'Garden',status:'maintenance'},
  {id:'101',type:'AC Suite',floor:1,rent:'₹10,000/mo',near:'Reception',status:'occupied'},
  {id:'401',type:'AC Double',floor:4,rent:'₹6,500/mo',near:'Terrace',status:'available'},
  {id:'312',type:'Non-AC',floor:3,rent:'₹4,000/mo',near:'Mess Hall',status:'available'},
];

const HOSTEL_EVENTS = [
  {title:'Coding Hackathon',when:'Sat, Mar 29 · 10:00 AM',where:'Common Hall',icon:'💻',tag:'Tech',tagClass:'tech'},
  {title:'Cultural Night',when:'Sun, Mar 30 · 6:00 PM',where:'Open Air Stage',icon:'🎭',tag:'Culture',tagClass:'culture'},
  {title:'Yoga Morning',when:'Wed, Apr 2 · 7:00 AM',where:'Terrace Garden',icon:'🧘',tag:'Health',tagClass:'health'},
];

// ============================================================
// COMPONENTS
// ============================================================
const Sidebar = ({ activePanel, setActivePanel }) => {
  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', section: 'Main' },
    { id: 'rooms', icon: '🛏', label: 'Rooms', badge: { text: '12', type: 'green' }, section: 'Main' },
    { id: 'events', icon: '📅', label: 'Events', badge: { text: '3', type: 'blue' }, section: 'Main' },
    { id: 'iot', icon: '💡', label: 'Smart Control', badge: { text: 'IoT', type: 'green' }, section: 'Main' },
    { id: 'news', icon: '🌍', label: 'Global News', badge: { text: 'Live' }, section: 'Information' },
    { id: 'digest', icon: '📰', label: 'Daily Digest', section: 'Information' },
    { id: 'ai', icon: '🤖', label: 'AI Assistant', section: 'Information' },
    { id: 'preferences', icon: '⚙️', label: 'Preferences', section: 'Settings' },
    { id: 'analytics', icon: '📊', label: 'Analytics', section: 'Settings' },
  ];

  const renderSection = (sectionName) => (
    <div className="nav-section" key={sectionName}>
      <div className="nav-label">{sectionName}</div>
      {navItems.filter(i => i.section === sectionName).map(item => (
        <div key={item.id} className={`nav-item ${activePanel === item.id ? 'active' : ''}`} onClick={() => setActivePanel(item.id)}>
          <span className="icon">{item.icon}</span> {item.label}
          {item.badge && <span className={`nav-badge ${item.badge.type || ''}`}>{item.badge.text}</span>}
        </div>
      ))}
    </div>
  );

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🏠</div>
        <div>
          <div className="logo-text">HostelOS</div>
          <div className="logo-sub">v2.4.1 · SMART</div>
        </div>
      </div>
      <nav className="nav-menu">
        {['Main', 'Information', 'Settings'].map(renderSection)}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">RK</div>
          <div className="user-info">
            <div className="user-name">Rahul Kumar</div>
            <div className="user-role">Room 204 · Block A</div>
          </div>
          <span style={{color:'var(--text3)',fontSize:'14px'}}>⋯</span>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ activePanel, setActivePanel }) => {
  const titles = {
    dashboard: <>Dashboard <span>Overview</span></>, rooms: <>Room <span>Management</span></>,
    events: <>Hostel <span>Events</span></>, news: <>Global <span>News Hub</span></>,
    ai: <>AI <span>Assistant</span></>,
    iot: <>Smart IoT <span>Control Panel</span></>
  };
  return (
    <div className="topbar">
      <div className="topbar-title">{titles[activePanel] || <span style={{textTransform:'capitalize'}}>{activePanel}</span>}</div>
      <div className="topbar-actions">
        <div className="search-bar">
          <span style={{color:'var(--text3)',fontSize:'14px'}}>🔍</span>
          <input type="text" placeholder="Search rooms, news, events…" />
        </div>
        <div className="icon-btn" onClick={() => setActivePanel('ai')} style={{position:'relative'}}>
          🤖<span className="notif-dot"></span>
        </div>
        <div className="icon-btn">🔔<span className="notif-dot"></span></div>
      </div>
    </div>
  );
};

// ============================================================
// PANELS
// ============================================================
const DashboardPanel = ({ setActivePanel }) => {
  const [alertOpen, setAlertOpen] = useState(true);
  return (
    <div className="panel active">
      {alertOpen && (
        <div className="alerts-banner">
          <div className="alerts-banner-icon">⚡</div>
          <div className="alerts-banner-text">
            <strong>Breaking:</strong> New hostel welfare scheme — <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={()=>setActivePanel('news')}>Read more →</span>
          </div>
          <span className="alerts-dismiss" onClick={() => setAlertOpen(false)}>✕</span>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card blue"><div className="stat-icon">🏠</div><div className="stat-value">248</div><div className="stat-label">Total Rooms</div></div>
        <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-value">12</div><div className="stat-label">Available Now</div></div>
        <div className="stat-card purple"><div className="stat-icon">👥</div><div className="stat-value">486</div><div className="stat-label">Residents</div></div>
        <div className="stat-card orange"><div className="stat-icon">🎉</div><div className="stat-value">3</div><div className="stat-label">Events</div></div>
      </div>

      <div className="grid-2" style={{marginBottom:'16px'}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Upcoming Events</div>
            <span className="card-action" onClick={() => setActivePanel('events')}>View all →</span>
          </div>
          <div className="event-list">
            {HOSTEL_EVENTS.map((e,i) => (
              <div className="event-item" key={i}>
                <div className="event-date-box"><div className="event-day">29</div><div className="event-month">Mar</div></div>
                <div className="event-info"><div className="event-title">{e.title}</div><div className="event-meta">{e.when} · {e.where}</div></div>
                <div className={`event-tag ${e.tagClass}`}>{e.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📢 Announcements</div><span className="card-action">Mark all read</span></div>
          <div className="announcement info"><div className="announcement-title">🔧 Maintenance: Block B</div><div className="announcement-text">Elevators offline 9–11 AM on March 30.</div></div>
          <div className="announcement success"><div className="announcement-title">✅ Mess Menu Updated</div><div className="announcement-text">New April menu is available. Sunday brunch added.</div></div>
        </div>
      </div>
    </div>
  );
};

const RoomsPanel = () => {
  const [filter, setFilter] = useState('all');
  const [rooms, setRooms] = useState(HOSTEL_ROOMS);

  const bookRoom = (id, rent, floor) => {
    if(window.confirm(`Book Room ${id} (Floor ${floor})?\nRent: ${rent}`)) {
      setRooms(prev => prev.map(r => r.id === id ? {...r, status:'occupied'} : r));
      alert(`✅ Room ${id} booked successfully!`);
    }
  };

  return (
    <div className="panel active">
      <div className="section-title">Room Management</div>
      <div className="section-sub">Browse and book available rooms across all blocks</div>
      <div className="stats-row" style={{gridTemplateColumns:'repeat(4,1fr)', marginBottom:'20px'}}>
        <div className="stat-card green"><div className="stat-icon">🟢</div><div className="stat-value">{rooms.filter(r=>r.status==='available').length}</div><div className="stat-label">Available</div></div>
        <div className="stat-card" style={{borderColor:'rgba(240,82,82,.3)'}}><div className="stat-icon">🔴</div><div className="stat-value">{rooms.filter(r=>r.status==='occupied').length}</div><div className="stat-label">Occupied</div></div>
      </div>
      <div className="tabs" style={{marginBottom:'20px'}}>
        {['all', '1', '2', '3', '4'].map(f => (
          <div key={f} className={`tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Floors' : `Floor ${f}`}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="legend">
          <div className="legend-item"><div className="legend-dot available"></div>Available</div>
          <div className="legend-item"><div class="legend-dot occupied"></div>Occupied</div>
          <div className="legend-item"><div className="legend-dot maintenance"></div>Maintenance</div>
        </div>
        <div className="room-grid">
          {rooms.filter(r=> filter==='all' || r.floor.toString()===filter).map(r => (
            <div key={r.id} onClick={()=>r.status==='available'&&bookRoom(r.id, r.rent, r.floor)} className={`room-cell ${r.status}`}>
              <div className="room-num">{r.id}</div><div>{r.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsPanel = () => {
  const [cat, setCat] = useState('general');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  const loadNews = async (category = cat) => {
    setLoading(true);
    try {
      const endpoint = category === 'general' ? 'trending' : `category/${category}`;
      const response = await fetch(`http://localhost:5000/api/news/${endpoint}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        // Fallback to demo data
        setArticles(DEMO_ARTICLES[category] || DEMO_ARTICLES.general);
      }
    } catch (error) {
      console.error('News API Error:', error);
      // Fallback to demo data
      setArticles(DEMO_ARTICLES[category] || DEMO_ARTICLES.general);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    loadNews();
  };

  const handleCategoryChange = (newCat) => {
    setCat(newCat);
    loadNews(newCat);
  };

  // Load news on component mount
  React.useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="panel active">
      <div className="section-title">Global News Hub 🌍</div>
      <div className="section-sub">Stay informed with personalized, real-time news</div>
      <div className="news-controls">
        <div className="filter-chips">
          {[
            { id: 'general', label: '🌐 World' },
            { id: 'technology', label: '💻 Tech' },
            { id: 'sports', label: '⚽ Sports' },
            { id: 'health', label: '🏥 Health' },
            { id: 'science', label: '🔬 Science' },
            { id: 'business', label: '💼 Business' }
          ].map(c => (
            <div key={c.id} className={`chip ${cat===c.id?'active':''}`} onClick={() => handleCategoryChange(c.id)}>
              {c.label}
            </div>
          ))}
        </div>
        <button className="news-refresh-btn" onClick={handleRefresh} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {loading ? (
        <div className="news-loading"><div className="spinner"></div>Fetching headlines…</div>
      ) : (
        <>
          {articles.length > 0 && (
            <div className="news-featured">
              <div className="news-featured-body">
                <div>
                  <div className="news-featured-label">FEATURED · LIVE</div>
                  <div className="news-featured-title">{articles[0].title}</div>
                  <div className="news-featured-desc">{articles[0].description}</div>
                </div>
                <div className="news-featured-footer">
                  <span className="info-pill">📰 {articles[0].source}</span>
                  <span className="info-pill">🕐 {new Date(articles[0].publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="news-featured-img"><div className="news-featured-placeholder">🌐</div></div>
            </div>
          )}
          <div className="news-grid">
            {articles.slice(1).map((a,i) => (
              <div className="news-card" key={i} onClick={() => window.open(a.url, '_blank')}>
                <div className="news-card-img">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <div className="news-card-img-placeholder">📰</div>
                  )}
                </div>
                <div className="news-card-body">
                  <div className="news-card-cat" style={{color:'var(--accent)', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', marginBottom:'8px'}}>
                    {cat === 'general' ? '🌐 WORLD' : `${cat.toUpperCase()}`}
                  </div>
                  <div className="news-card-title">{a.title}</div>
                  <div className="news-card-desc">{a.description}</div>
                  <div className="news-card-footer">
                    <div className="news-source">
                      <span className="news-source-dot"></span>
                      {a.source}
                    </div>
                    <div className="news-time">
                      {new Date(a.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {articles.length === 0 && (
            <div style={{textAlign:'center', padding:'40px', color:'var(--text2)'}}>
              <p>No articles found. Try refreshing or check your connection.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// IoT CONTROL PANEL
// ============================================================
const DEVICE_META = {
  light:       { icon: '💡', label: 'Light',       color: '#f59e0b', unit: '' },
  fan:         { icon: '🌀', label: 'Fan',         color: '#3b82f6', unit: '%' },
  ac:          { icon: '❄️', label: 'AC',           color: '#06b6d4', unit: '°C' },
  geyser:      { icon: '🔥', label: 'Geyser',      color: '#ef4444', unit: '' },
  water_motor: { icon: '💧', label: 'Water Motor',  color: '#10b981', unit: '' },
};

const IoTControlPanel = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats]     = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom]   = useState('all');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [mqttFeed, setMqttFeed] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const BACKEND = 'http://localhost:5000';

  const fetchAll = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRoom  !== 'all') params.set('room',  selectedRoom);
      if (selectedBlock !== 'all') params.set('block', selectedBlock);

      const [devRes, statRes, logRes] = await Promise.all([
        fetch(`${BACKEND}/api/iot/devices?${params}`),
        fetch(`${BACKEND}/api/iot/stats`),
        fetch(`${BACKEND}/api/iot/activity`),
      ]);
      const [devData, statData, logData] = await Promise.all([
        devRes.json(), statRes.json(), logRes.json()
      ]);
      if (devData.success)  setDevices(devData.devices);
      if (statData.success) setStats(statData.stats);
      if (logData.success)  setActivityLog(logData.log);
    } catch (err) {
      console.error('IoT fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // Auto-refresh every 5s
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchAll, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [selectedRoom, selectedBlock, autoRefresh]);

  const toggleDevice = async (deviceId, name, newStatus, mqttTopic) => {
    // Optimistic UI
    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, status: !d.status } : d));
    const ts = new Date();
    const entry = {
      topic: mqttTopic,
      payload: newStatus ? 'OFF' : 'ON',
      device: name,
      time: ts,
      fresh: true
    };
    setMqttFeed(prev => [entry, ...prev].slice(0, 20));

    try {
      await fetch(`${BACKEND}/api/iot/toggle/${deviceId}`, { method: 'PATCH' });
      fetchAll();
    } catch (err) {
      // Revert on error
      setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, status: newStatus } : d));
    }
  };

  const updateControl = async (deviceId, updates) => {
    try {
      await fetch(`${BACKEND}/api/iot/control/${deviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const bulkAction = async (action, opts = {}) => {
    try {
      await fetch(`${BACKEND}/api/iot/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...opts })
      });
      const ts = new Date();
      setMqttFeed(prev => [{
        topic: `hostel/BULK/${action.toUpperCase()}`,
        payload: action.toUpperCase(),
        device: `All ${opts.type || 'devices'} in ${opts.room || opts.block || 'ALL'}`,
        time: ts,
        fresh: true
      }, ...prev].slice(0, 20));
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const rooms  = ['all', ...new Set(devices.map(d => d.room))];
  const blocks = ['all', ...new Set(devices.map(d => d.block))];
  const filteredDevices = devices.filter(d => {
    if (selectedRoom  !== 'all' && d.room  !== selectedRoom)  return false;
    if (selectedBlock !== 'all' && d.block !== selectedBlock) return false;
    return true;
  });

  const onCount  = filteredDevices.filter(d => d.status).length;
  const offCount = filteredDevices.filter(d => !d.status).length;

  const aiSuggestions = [
    stats?.on > 8  ? '⚡ High load: Turn off unused ACs to save energy.' : null,
    filteredDevices.some(d => d.type === 'geyser' && d.status) ? '🔥 Geyser is ON — auto-off in 30 min.' : null,
    filteredDevices.some(d => d.type === 'water_motor' && d.status) ? '💧 Water Motor running — check tank level.' : null,
  ].filter(Boolean);

  const DeviceCard = ({ device }) => {
    const meta    = DEVICE_META[device.type] || { icon: '🔌', label: device.type, color: '#6b7280', unit: '' };
    const isOpen  = expandedDevice === device.deviceId;
    const isOn    = device.status;

    return (
      <div style={{
        background: isOn ? `linear-gradient(135deg, ${meta.color}18, ${meta.color}08)` : 'var(--card-bg)',
        border: isOn ? `1.5px solid ${meta.color}55` : '1.5px solid var(--border)',
        borderRadius: '16px', padding: '18px', transition: 'all 0.3s',
        boxShadow: isOn ? `0 4px 24px ${meta.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* Top row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{
              width:'40px', height:'40px', borderRadius:'12px',
              background: isOn ? meta.color : 'var(--bg2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'20px', transition:'all 0.3s',
              boxShadow: isOn ? `0 4px 12px ${meta.color}55` : 'none'
            }}>
              {meta.icon}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'13px', color:'var(--text1)' }}>{device.name}</div>
              <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                {meta.label} · Room {device.room} · Block {device.block}
              </div>
            </div>
          </div>
          {/* Toggle Switch */}
          <div
            onClick={() => toggleDevice(device.deviceId, device.name, device.status, device.mqttTopic)}
            style={{
              width:'50px', height:'26px', borderRadius:'13px', cursor:'pointer',
              background: isOn ? meta.color : '#cbd5e1',
              position:'relative', transition:'background 0.3s',
              flexShrink:0,
              boxShadow: isOn ? `0 2px 8px ${meta.color}66` : 'none'
            }}
          >
            <div style={{
              position:'absolute', top:'3px',
              left: isOn ? '27px' : '3px',
              width:'20px', height:'20px', borderRadius:'50%',
              background:'white', transition:'left 0.25s',
              boxShadow:'0 1px 4px rgba(0,0,0,0.25)'
            }} />
          </div>
        </div>

        {/* Status + MQTT badge */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <span style={{
            fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'20px',
            background: isOn ? `${meta.color}22` : 'var(--bg2)',
            color: isOn ? meta.color : 'var(--text3)'
          }}>
            {isOn ? '● ON' : '○ OFF'}
          </span>
          <span style={{ fontSize:'9px', color:'var(--text3)', fontFamily:'monospace', background:'var(--bg2)', padding:'2px 6px', borderRadius:'6px' }}>
            MQTT: {device.mqttTopic?.split('/').slice(-2).join('/')}
          </span>
        </div>

        {/* Energy read */}
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>
          ⚡ {device.energyUsed?.toFixed(2)} kWh consumed
          {device.autoOff && <span style={{ marginLeft:'8px', color:'#f59e0b' }}>⏱ Auto-off: {device.autoOffMinutes}min</span>}
        </div>

        {/* Expand toggle for controls */}
        <button
          onClick={() => setExpandedDevice(isOpen ? null : device.deviceId)}
          style={{
            width:'100%', padding:'6px', borderRadius:'8px', border:`1px solid ${isOn ? meta.color+'44' : 'var(--border)'}`,
            background:'transparent', cursor:'pointer', fontSize:'11px', fontWeight:700,
            color: isOn ? meta.color : 'var(--text3)', transition:'all 0.2s'
          }}
        >
          {isOpen ? '▲ Hide Controls' : '▼ Advanced Controls'}
        </button>

        {/* Advanced Controls */}
        {isOpen && (
          <div style={{ marginTop:'12px', padding:'12px', background:'var(--bg2)', borderRadius:'10px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {/* Intensity for Fan */}
            {device.type === 'fan' && (
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text2)', display:'block', marginBottom:'4px' }}>🌀 Speed: {device.intensity}%</label>
                <input type="range" min="0" max="100" value={device.intensity}
                  onChange={e => updateControl(device.deviceId, { intensity: parseInt(e.target.value) })}
                  style={{ width:'100%', accentColor: meta.color }} />
              </div>
            )}
            {/* Temperature for AC */}
            {device.type === 'ac' && (
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text2)', display:'block', marginBottom:'4px' }}>❄️ Temp: {device.temperature}°C</label>
                <input type="range" min="16" max="30" value={device.temperature}
                  onChange={e => updateControl(device.deviceId, { temperature: parseInt(e.target.value) })}
                  style={{ width:'100%', accentColor: meta.color }} />
              </div>
            )}
            {/* Auto-off timer */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text2)' }}>⏱ Auto-Off Timer</label>
              <input type="checkbox" checked={device.autoOff}
                onChange={e => updateControl(device.deviceId, { autoOff: e.target.checked })} />
            </div>
            {device.autoOff && (
              <div>
                <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>After {device.autoOffMinutes} min</label>
                <input type="range" min="5" max="120" step="5" value={device.autoOffMinutes}
                  onChange={e => updateControl(device.deviceId, { autoOffMinutes: parseInt(e.target.value) })}
                  style={{ width:'100%', accentColor:'#f59e0b' }} />
              </div>
            )}
            {/* Schedule */}
            <div style={{ display:'flex', gap:'8px' }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:'10px', color:'var(--text3)', display:'block', marginBottom:'2px' }}>📅 ON at</label>
                <input type="time" value={device.scheduledOnTime || ''}
                  onChange={e => updateControl(device.deviceId, { scheduledOnTime: e.target.value })}
                  style={{ width:'100%', borderRadius:'6px', border:'1px solid var(--border)', padding:'4px 6px', fontSize:'12px', background:'var(--card-bg)', color:'var(--text1)' }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:'10px', color:'var(--text3)', display:'block', marginBottom:'2px' }}>🌙 OFF at</label>
                <input type="time" value={device.scheduledOffTime || ''}
                  onChange={e => updateControl(device.deviceId, { scheduledOffTime: e.target.value })}
                  style={{ width:'100%', borderRadius:'6px', border:'1px solid var(--border)', padding:'4px 6px', fontSize:'12px', background:'var(--card-bg)', color:'var(--text1)' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="panel active">
      {/* Header */}
      <div style={{ marginBottom:'20px' }}>
        <div className="section-title">💡 Virtual IoT Smart Control</div>
        <div className="section-sub">MQTT-based virtual switch control · Automation engine · Real-time monitoring</div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div style={{ background:'linear-gradient(135deg,#1e40af11,#7c3aed11)', border:'1.5px solid #7c3aed33', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px' }}>
          <div style={{ fontSize:'11px', fontWeight:800, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'8px' }}>🤖 AI Smart Suggestions</div>
          {aiSuggestions.map((s,i) => (
            <div key={i} style={{ fontSize:'12px', color:'var(--text2)', marginBottom:'4px' }}>{s}</div>
          ))}
        </div>
      )}

      {/* Stats Row */}
      {stats && (
        <div className="stats-row" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:'20px' }}>
          <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-value">{stats.on}</div><div className="stat-label">Devices ON</div></div>
          <div className="stat-card" style={{ borderColor:'rgba(100,116,139,.3)' }}><div className="stat-icon">⭕</div><div className="stat-value">{stats.off}</div><div className="stat-label">Devices OFF</div></div>
          <div className="stat-card blue"><div className="stat-icon">⚡</div><div className="stat-value">{stats.energyUsed}</div><div className="stat-label">kWh Used</div></div>
          <div className="stat-card orange"><div className="stat-icon">💡</div><div className="stat-value">{stats.byType.lights}</div><div className="stat-label">Lights</div></div>
          <div className="stat-card purple"><div className="stat-icon">❄️</div><div className="stat-value">{stats.byType.acs}</div><div className="stat-label">ACs</div></div>
        </div>
      )}

      {/* Controls Row */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'20px', alignItems:'center' }}>
        {/* Block Filter */}
        <div className="tabs" style={{ marginBottom:0 }}>
          {blocks.map(b => (
            <div key={b} className={`tab ${selectedBlock===b?'active':''}`} onClick={() => setSelectedBlock(b)}>
              {b === 'all' ? 'All Blocks' : `Block ${b}`}
            </div>
          ))}
        </div>
        {/* Room Filter */}
        <select
          value={selectedRoom}
          onChange={e => setSelectedRoom(e.target.value)}
          style={{ padding:'7px 12px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--card-bg)', color:'var(--text1)', fontSize:'13px', cursor:'pointer' }}
        >
          <option value="all">All Rooms</option>
          {rooms.filter(r => r !== 'all').map(r => <option key={r} value={r}>Room {r}</option>)}
        </select>
        {/* Bulk Actions */}
        <div style={{ display:'flex', gap:'6px', marginLeft:'auto', flexWrap:'wrap' }}>
          <button onClick={() => bulkAction('on', { room: selectedRoom !== 'all' ? selectedRoom : undefined, block: selectedBlock !== 'all' ? selectedBlock : undefined })}
            style={{ padding:'7px 14px', borderRadius:'10px', border:'none', background:'#22c55e', color:'white', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
            ⚡ ALL ON
          </button>
          <button onClick={() => bulkAction('off', { room: selectedRoom !== 'all' ? selectedRoom : undefined, block: selectedBlock !== 'all' ? selectedBlock : undefined })}
            style={{ padding:'7px 14px', borderRadius:'10px', border:'none', background:'#ef4444', color:'white', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
            🔴 ALL OFF
          </button>
          <button onClick={() => bulkAction('off', { type: 'ac' })}
            style={{ padding:'7px 14px', borderRadius:'10px', border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
            ❄️ ACs OFF
          </button>
          <button onClick={() => bulkAction('off', { type: 'light' })}
            style={{ padding:'7px 14px', borderRadius:'10px', border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
            💡 Lights OFF
          </button>
          <button onClick={() => setAutoRefresh(p => !p)}
            style={{ padding:'7px 14px', borderRadius:'10px', border:'1px solid var(--border)', background: autoRefresh ? '#3b82f622' : 'transparent', color: autoRefresh ? '#3b82f6':'var(--text3)', fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
            {autoRefresh ? '🔄 Live' : '⏸ Paused'}
          </button>
        </div>
      </div>

      {/* Main Content: Device Grid + Activity Log */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px' }}>
        {/* Device Grid */}
        <div>
          {/* ON/OFF summary bar */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
            <span style={{ fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>
              {onCount} ON · {offCount} OFF · {filteredDevices.length} total
            </span>
            <div style={{ flex:1, height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${filteredDevices.length ? (onCount/filteredDevices.length)*100 : 0}%`, background:'#22c55e', borderRadius:'3px', transition:'width 0.4s' }} />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
              <div className="spinner" />
              Loading IoT devices…
            </div>
          ) : filteredDevices.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
              <div style={{ fontSize:'36px', marginBottom:'10px' }}>📡</div>
              <p>No devices found for this filter.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'14px' }}>
              {filteredDevices.map(device => <DeviceCard key={device.deviceId} device={device} />)}
            </div>
          )}
        </div>

        {/* Right Panel: MQTT Feed + Automation Rules */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* MQTT Activity Feed */}
          <div className="card" style={{ flex:1 }}>
            <div className="card-header">
              <div className="card-title">📡 MQTT Activity Feed</div>
              <span style={{ fontSize:'10px', color:'#22c55e', fontWeight:700, animation:'pulse 1.5s infinite' }}>● LIVE</span>
            </div>
            <div style={{ maxHeight:'260px', overflowY:'auto' }}>
              {[...mqttFeed, ...activityLog].slice(0, 20).map((entry, i) => (
                <div key={i} style={{
                  padding:'8px 10px', borderRadius:'8px', marginBottom:'6px',
                  background: i === 0 && mqttFeed.length > 0 && entry.fresh ? '#22c55e11' : 'var(--bg2)',
                  border: i === 0 && mqttFeed.length > 0 && entry.fresh ? '1px solid #22c55e44' : '1px solid transparent'
                }}>
                  <div style={{ fontFamily:'monospace', fontSize:'10px', color:'var(--accent)', wordBreak:'break-all' }}>
                    {entry.topic}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'2px' }}>
                    <span style={{
                      fontSize:'11px', fontWeight:700,
                      color: entry.payload === 'ON' ? '#22c55e' : '#ef4444'
                    }}>
                      {entry.payload === 'ON' ? '▶ ON' : '■ OFF'} · {entry.device}
                    </span>
                    <span style={{ fontSize:'9px', color:'var(--text3)' }}>
                      {new Date(entry.time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {mqttFeed.length === 0 && activityLog.length === 0 && (
                <div style={{ color:'var(--text3)', fontSize:'12px', textAlign:'center', padding:'20px' }}>No activity yet. Toggle a device!</div>
              )}
            </div>
          </div>

          {/* Automation Rules */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🤖 Automation Rules</div>
            </div>
            {[
              { icon:'⏱', rule:'Geysers auto-OFF after 30 min', active:true },
              { icon:'💧', rule:'Water motors auto-OFF after 60 min', active:true },
              { icon:'🌙', rule:'Lobby lights auto-ON at 18:00', active:true },
              { icon:'☀️', rule:'Lobby lights auto-OFF at 06:00', active:true },
              { icon:'❄️', rule:'AC off if no occupancy for 15 min', active:false },
            ].map((rule, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'10px', padding:'9px 0',
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
              }}>
                <span style={{ fontSize:'16px' }}>{rule.icon}</span>
                <span style={{ fontSize:'12px', color:'var(--text2)', flex:1 }}>{rule.rule}</span>
                <span style={{
                  fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'10px',
                  background: rule.active ? '#22c55e22' : 'var(--bg2)',
                  color: rule.active ? '#22c55e' : 'var(--text3)'
                }}>
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>

          {/* System Info */}
          <div className="card" style={{ padding:'14px' }}>
            <div style={{ fontSize:'11px', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>
              System Info
            </div>
            <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8' }}>
              <div>🏗️ Protocol: <strong>Virtual MQTT</strong></div>
              <div>🗄️ Broker: <strong>HiveMQ (Simulated)</strong></div>
              <div>🔄 Refresh: <strong>every 5 sec</strong></div>
              <div>⚙️ Engine: <strong>Node.js Automation</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AIPanel = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([{role:'ai', text:"👋 Hi! I'm HostelOS Assistant. Ask me anything — rooms, events, global news, or any general question!"}]);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [chat]);

  const sendChat = async () => {
    if (!input.trim() || thinking) return;
    const userText = input.trim();
    setChat(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setThinking(true);

    const q = userText.toLowerCase();

    // ── Layer 1: Hostel-specific quick answers ──
    const hostelReply = (() => {
      if (q.includes('room') || q.includes('vacancy') || q.includes('available'))
        return '🛏 We currently have 12 rooms available. Check the Rooms tab to book one instantly!';
      if (q.includes('event') || q.includes('hackathon'))
        return '📅 Upcoming: Inter-Hostel Coding Hackathon on April 5! Register via the Events section.';
      if (q.includes('fee') || q.includes('payment') || q.includes('due'))
        return '💳 Your next payment deadline is April 5, 2026. Use UPI/Card/Wallet from the Payments tab.';
      if (q.includes('food') || q.includes('menu') || q.includes('mess'))
        return '🍽 Today\'s mess menu: Breakfast — Poha & Tea | Lunch — Dal Rice & Sabzi | Dinner — Roti & Paneer Butter Masala.';
      if (q.includes('laundry'))
        return '👕 3 laundry machines are free right now. Head to Block B basement!';
      if (q.includes('wifi') || q.includes('internet'))
        return '📶 WiFi SSID: HostelNet_5G | Password: hostel@2025 | Speed: 200 Mbps symmetrical.';
      if (q.includes('gate') || q.includes('security') || q.includes('pass'))
        return '🔐 Generate your QR gate pass from the Smart Security section on your dashboard.';
      if (q.includes('complaint') || q.includes('issue') || q.includes('problem'))
        return '📝 File a complaint via the Complaints tab. Admin reviews in under 24 hours.';
      if (q.includes('who are you') || q.includes('hostel assistant'))
        return '🤖 I\'m HostelOS Assistant — your AI-powered hostel concierge. I can answer any question, not just hostel queries!';
      return null;
    })();

    if (hostelReply) {
      setTimeout(() => {
        setChat(prev => [...prev, { role: 'ai', text: hostelReply }]);
        setThinking(false);
      }, 400);
      return;
    }

    // ── Layer 2: Live global news ──
    if (q.includes('news') || q.includes('update') || q.includes('happening') || q.includes('latest')) {
      try {
        const res = await fetch('http://localhost:5000/api/news/trending?limit=4');
        const data = await res.json();
        if (data.success && data.articles?.length > 0) {
          const lines = data.articles.map((a, i) => `📰 ${i+1}. **${a.title}**\n   ${a.description || ''}`).join('\n\n');
          setChat(prev => [...prev, { role: 'ai', text: `Here are the latest global updates:\n\n${lines}` }]);
          setThinking(false);
          return;
        }
      } catch {}
    }

    // ── Layer 3: Google Gemini for all other questions ──
    try {
      const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
      const geminiKey = rawKey ? rawKey.replace(/['"]/g, '').trim() : '';

      if (!geminiKey) {
        setChat(prev => [...prev, { role: 'ai', text: '⚠️ Gemini API key not found. Add VITE_GEMINI_API_KEY to your .env file to enable full AI mode.' }]);
        setThinking(false);
        return;
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are HostelOS Assistant — a helpful, concise AI assistant embedded in a student hostel management system. Answer the following question clearly and conversationally (under 120 words). If it's a general knowledge question, answer it directly. Question: ${userText}`
              }]
            }]
          })
        }
      );

      const data = await res.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setChat(prev => [...prev, { role: 'ai', text: data.candidates[0].content.parts[0].text }]);
      } else if (data.error) {
        setChat(prev => [...prev, { role: 'ai', text: `❌ Gemini Error: ${data.error.message}` }]);
      } else {
        setChat(prev => [...prev, { role: 'ai', text: '⚠️ No response from AI. Please try again.' }]);
      }
    } catch (err) {
      setChat(prev => [...prev, { role: 'ai', text: `❌ Network error: ${err.message}. Check your internet or API key.` }]);
    }

    setThinking(false);
  };

  return (
    <div className="panel active" style={{display:'flex', flexDirection:'column', height:'calc(100vh - 120px)'}}>
      <div className="chat-header">
        <div className="ai-avatar">🤖</div>
        <div className="ai-info">
          <div className="ai-name">HostelOS Assistant</div>
          <div className="ai-status">● {thinking ? 'Thinking...' : 'Online'}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', color: 'rgba(255,255,255,0.6)' }}>
          ✨ Gemini AI Powered
        </div>
      </div>
      <div className="chat-messages" style={{flex:1, overflowY:'auto'}}>
        {chat.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-avatar">{m.role === 'ai' ? '🤖' : 'RK'}</div>
            <div>
              <div className="msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="msg ai">
            <div className="msg-avatar">🤖</div>
            <div>
              <div className="msg-bubble" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span style={{ animation: 'bounce 1.2s 0s infinite', display: 'inline-block' }}>●</span>
                <span style={{ animation: 'bounce 1.2s 0.2s infinite', display: 'inline-block' }}>●</span>
                <span style={{ animation: 'bounce 1.2s 0.4s infinite', display: 'inline-block' }}>●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-row" style={{marginTop:'auto'}}>
        <div className="chat-input-wrap">
          <textarea className="chat-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }}}
            placeholder="Ask anything — hostel, general knowledge, news..." rows="1" />
        </div>
        <button className="chat-send-btn" onClick={sendChat} disabled={thinking}>➤</button>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};


// ============================================================
// MAIN LAYOUT EXPORT
// ============================================================
export default function HostelSmartOS() {
  const [activePanel, setActivePanel] = useState('dashboard');

  return (
    <div className="hostelos-ui">
      <div className="shell">
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        <main className="main">
          <Topbar activePanel={activePanel} setActivePanel={setActivePanel} />
          <div className="content">
            {activePanel === 'dashboard' && <DashboardPanel setActivePanel={setActivePanel} />}
            {activePanel === 'rooms' && <RoomsPanel />}
            {activePanel === 'events' && <div style={{padding:'20px', color:'var(--text2)'}}><h3>Events Panel (Demo)</h3><p>See dashboard for upcoming events.</p></div>}
            {activePanel === 'iot' && <IoTControlPanel />}
            {activePanel === 'news' && <NewsPanel />}
            {activePanel === 'ai' && <AIPanel />}
            {['preferences', 'analytics', 'digest'].includes(activePanel) && (
              <div style={{color: 'var(--text3)', textAlign: 'center', padding: '50px'}}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>🚧</div>
                <h3>{activePanel.charAt(0).toUpperCase() + activePanel.slice(1)} Panel under construction</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
