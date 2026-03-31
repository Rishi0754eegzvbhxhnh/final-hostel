import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ activePage = "Home" }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-b border-indigo-500/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center px-4 md:px-6 py-3 lg:py-4 w-full max-w-[1800px] mx-auto gap-3 lg:gap-6">
        
        {/* TOP ROW (Mobile) / LEFT SIDE (Desktop) */}
        <div className="flex justify-between items-center w-full lg:w-auto">
          {/* LOGO AREA & BACK ARROW */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {activePage !== "Home" && (
              <Link to="/dashboard" className="p-2 bg-indigo-50 dark:bg-slate-800 rounded-full hover:bg-indigo-100 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors shadow-sm group">
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </Link>
            )}

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[1rem] bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 ${activePage === "Home" ? "lg:ml-2" : ""}`}>
                {user ? <span className="font-headline font-black text-xl md:text-2xl">{user.fullName.charAt(0)}</span> : <span className="material-symbols-outlined text-xl md:text-2xl">hotel_class</span>}
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800 dark:from-indigo-400 dark:to-violet-400 font-headline leading-none">Smart Hostel<span className="text-indigo-600">OS</span></h1>
                {user && <span className="text-[9px] md:text-[11px] font-bold text-indigo-500/90 uppercase tracking-[0.2em] mt-0.5 line-clamp-1 opacity-80">{user.fullName}</span>}
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS & LOGOUT (Mobile Only) */}
          <div className="flex lg:hidden items-center gap-2">
            <button className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
            </button>
            {user ? (
              <button onClick={handleLogout} className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            ) : (
              <Link to="/" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase">Sign In</Link>
            )}
          </div>
        </div>

        {/* SCROLLABLE NAVIGATION LINKS */}
        <div className="w-full lg:flex-1 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
          <nav className="flex items-center gap-1 md:gap-2 lg:justify-center min-w-max p-1.5 lg:bg-slate-50/80 lg:dark:bg-slate-800/50 rounded-2xl lg:border lg:border-slate-200/60 lg:shadow-inner">
            <NavLink to="/dashboard" icon="space_dashboard" label="Home" active={activePage === "Home"} />
            <NavLink to="/discovery" icon="travel_explore" label="Discover" active={activePage === "Discovery"} />
            <NavLink to="/hostels" icon="apartment" label="Hostels" active={activePage === "Hostels"} />
            <NavLink to="/room-booking" icon="bed" label="Rooms" active={activePage === "Rooms"} />
            <NavLink to="/payment" icon="account_balance_wallet" label="Payments" active={activePage === "Payments"} />
            <NavLink to="/complaints" icon="support_agent" label="Fix It" active={activePage === "Complaints"} />
            <NavLink to="/smart-living" icon="memory" label="Smart" active={activePage === "Smart"} />
            <NavLink to="/smart-os" icon="lightbulb" label="IoT" active={activePage === "IoT"} />
            <NavLink to="/events" icon="attractions" label="Hub" active={activePage === "Events"} />
            <NavLink to="/gamification" icon="military_tech" label="Win" active={activePage === "Win"} />
            {user?.role === 'admin' && <NavLink to="/admin/predictive" icon="monitoring" label="Forecast" active={activePage === "Forecast"} />}
          </nav>
        </div>

        {/* PROFILE / ACTIONS (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <button className="relative p-3 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-[24px] group-hover:text-indigo-600 transition-colors">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-[2.5px] border-white dark:border-slate-800 animate-pulse"></span>
          </button>
          
          {user ? (
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 dark:from-rose-500/10 dark:to-red-500/10 text-rose-600 dark:text-rose-400 rounded-2xl transition-all duration-300 shadow-sm border border-rose-100/50"
            >
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">logout</span>
            </button>
          ) : (
            <Link to="/" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5">Sign In</Link>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link 
    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl md:rounded-2xl transition-all duration-300 shrink-0 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-black scale-105' : 'bg-transparent text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 font-bold'} text-[11px] md:text-xs tracking-widest uppercase relative group`}
    to={to}
  >
    <span className="material-symbols-outlined text-[18px] md:text-[20px] transition-transform duration-300 group-hover:-translate-y-0.5" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
    <span className={`${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </Link>
);

export default Header;
