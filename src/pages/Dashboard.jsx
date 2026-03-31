import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Calendar from '../components/Calendar';

const StatCard = ({ title, value, icon, color, textColor }) => (
  <div className="bg-surface-container-lowest p-8 rounded-xl flex items-center justify-between shadow-sm">
    <div>
      <span className="block font-label text-xs font-bold text-outline uppercase mb-2">{title}</span>
      <span className={`text-4xl font-headline font-extrabold ${textColor} tracking-tighter`}>{value}</span>
    </div>
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center ${textColor}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  </div>
);

const MobileNavLink = ({ icon, label, to = "#", active = false }) => (
  <a className={`flex flex-col items-center justify-center ${active ? 'bg-[#1A237E] text-white rounded-full' : 'text-slate-500'} px-5 py-2 active:scale-90 transition-transform`} href={to}>
    <span className={`material-symbols-outlined mb-1`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
    <span className="font-label text-[11px] font-medium tracking-wide uppercase">{label}</span>
  </a>
);

const Dashboard = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsCategory, setNewsCategory] = useState('general');
  const [snackbar, setLocalSnackbar] = useState(null);
  const [showUISnackbar, setShowUISnackbar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const showSnackbarAction = (msg, icon) => {
    setLocalSnackbar({ message: msg, icon });
    setTimeout(() => setLocalSnackbar(null), 3000);
  };
  const today = new Date();

  const systemFeatures = [
    { name: 'Live Room Booking', icon: 'meeting_room', link: '/room-booking', desc: 'Book your hostel room seamlessly' },
    { name: 'Payment Ledger', icon: 'account_balance_wallet', link: '/payment', desc: 'Settle hostel rent and utilities' },
    { name: 'Gamification Hub', icon: 'military_tech', link: '/gamification', desc: 'Track points and ecological badges' },
    { name: 'Food & Weekend Menu', icon: 'restaurant_menu', link: '/food-menu', desc: 'View weekly culinary agenda' },
    { name: 'Complaints System', icon: 'support_agent', link: '/complaints', desc: 'Lodge physical maintenance issues' },
    { name: 'Smart Security', icon: 'security', link: '/security', desc: 'Digital QR-based gate pass' },
    { name: 'Immersive AR Tour', icon: 'view_in_ar', link: '/ar-tour', desc: 'Explore the campus virtually' },
    { name: 'Global News Hub', icon: 'public', link: '#', action: () => { window.scrollTo(0, 1500); }, desc: 'Check latest global updates' }
  ];

  const filteredFeatures = systemFeatures.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  const [vacationData, setVacationData] = useState({
    departDate: null,
    returnDate: null,
    status: 'at_hostel'
  });

  // Fetch news articles
  const fetchNews = async (category = newsCategory) => {
    setNewsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/news/trending?limit=6&category=${category}`);
      if (response.data.success && response.data.articles?.length > 0) {
        setNewsArticles(response.data.articles);
      } else throw new Error('no articles');
    } catch (error) {
      // Richer fallback data per category
      const fallbacks = {
        general: [
          { title: 'Global Climate Summit Reaches Historic Agreement', description: 'World leaders unite on landmark carbon reduction targets for 2030.', source: 'Reuters', category: 'World' },
          { title: 'UN Passes New Digital Privacy Resolution', description: 'Member nations agree on strong data protection standards globally.', source: 'AP News', category: 'World' },
          { title: 'G20 Economic Outlook Improves Amid Recovery Signs', description: 'Global GDP expected to grow 3.4% this year per IMF projections.', source: 'Bloomberg', category: 'Economy' },
          { title: 'Humanitarian Aid Reaches Record 100 Countries', description: 'International aid organizations report largest distribution in history.', source: 'UNHCR', category: 'World' },
        ],
        technology: [
          { title: 'AI Model Achieves Human-Level Reasoning in Benchmark Tests', description: 'Latest LLM surpasses expectations in complex multi-step problem solving.', source: 'TechCrunch', category: 'AI' },
          { title: 'India Launches First Quantum Computing Centre', description: 'IIT Delhi and ISRO collaborate on nation-first quantum research hub.', source: 'NDTV Tech', category: 'Tech' },
          { title: 'Meta Unveils Next-Gen AR Glasses with Neural Interface', description: 'The glasses can detect subtle micro-expressions for real-time emotion context.', source: 'The Verge', category: 'Tech' },
          { title: 'Open-Source AI Surpasses GPT in Code Generation', description: 'Community-driven model tops leaderboards for programming tasks.', source: 'GitHub Blog', category: 'AI' },
        ],
        science: [
          { title: 'NASA Voyager 1 Sends New Data from Interstellar Space', description: "After 46 years, engineers restore full functionality to Voyager's systems.", source: 'NASA', category: 'Space' },
          { title: 'CRISPR Breakthrough Cures Sickle Cell Disease in Trial', description: 'Gene-editing therapy shows 100% efficacy in Phase 3 clinical trials.', source: 'Nature', category: 'Health' },
          { title: 'Scientists Discover New Ocean Layer Below the Abyss', description: 'A previously unknown water layer found at 12,000m depth in Pacific trench.', source: 'Science Daily', category: 'Ocean' },
          { title: 'Fusion Energy Record Broken — Net Gain Sustained 8 Seconds', description: 'NIF achieves longest-ever sustained fusion reaction with net energy gain.', source: 'Phys.org', category: 'Energy' },
        ],
        sports: [
          { title: 'India Wins ICC Trophy in Epic Last-Ball Thriller', description: 'The national team clinched the championship with a stunning boundary on the final delivery.', source: 'Cricinfo', category: 'Cricket' },
          { title: 'Neeraj Chopra Sets New Diamond League Record', description: 'Indian javelin star throws 90.23m, a new all-time record in Diamond League history.', source: 'ESPN', category: 'Athletics' },
          { title: 'IPL 2025 Season Opens with Record 400M Viewers', description: 'Viewership breaks all records as streaming platforms see massive spikes.', source: 'BCCI', category: 'Cricket' },
          { title: 'FIFA 2026 Host City Preparations in Full Swing', description: 'USA, Canada and Mexico complete 80% of infrastructure for tournament.', source: 'FIFA', category: 'Football' },
        ],
        india: [
          { title: 'India GDP Growth Forecast Raised to 7.2% for FY2026', description: 'IMF upgrades India as the world fastest-growing major economy.', source: 'Economic Times', category: 'Economy' },
          { title: 'New National Education Policy Rolled Out Across States', description: 'NEP 2025 brings coding, AI literacy and mother-tongue instruction from Grade 1.', source: 'The Hindu', category: 'Education' },
          { title: 'Chandrayaan-4 Mission Cleared for 2025 Launch', description: 'ISRO confirms sample return mission timeline with JAXA collaboration.', source: 'ISRO', category: 'Space' },
          { title: 'India Tops Global Fintech Adoption Index for 3rd Year', description: 'UPI processes over 15 billion transactions per month — a global record.', source: 'RBI', category: 'Finance' },
        ],
      };
      setNewsArticles(fallbacks[category] || fallbacks.general);
    }
    setNewsLoading(false);
  };

  // Handle OAuth redirect: grab token and user from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      // Clean URL
      window.history.replaceState({}, document.title, '/dashboard');
    }
    
    // Fetch news on component mount
    fetchNews();
    
    // Auto-hide UI Snackbar after 8 seconds
    const timer = setTimeout(() => setShowUISnackbar(false), 8000);
    return () => clearTimeout(timer);
  }, [location]);

  const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const [weekMenu, setWeekMenu] = useState(null);

  // Fetch week menu from sampleData API
  useEffect(() => {
    fetch('http://localhost:5000/api/sample/menu')
      .then(r => r.json())
      .then(data => { if (data.success) setWeekMenu(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build the 7-day week array anchored on the real calendar
  const todayDate = new Date();
  const todayDayIdx = todayDate.getDay(); // 0=Sun

  // Build week: Mon to Sun of the CURRENT week
  const weekDays = [1,2,3,4,5,6,0].map(dayIdx => {
    const diff = dayIdx - todayDayIdx;
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + diff);
    const dayName = DAYS[dayIdx];
    const menu = weekMenu?.[dayName];
    return {
      dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      isToday: dayIdx === todayDayIdx,
      breakfast: menu?.breakfast?.items?.slice(0,2).join(', ') || '—',
      lunch: menu?.lunch?.items?.slice(0,2).join(', ') || '—',
      dinner: menu?.dinner?.items?.slice(0,2).join(', ') || '—',
      satMenu: weekMenu?.saturday,
      sunMenu: weekMenu?.sunday,
    };
  });

  const saturdayMenu = weekMenu?.saturday;
  const sundayMenu = weekMenu?.sunday;

  // Weekend date numbers
  const getWeekendDates = () => {
    const sat = new Date(todayDate);
    sat.setDate(todayDate.getDate() + (6 - todayDayIdx));
    const sun = new Date(todayDate);
    sun.setDate(todayDate.getDate() + (7 - todayDayIdx) % 7 || 7);
    return `${sat.getDate()}–${sun.getDate()}`;
  };

  const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set';

  // Fetch student status (vacations)
  useEffect(() => {
    const fetchVacations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/vacation/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.length > 0) {
          const v = res.data[0];
          setVacationData({
            departDate: new Date(v.departDate),
            returnDate: new Date(v.returnDate),
            status: 'leaving',
            id: v._id
          });
        }
      } catch (err) { console.error('Vacation fetch error:', err); }
    };
    fetchVacations();
  }, []);

  const handleVacationUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please sign in first'); return; }

    if (vacationData.status === 'leaving') {
      // Cancel vacation
      try {
        await axios.delete(`http://127.0.0.1:5000/api/vacation/${vacationData.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVacationData({ departDate: null, returnDate: null, status: 'at_hostel' });
        alert('Vacation cancelled. Welcome back!');
      } catch { alert('Failed to cancel'); }
      return;
    }

    if (!vacationData.departDate || !vacationData.returnDate) {
      alert('Please select both Departure and Return dates first using the calendar.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/vacation', {
        departDate: vacationData.departDate,
        returnDate: vacationData.returnDate,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setVacationData(prev => ({ ...prev, status: 'leaving', id: res.data.vacation._id }));
      alert(`Marked as leaving on ${fmt(vacationData.departDate)}. Kitchen notified!`);
    } catch {
      alert('Failed to submit vacation dates.');
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24 md:pb-0 pt-20">
      <Header activePage="Home" />

      {/* SECONDARY NAVIGATION BAR (SNACK BAR) */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-[72px] z-40 px-6 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hidden md:block">
         <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar pointer-events-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0 mr-2">Quick Map:</span>
            {[
              { label: 'Vacation', icon: 'flight_takeoff', id: 'section-vacation' },
              { label: 'Kitchen Menu', icon: 'restaurant', id: 'section-menu' },
              { label: 'Midnight Snacks', icon: 'local_pizza', id: 'section-snacks' },
              { label: 'Immersive Tech', icon: 'view_in_ar', id: 'section-tech' },
              { label: 'Wellness Protocol', icon: 'heart_check', id: 'section-wellness' },
              { label: 'Global News Hub', icon: 'public', id: 'section-news' }
            ].map(item => (
               <button 
                key={item.id}
                onClick={() => {
                   const el = document.getElementById(item.id);
                   if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 130;
                      window.scrollTo({top: y, behavior: 'smooth'});
                   }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap border border-slate-100"
               >
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  {item.label}
               </button>
            ))}
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Global Feature OmniSearch Bar - Instantly access any module */}
        <div className="mb-16 relative z-40 max-w-2xl mx-auto">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all"></div>
              <div className="relative bg-white border border-slate-200/60 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center px-6 py-4 focus-within:ring-4 ring-indigo-500/10 transition-all">
                 <span className="material-symbols-outlined text-indigo-500 text-3xl mr-4 animate-pulse">search</span>
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                   onFocus={() => setShowSearchResults(true)}
                   onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                   placeholder="Search features (e.g. 'Pay Rent', 'Book Room', 'Menu')"
                   className="w-full bg-transparent text-slate-800 text-lg font-headline font-bold uppercase tracking-wide placeholder:text-slate-300 outline-none"
                 />
                 {searchQuery && (
                   <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                     <span className="material-symbols-outlined">close</span>
                   </button>
                 )}
              </div>
           </div>
           
           {/* Dropdown Results */}
           <div className={`absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden transition-all origin-top ${showSearchResults && searchQuery.length > 0 ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                 {filteredFeatures.length > 0 ? (
                    filteredFeatures.map((feat, i) => (
                       <Link 
                          key={i} 
                          to={feat.link} 
                          onClick={feat.action}
                          className="flex items-center gap-4 p-4 hover:bg-indigo-50/50 rounded-2xl transition-colors group"
                       >
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <span className="material-symbols-outlined">{feat.icon}</span>
                          </div>
                          <div>
                             <h4 className="font-headline font-black text-slate-900">{feat.name}</h4>
                             <p className="font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{feat.desc}</p>
                          </div>
                          <span className="material-symbols-outlined ml-auto text-slate-300 group-hover:text-indigo-600 -translate-x-2 group-hover:translate-x-0 transition-transform">arrow_forward</span>
                       </Link>
                    ))
                 ) : (
                    <div className="p-8 text-center">
                       <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">search_off</span>
                       <p className="font-headline font-bold text-slate-500">No tools found matching "{searchQuery}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Hero Section */}
        <div id="section-vacation" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start scroll-mt-32">
          <div className="lg:col-span-7">
            <span className="font-label text-sm font-bold text-secondary tracking-[0.2em] uppercase mb-4 block">Kitchen Efficiency</span>
            <h2 className="font-headline text-5xl font-extrabold text-primary leading-[1.1] mb-6 tracking-tight">
              Sustainable <br /> Culinary Planning.
            </h2>
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
              Optimize daily meal prep and reduce waste by managing guest attendance through intentional vacation tracking.
            </p>
          </div>

          {/* Vacation Management with Calendar */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface-container-low rounded-xl p-6 w-full shadow-sm border-l-4 border-secondary">
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline font-bold text-primary">Vacation Dates</span>
                <span className="material-symbols-outlined text-secondary">event_busy</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Departure Date Picker */}
                <div>
                  <label className="block font-label text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">Departing</label>
                  <button
                    onClick={() => setShowCalendar(showCalendar === 'depart' ? null : 'depart')}
                    className={`w-full bg-surface-container-lowest px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white border ${showCalendar === 'depart' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">flight_takeoff</span>
                    <span className={vacationData.departDate ? 'text-on-surface' : 'text-outline'}>
                      {vacationData.departDate ? fmt(vacationData.departDate) : 'Pick date'}
                    </span>
                  </button>
                </div>

                {/* Return Date Picker */}
                <div>
                  <label className="block font-label text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">Returning</label>
                  <button
                    onClick={() => setShowCalendar(showCalendar === 'return' ? null : 'return')}
                    className={`w-full bg-surface-container-lowest px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-white border ${showCalendar === 'return' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">flight_land</span>
                    <span className={vacationData.returnDate ? 'text-on-surface' : 'text-outline'}>
                      {vacationData.returnDate ? fmt(vacationData.returnDate) : 'Pick date'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Inline Calendar */}
              {showCalendar === 'depart' && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Calendar
                    label="Select Departure Date"
                    selectedDate={vacationData.departDate}
                    minDate={today}
                    onDateSelect={(d) => {
                      setVacationData(prev => ({ ...prev, departDate: d }));
                      setShowCalendar('return');
                    }}
                  />
                </div>
              )}
              {showCalendar === 'return' && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Calendar
                    label="Select Return Date"
                    selectedDate={vacationData.returnDate}
                    minDate={vacationData.departDate || today}
                    onDateSelect={(d) => {
                      setVacationData(prev => ({ ...prev, returnDate: d }));
                      setShowCalendar(null);
                    }}
                  />
                </div>
              )}

              <button
                onClick={handleVacationUpdate}
                className={`w-full ${vacationData.status === 'leaving' ? 'bg-error' : 'bg-gradient-to-r from-primary to-primary-container'} text-white font-bold py-4 rounded-full shadow-lg shadow-primary/10 active:scale-95 transition-all outline-none`}
              >
                {vacationData.status === 'at_hostel' ? '✈️ Mark as Leaving' : '🏠 Cancel Vacation'}
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Menu */}
        <div id="section-menu" className="mb-8 flex items-center justify-between scroll-mt-32">
          <div>
            <h3 className="font-headline text-2xl font-bold text-primary">Weekly Culinary Agenda</h3>
            <p className="font-body text-sm text-on-surface-variant">Menu for the current week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-20">
          {loading ? (
            <div className="col-span-full py-12 flex justify-center items-center">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            </div>
          ) : (
            weekDays.slice(0,5).map((item, idx) => (
              <div key={idx} className={`rounded-xl p-5 shadow-sm border-t-4 transition-all hover:scale-[1.02] ${item.isToday ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20' : 'bg-surface-container-low border-outline-variant/30'} lg:col-span-1`}>
                <div className="mb-4">
                  <span className={`block font-label text-[10px] font-bold uppercase tracking-widest mb-0.5 ${item.isToday ? 'text-primary' : 'text-on-surface-variant'}`}>{item.dayName}</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-headline font-extrabold ${item.isToday ? 'text-on-surface' : 'text-on-surface-variant'}`}>{item.date}</span>
                    <span className="text-xs text-slate-400 font-bold">{item.month}</span>
                  </div>
                  {item.isToday && <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-full uppercase tracking-widest">Today</span>}
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block font-label text-[9px] font-extrabold text-secondary tracking-widest uppercase mb-1.5">🌅 Breakfast</span>
                    <p className="text-xs font-semibold leading-snug text-slate-700">{item.breakfast}</p>
                  </div>
                  <div className="pt-3 border-t border-surface-variant">
                    <span className="block font-label text-[9px] font-extrabold text-secondary tracking-widest uppercase mb-1.5">☀️ Lunch</span>
                    <p className="text-xs font-semibold leading-snug text-slate-700">{item.lunch}</p>
                  </div>
                  <div className="pt-3 border-t border-surface-variant">
                    <span className="block font-label text-[9px] font-extrabold text-secondary tracking-widest uppercase mb-1.5">🌙 Dinner</span>
                    <p className="text-xs font-semibold leading-snug text-slate-700">{item.dinner}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Weekend Card */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary-container to-primary rounded-xl p-6 text-white overflow-hidden relative group">
            <div className="absolute -right-10 -bottom-10 opacity-10 scale-150 transition-transform group-hover:rotate-12">
              <span className="material-symbols-outlined text-[120px]">restaurant</span>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="block font-label text-[10px] font-bold text-primary-fixed uppercase tracking-[0.3em] mb-1">Weekend Focus</span>
                <span className="text-3xl font-headline font-extrabold">{getWeekendDates()}</span>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10 text-sm mb-3">
              <div>
                <span className="block font-label text-[9px] font-extrabold text-primary-fixed tracking-widest uppercase mb-1.5">Sat Brunch</span>
                <p className="font-bold text-white/90">{saturdayMenu?.breakfast?.items?.[0] || 'Special Brunch'}</p>
              </div>
              <div>
                <span className="block font-label text-[9px] font-extrabold text-primary-fixed tracking-widest uppercase mb-1.5">Sun Special</span>
                <p className="font-bold text-white/90">{sundayMenu?.lunch?.items?.[0] || 'Sunday Feast'}</p>
              </div>
              <div>
                <span className="block font-label text-[9px] font-extrabold text-primary-fixed tracking-widest uppercase mb-1.5">Sat Dinner</span>
                <p className="font-bold text-white/90">{saturdayMenu?.dinner?.items?.[0] || 'Kadai Paneer'}</p>
              </div>
              <div>
                <span className="block font-label text-[9px] font-extrabold text-primary-fixed tracking-widest uppercase mb-1.5">Sun Dinner</span>
                <p className="font-bold text-white/90">{sundayMenu?.dinner?.items?.[0] || 'Pasta'}</p>
              </div>
            </div>
            <Link to="/food-menu" className="mt-4 block text-center w-full py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">
              View Full Mess Menu →
            </Link>
          </div>
        </div>

        {/* Midnight Snack Bar Widget */}
        <div id="section-snacks" className="mb-20 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500">local_pizza</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-slate-900">Midnight Snack Bar</h3>
              <p className="font-body text-sm text-slate-500">Quick-order late night snacks directly to your room</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Spicy Maggi', price: 40, icon: 'ramen_dining', time: '10 min', color: 'text-orange-500', bg: 'bg-orange-50' },
              { name: 'Iced Coffee', price: 60, icon: 'local_cafe', time: '5 min', color: 'text-amber-700', bg: 'bg-amber-50' },
              { name: 'Club Sandwich', price: 80, icon: 'bakery_dining', time: '15 min', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Energy Drink', price: 50, icon: 'bolt', time: '2 min', color: 'text-blue-500', bg: 'bg-blue-50' }
            ].map((snack, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 ${snack.bg} rounded-2xl flex items-center justify-center ${snack.color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[24px]">{snack.icon}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{snack.time}</span>
                </div>
                <div>
                  <h4 className="font-headline font-black text-slate-900 leading-none">{snack.name}</h4>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-bold text-slate-400">₹{snack.price}</span>
                    <button 
                      onClick={() => alert(`⚡ Quick Order Confirmed!\n\nYour ${snack.name} is being prepared.\nDelivering to your room in ${snack.time}.\n\n₹${snack.price} has been natively deducted from your Hostel Wallet.`)}
                      className="text-[10px] font-black uppercase text-white bg-slate-900 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive Tech Section */}
        <div id="section-tech" className="mb-20 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">view_in_ar</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary">Explore Remotely</h3>
              <p className="font-body text-sm text-on-surface-variant">Experience your hostel through Immersive Tech</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="shrink-0 w-32 h-32 bg-primary rounded-[2rem] flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform shadow-2xl shadow-primary/30">
                   <span className="material-symbols-outlined text-5xl">auto_videocam</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="font-headline font-bold text-xl mb-2">Interactive Floor Map</h4>
                   <p className="text-on-surface-variant text-sm mb-6">Explore our live room availability matrix and dynamically secure your specific bed configuration today.</p>
                   <Link 
                     to="/room-booking"
                     className="inline-block px-8 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                   >
                     Launch Matrix
                   </Link>
                </div>
             </div>
             
             <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all">
                <div className="shrink-0 w-32 h-32 bg-secondary-fixed rounded-[2rem] flex items-center justify-center text-on-secondary-fixed -rotate-3 group-hover:rotate-0 transition-transform shadow-2xl">
                   <span className="material-symbols-outlined text-5xl">360</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="font-headline font-bold text-xl mb-2">360° Panorama</h4>
                   <p className="text-on-surface-variant text-sm mb-6">View high-resolution panoramic shots of the gym, canteen, and library to get a feel of the campus vibe.</p>
                   <button 
                     onClick={() => window.open('/ar-tour', '_blank')}
                     className="px-8 py-3 bg-secondary-fixed text-on-secondary-fixed rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                   >
                     Explore View
                   </button>
                </div>
             </div>
          </div>
        </div>


        {/* Mood & Wellness Section */}
        <div id="section-wellness" className="mb-20 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-rose-500">heart_check</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-slate-900 uppercase tracking-tighter">Wellness Protocol</h3>
              <p className="font-body text-sm text-slate-500">AI-Powered Mood Tracking & Ecosystem Balance</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
             {/* Mood Input */}
             <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between shadow-xl shadow-slate-200">
                <div>
                   <h4 className="font-headline font-black text-xl mb-2 text-slate-900 uppercase">Status Check</h4>
                   <p className="text-slate-400 text-sm mb-8 font-medium italic">"How is your neural baseline today?"</p>
                   
                   <div className="grid grid-cols-3 gap-3">
                      {['Happy', 'Tired', 'Stressed', 'Calm', 'Bored', 'Anxious'].map(mood => (
                        <button 
                          key={mood} 
                          onClick={() => showSnackbarAction(`Mood logged: ${mood}`, 'mood')}
                          className="py-3 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100/50"
                        >
                           {mood}
                        </button>
                      ))}
                   </div>
                </div>
                <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 transition-all">
                   Log Neural State
                </button>
             </div>

             {/* Wellness Suggestion Card */}
             <div className="md:col-span-8 bg-gradient-to-br from-rose-500 to-orange-400 rounded-[3rem] p-10 text-white relative flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">magic_button</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">AI Insight Detected</p>
                        <h4 className="text-2xl font-headline font-black uppercase tracking-tighter leading-none">High Study Tension Observed</h4>
                      </div>
                   </div>
                   <p className="text-rose-50 text-xl font-medium max-w-lg mb-10 leading-relaxed italic">"Our sensors detect increased app usage during late-night cycles. Your neural levels suggest it's time for a 15-min decompression. How about a guided meditation or a warm beverage at the Mess Hall?"</p>
                   <div className="flex gap-4">
                      <button onClick={() => showSnackbarAction("Guided breath session started", "self_improvement")} className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Start Guided Breath</button>
                      <button onClick={() => showSnackbarAction("Urgent notification dispatched to roommate", "send")} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Notify Roommate</button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Global News Hub & Daily Digest */}
        <div id="section-news" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 scroll-mt-32">

          {/* Daily Digest */}
          <div className="lg:col-span-4 bg-primary-container p-8 rounded-[2.5rem] flex flex-col justify-between shadow-sm border border-primary/10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                <h4 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter">Daily Digest</h4>
              </div>
              <p className="text-on-primary-container text-sm mb-6 font-medium">Your personalized morning briefing — hostel updates &amp; news.</p>
              <ul className="space-y-4">
                <li className="bg-white/40 p-5 rounded-[1.5rem] border border-white/50 hover:bg-white/60 transition-all cursor-pointer">
                  <span className="block font-label text-[10px] font-black text-primary uppercase tracking-widest mb-1">Notice</span>
                  <p className="text-sm font-bold text-on-surface leading-snug">Elevators in Block B under maintenance from 9-11 AM.</p>
                </li>
                <li className="bg-white/40 p-5 rounded-[1.5rem] border border-white/50 hover:bg-white/60 transition-all cursor-pointer">
                  <span className="block font-label text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Event Tracker</span>
                  <p className="text-sm font-bold text-on-surface leading-snug">Inter-Hostel Coding Hackathon starts tomorrow.</p>
                </li>
                <li className="bg-white/40 p-5 rounded-[1.5rem] border border-white/50 hover:bg-white/60 transition-all cursor-pointer">
                  <span className="block font-label text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Mess Alert</span>
                  <p className="text-sm font-bold text-on-surface leading-snug">Special Sunday Brunch added to this week's menu.</p>
                </li>
              </ul>
            </div>
            <button className="mt-6 w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
               Configure Digest
            </button>
          </div>

          {/* Global News - ENHANCED */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">public</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tighter">Global News Hub</h3>
                  <p className="font-body text-sm text-outline">Real-time worldwide developments</p>
                </div>
              </div>
              <button
                onClick={() => fetchNews(newsCategory)}
                disabled={newsLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>refresh</span>
                {newsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'general',    label: '🌐 General' },
                { id: 'technology', label: '💻 Tech' },
                { id: 'science',    label: '🔬 Science' },
                { id: 'sports',     label: '🏆 Sports' },
                { id: 'india',      label: '🇮🇳 India' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setNewsCategory(cat.id); fetchNews(cat.id); }}
                  className={`px-4 py-2 text-[11px] font-black uppercase rounded-xl tracking-widest transition-all ${
                    newsCategory === cat.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Articles */}
            <div className="space-y-3">
              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="ml-3 text-sm text-outline">Fetching latest news...</span>
                </div>
              ) : newsArticles.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2">newspaper</span>
                  <p className="font-semibold">No articles available.</p>
                </div>
              ) : (
                newsArticles.map((article, index) => {
                  const palettes = [
                    { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   cat: 'text-blue-700',   sym: 'language' },
                    { bg: 'bg-emerald-50',icon: 'bg-emerald-100 text-emerald-600', cat: 'text-emerald-700', sym: 'memory' },
                    { bg: 'bg-violet-50', icon: 'bg-violet-100 text-violet-600', cat: 'text-violet-700',  sym: 'science' },
                    { bg: 'bg-rose-50',   icon: 'bg-rose-100 text-rose-600',    cat: 'text-rose-700',   sym: 'sports_baseball' },
                    { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600',  cat: 'text-amber-700',  sym: 'flag' },
                    { bg: 'bg-cyan-50',   icon: 'bg-cyan-100 text-cyan-600',    cat: 'text-cyan-700',   sym: 'public' },
                  ];
                  const p = palettes[index % palettes.length];
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-2xl border border-outline-variant/20 ${p.bg} hover:shadow-md transition-all cursor-pointer group`}
                      onClick={() => article.url && window.open(article.url, '_blank')}
                    >
                      <div className={`shrink-0 w-12 h-12 ${p.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined">{p.sym}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[9px] font-black tracking-widest ${p.cat} uppercase`}>
                            {article.category || 'World'} · {article.source}
                          </span>
                          {article.publishedAt && (
                            <span className="text-[9px] font-bold text-outline">
                              {new Date(article.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <h4 className="font-headline font-black text-sm md:text-base mb-1 leading-snug text-on-surface line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant font-medium line-clamp-1">
                          {article.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); showSnackbarAction('Article bookmarked!', 'bookmark'); }}
                          className="w-8 h-8 rounded-lg bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
                          title="Bookmark"
                        >
                          <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{fontSize:'16px'}}>bookmark</span>
                        </button>
                        {article.url && (
                          <button
                            onClick={e => { e.stopPropagation(); window.open(article.url, '_blank'); }}
                            className="w-8 h-8 rounded-lg bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
                            title="Open article"
                          >
                            <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{fontSize:'16px'}}>open_in_new</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
              <p className="text-xs text-outline font-medium">Powered by live news API · Updated every 10 min</p>
              <Link to="/smart-living" className="text-primary text-xs font-black uppercase tracking-wider hover:underline">Full News Hub →</Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatCard title="Expected Guests" value="142" icon="groups" color="bg-primary-fixed" textColor="text-primary" />
          <StatCard title="Vacation Absences" value={vacationData.status === 'leaving' ? '19' : '18'} icon="flight_takeoff" color="bg-secondary-container" textColor="text-on-secondary-container" />
          <StatCard title="Waste Reduction" value="12%" icon="eco" color="bg-tertiary-fixed" textColor="text-on-tertiary-fixed" />
        </div>
      </main>

      {/* Custom Animated Snackbar System */}
      {snackbar && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.3)] text-white px-6 py-4 rounded-3xl flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-400">{snackbar.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">System Action</p>
              <p className="text-sm font-headline font-bold">{snackbar.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pb-6 pt-2 px-4 bg-[#fbf8ff]/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] rounded-t-[1rem]">
        <MobileNavLink icon="home" label="Home" />
        <MobileNavLink icon="bed" label="Rooms" to="/room-booking" />
        <MobileNavLink icon="restaurant" label="Food" to="/food-menu" active />
        <MobileNavLink icon="person" label="Profile" />
      </nav>
      {/* UI Notification Snackbar layer */}
      <div className={`fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[90] transition-all duration-500 max-w-sm w-[90%] md:w-auto ${showUISnackbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-slate-900/40 flex items-center justify-between gap-4 border border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-0.5">New Modules Active</p>
                <p className="text-sm font-medium opacity-90 leading-tight">Explore the new Room Booking Map & Food Menu features below!</p>
             </div>
          </div>
          <button onClick={() => setShowUISnackbar(false)} className="text-slate-400 hover:text-white p-1 rounded-full transition-colors active:scale-90">
             <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
