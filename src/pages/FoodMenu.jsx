import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const BACKEND = 'http://localhost:5000';
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_EMOJIS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };
const MEAL_COLORS = {
  breakfast: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800', icon: 'text-amber-600' },
  lunch: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800', icon: 'text-orange-600' },
  dinner: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-800', icon: 'text-indigo-600' },
};

const upcomingHolidays = [
  { name: "Ugadi", date: "March 30, 2026", note: "Mess closed. Packed sweets will be distributed to all rooms." },
  { name: "Good Friday", date: "April 3, 2026", note: "Dinner closed. Light snacks available from 7–9 PM." },
  { name: "Eid al-Fitr", date: "March 31, 2026", note: "Special Biryani & Sheer Khurma at lunch!" },
];

const FoodMenu = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayIndex = today.getDay();

  const [weekMenu, setWeekMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [activeMeal, setActiveMeal] = useState('lunch');
  const [notificationPref, setNotificationPref] = useState('email');
  const [notifSet, setNotifSet] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND}/api/sample/menu`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setWeekMenu(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentDayMenu = weekMenu?.[DAYS[selectedDay]];

  const handleSetNotification = () => {
    setNotifSet(true);
    setTimeout(() => setNotifSet(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <Header activePage="Food" />
      <div className="text-center mt-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-amber-700 font-semibold">Loading today's menu...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 font-body">
      <Header activePage="Food" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <span>🍽️</span> Smart Mess Menu
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Hostel <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Mess Calendar</span>
          </h1>
          <p className="text-slate-500 text-lg">Nutritious, hygienic, and home-like meals — prepared fresh every day.</p>
        </div>

        {/* Week Calendar Selector */}
        <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100 mb-8">
          <div className="grid grid-cols-7 gap-2">
            {DAY_LABELS.map((label, idx) => {
              const isToday = idx === todayIndex;
              const isSelected = idx === selectedDay;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex flex-col items-center py-3 rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : isToday
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
                  <span className="text-lg font-black mt-1">
                    {new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayIndex + idx).getDate()}
                  </span>
                  {isToday && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1"></span>}
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm font-semibold text-slate-500 mt-3">
            Viewing: <span className="text-indigo-600 font-black">{DAY_FULL[selectedDay]}</span>
          </p>
        </div>

        {/* Meal Tabs (Breakfast / Lunch / Dinner) */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {['breakfast', 'lunch', 'dinner'].map(meal => (
            <button
              key={meal}
              onClick={() => setActiveMeal(meal)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shrink-0 ${
                activeMeal === meal
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400'
              }`}
            >
              <span>{MEAL_EMOJIS[meal]}</span>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
              {currentDayMenu?.[meal]?.time && (
                <span className={`text-[10px] px-2 py-1 rounded-full ${activeMeal === meal ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                  {currentDayMenu[meal].time}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        {currentDayMenu && currentDayMenu[activeMeal] ? (
          <div className={`rounded-3xl border-2 overflow-hidden shadow-xl ${MEAL_COLORS[activeMeal].border} ${MEAL_COLORS[activeMeal].bg} mb-8`}>
            {/* Hero Image */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img
                src={currentDayMenu[activeMeal].image}
                alt={activeMeal}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2 ${MEAL_COLORS[activeMeal].badge}`}>
                  {MEAL_EMOJIS[activeMeal]} {activeMeal} · {currentDayMenu[activeMeal].time}
                </div>
                <p className="text-2xl font-black">{DAY_FULL[selectedDay]}'s {activeMeal.charAt(0).toUpperCase() + activeMeal.slice(1)}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentDayMenu[activeMeal].items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-white">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-black ${MEAL_COLORS[activeMeal].badge}`}>
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100 mb-8">
            <span className="text-5xl mb-3 block">🍽️</span>
            <p className="text-slate-500 font-semibold">Menu not available for this day.</p>
          </div>
        )}

        {/* Bottom Row: Notifications + Holidays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-black text-slate-900 text-lg mb-1">📲 Meal Reminder Notifications</h3>
            <p className="text-sm text-slate-500 mb-5">Get notified before every meal so you never miss out!</p>
            <div className="flex flex-col gap-3">
              {['email', 'mobile', 'both'].map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${notificationPref === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input type="radio" name="notifPref" value={opt} checked={notificationPref === opt} onChange={() => setNotificationPref(opt)} className="accent-indigo-600" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm capitalize">{opt === 'both' ? 'Both (Email + Mobile)' : `${opt.charAt(0).toUpperCase() + opt.slice(1)} only`}</p>
                    <p className="text-xs text-slate-400">{opt === 'email' ? 'Get menu delivered to your inbox' : opt === 'mobile' ? 'Get SMS/push notification' : 'Full coverage'}</p>
                  </div>
                </label>
              ))}
              <button
                onClick={handleSetNotification}
                className="mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl hover:shadow-lg transition-all text-sm uppercase tracking-wider"
              >
                {notifSet ? '✅ Preferences Saved!' : 'Save Notification Preference'}
              </button>
            </div>
          </div>

          {/* Upcoming Holidays & Mess Schedule */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-black text-slate-900 text-lg mb-1">🎉 Upcoming Holidays & Mess Schedule</h3>
            <p className="text-sm text-slate-500 mb-5">Plan your meals around these special dates.</p>
            <div className="space-y-4">
              {upcomingHolidays.map((h, i) => (
                <div key={i} className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl shrink-0">📅</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{h.name} <span className="font-normal text-slate-400">— {h.date}</span></p>
                    <p className="text-xs text-slate-600 mt-0.5">{h.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FoodMenu;
