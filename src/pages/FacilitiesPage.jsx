import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const FALLBACK = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600';

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bathrooms');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/sample/facilities')
      .then(r => r.json())
      .then(data => { if (data.success) setFacilities(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
      <Header activePage="Smart" />
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-teal-700 font-semibold">Loading facilities...</p>
      </div>
    </div>
  );

  const TABS = [
    { key: 'bathrooms', icon: '🚿', label: 'Bathrooms' },
    { key: 'laundry', icon: '🧺', label: 'Laundry' },
    { key: 'terraces', icon: '🌤️', label: 'Terraces & Drying' },
    { key: 'common', icon: '🛋️', label: 'Common Areas' },
    { key: 'security', icon: '🔒', label: 'Security & Lift' },
    { key: 'sanitation', icon: '🧹', label: 'Sanitation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 font-body">
      <Header activePage="Smart" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            🏨 Hostel Facilities
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Every Comfort, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Covered</span>
          </h1>
          <p className="text-slate-500 text-lg">Explore our world-class facilities — all maintained daily for your comfort.</p>
        </div>

        {/* Quick Stats   */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { icon: '🚿', label: 'Bathrooms', val: facilities.bathrooms.length },
            { icon: '🧺', label: 'Washing Machines', val: facilities.washingMachines.length },
            { icon: '☀️', label: 'Drying Areas', val: facilities.dryingAreas.length },
            { icon: '🌤️', label: 'Terraces', val: facilities.terraces.length },
            { icon: '🛗', label: 'Lift', val: facilities.lifts.available ? 'Yes' : 'No' },
            { icon: '📹', label: 'CCTV Cameras', val: facilities.security.cctvCount },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="text-3xl mb-1">{s.icon}</div>
              <p className="text-2xl font-black text-slate-800">{s.val}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.key ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-400'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* BATHROOMS */}
        {activeTab === 'bathrooms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.bathrooms.map(b => (
              <div key={b.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition">
                <div className="relative h-48 cursor-pointer group" onClick={() => setLightboxImg(b.images[0])}>
                  <img src={b.images[0]} alt="Bathroom" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = FALLBACK; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black text-white ${b.type === 'attached' ? 'bg-teal-500' : 'bg-slate-500'}`}>
                    {b.type === 'attached' ? '🚪 Attached' : '🤝 Common'}
                  </span>
                  {b.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">+{b.images.length - 1} more</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-800 mb-1">Floor {b.floor} Bathroom</h3>
                  <div className="flex flex-wrap gap-1">
                    {b.features.map((f, i) => <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">✓ {f}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LAUNDRY */}
        {activeTab === 'laundry' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">🧺 Washing Machines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {facilities.washingMachines.map(wm => (
                  <div key={wm.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
                    <div className="relative h-36">
                      <img src={wm.image} alt="Washing Machine" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'; }} />
                      <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-black ${wm.status === 'available' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {wm.status === 'available' ? '✓ Available' : '⏳ In Use'}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-black text-slate-800">{wm.id}</h4>
                      <p className="text-sm text-slate-500">{wm.location} · {wm.capacity} ({wm.type})</p>
                      <p className="text-xs text-slate-400 mt-1">{wm.status === 'in_use' ? `⏱️ ~${wm.remainingTime} remaining` : `Last used: ${wm.lastUsed}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TERRACES & DRYING AREAS */}
        {activeTab === 'terraces' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-4">🌤️ Terraces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {facilities.terraces.map(t => (
                  <div key={t.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                    <div className="relative h-56 cursor-pointer group" onClick={() => setLightboxImg(t.images[0])}>
                      <img src={t.images[0]} alt="Terrace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-black text-lg">Floor {t.floor} Terrace</p>
                        <p className="text-sm opacity-80">{t.size} · Open {t.openHours}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {t.facilities.map((f, i) => <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">☀️ {f}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-4">👗 Clothes Drying Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {facilities.dryingAreas.map(da => (
                  <div key={da.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
                    <div className="relative h-40 cursor-pointer" onClick={() => setLightboxImg(da.images[0])}>
                      <img src={da.images[0]} alt="Drying area" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-2 left-3 text-white font-bold text-sm">{da.location}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-slate-500 mb-2">Floor {da.floor} · Capacity: {da.capacity}</p>
                      <div className="flex flex-wrap gap-1">
                        {da.hasClothLines && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Cloth Lines</span>}
                        {da.hasHangers && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Hangers</span>}
                        {da.hasRopes && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Ropes</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMON AREAS */}
        {activeTab === 'common' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.commonAreas.map(ca => (
              <div key={ca.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition cursor-pointer group" onClick={() => setLightboxImg(ca.images[0])}>
                <div className="h-48 overflow-hidden">
                  <img src={ca.images[0]} alt={ca.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'; }} />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-slate-900 mb-1">{ca.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{ca.location}{ca.capacity ? ` · ${ca.capacity} persons` : ''}</p>
                  <div className="flex flex-wrap gap-1">
                    {ca.facilities.map((f, i) => <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">✓ {f}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECURITY & LIFT */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* LIFT */}
            <div className={`bg-white rounded-3xl p-6 shadow-lg border-l-4 ${facilities.lifts.available ? 'border-green-500' : 'border-red-400'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${facilities.lifts.available ? 'bg-green-100' : 'bg-red-100'}`}>🛗</div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Lift / Elevator</h3>
                  <span className={`text-sm font-bold ${facilities.lifts.available ? 'text-green-600' : 'text-red-600'}`}>{facilities.lifts.available ? '✓ Available' : '✗ Not Available'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { l: 'Make', v: facilities.lifts.type },
                  { l: 'Capacity', v: facilities.lifts.capacity },
                  { l: 'Floors Served', v: facilities.lifts.floors.join(', ') },
                  { l: 'Last Serviced', v: facilities.lifts.lastServiced },
                ].map((d, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-bold mb-1">{d.l}</p>
                    <p className="font-black text-slate-800">{d.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { icon: '📹', title: 'CCTV Surveillance', color: 'bg-blue-50 border-blue-200', items: [`${facilities.security.cctvCount} cameras installed`, '24/7 live monitoring', 'All common areas covered', 'Night vision enabled'] },
                { icon: '👮', title: 'Security Guards', color: 'bg-orange-50 border-orange-200', items: [`${facilities.security.guardCount} guards on duty`, facilities.security.guardTiming, 'Entry/exit log book maintained', 'Emergency response trained'] },
                { icon: '👆', title: 'Biometric Entry', color: 'bg-indigo-50 border-indigo-200', items: [facilities.security.biometricEntry ? 'Biometric scanner active' : 'Not installed', 'All entry/exit logged', 'Visitor ID mandatory', 'Night lockdown: 11 PM'] },
                { icon: '🔥', title: 'Fire Safety', color: 'bg-red-50 border-red-200', items: [`${facilities.security.fireExtinguishers} fire extinguishers`, `${facilities.security.fireAlarms} smoke alarms`, `${facilities.security.emergencyExit} emergency exits`, 'Emergency lights installed'] },
              ].map((s, i) => (
                <div key={i} className={`bg-white rounded-3xl p-6 shadow-sm border ${s.color}`}>
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><span className="text-2xl">{s.icon}</span> {s.title}</h3>
                  <ul className="space-y-2">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-green-500 font-black">✓</span> {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SANITATION */}
        {activeTab === 'sanitation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🧹', title: 'Daily Cleaning', detail: facilities.sanitation.cleaningSchedule, info: 'Rooms, corridors, and bathrooms cleaned every day. Garbage cleared morning and evening.', color: 'bg-emerald-50 border-emerald-200' },
              { icon: '🐛', title: 'Pest Control', detail: `Last: ${facilities.sanitation.lastPestControl}`, info: `Next scheduled: ${facilities.sanitation.nextPestControl}. Professional treatment every quarter.`, color: 'bg-amber-50 border-amber-200' },
              { icon: '🗑️', title: 'Garbage Disposal', detail: facilities.sanitation.garbageCollection, info: 'Segregated waste collection with dedicated bins at every floor.', color: 'bg-orange-50 border-orange-200' },
              { icon: '💧', title: 'Water Supply', detail: '24/7 Dual Source', info: facilities.sanitation.waterSupply + '. Municipal + borewell backup ensures constant flow.', color: 'bg-blue-50 border-blue-200' },
              { icon: '🧊', title: 'RO Water', detail: facilities.sanitation.roWater ? 'Available' : 'N/A', info: 'RO purified drinking water dispensers on every floor. Tested weekly.', color: 'bg-teal-50 border-teal-200' },
              { icon: '🪣', title: 'Water Purifier', detail: facilities.sanitation.waterPurifier ? 'Active' : 'Inactive', info: 'UV + RO water purifiers maintain potable water quality standards at all times.', color: 'bg-indigo-50 border-indigo-200' },
            ].map((s, i) => (
              <div key={i} className={`bg-white rounded-3xl p-6 shadow-sm border ${s.color}`}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-black text-slate-900 mb-1">{s.title}</h3>
                <p className="text-lg font-bold text-teal-700 mb-2">{s.detail}</p>
                <p className="text-sm text-slate-500">{s.info}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white font-black text-xl">✕</button>
          <img src={lightboxImg} alt="Full view" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
