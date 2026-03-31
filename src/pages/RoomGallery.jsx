import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const FALLBACK = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800';
const TYPE_COLORS = {
  single: 'bg-indigo-100 text-indigo-700',
  shared: 'bg-blue-100 text-blue-700',
  double: 'bg-violet-100 text-violet-700',
  premium: 'bg-amber-100 text-amber-800',
};

const RoomGallery = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/sample/rooms')
      .then(r => r.json())
      .then(data => { if (data.success) setRooms(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
      <Header activePage="Rooms" />
      <div className="text-center mt-24">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 font-semibold">Loading room gallery...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-body">
      <Header activePage="Rooms" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            🏠 Room Gallery
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Perfect Room</span>
          </h1>
          <p className="text-slate-500 text-lg">Click any room for full gallery view, amenities, and 360° virtual tour.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🚪', label: 'Total Rooms', value: rooms.length },
            { icon: '✅', label: 'Available', value: rooms.filter(r => r.currentOccupancy < r.capacity).length },
            { icon: '❄️', label: 'AC Rooms', value: rooms.filter(r => r.ac).length },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">{s.icon}</div>
              <div>
                <p className="text-3xl font-black text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map(room => {
            const available = room.currentOccupancy < room.capacity;
            return (
              <div
                key={room.id}
                onClick={() => { setSelectedRoom(room); setImgIdx(0); }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={room.images.main}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = FALLBACK; }}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {available ? '✓ Available' : '⊘ Full'}
                    </span>
                    {room.has360View && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white">
                        360° Tour
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-black/60 text-white text-xs font-bold rounded-full backdrop-blur">
                      Floor {room.floor}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-2xl font-black">₹{room.price}<span className="text-sm font-normal opacity-80">/mo</span></p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Room {room.roomNumber}</h3>
                      <p className="text-sm text-slate-500">{room.windowView}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${TYPE_COLORS[room.type] || 'bg-slate-100 text-slate-600'}`}>
                      {room.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.ac && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">❄️ AC</span>}
                    {room.attachedBathroom && <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">🚿 Attached Bath</span>}
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">👥 {room.currentOccupancy}/{room.capacity}</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold">📐 {room.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedRoom(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Image Gallery */}
              <div className="relative h-72 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedRoom.images.gallery[imgIdx] || selectedRoom.images.main}
                  alt="Room view"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = FALLBACK; }}
                />
                <button onClick={() => setSelectedRoom(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-800 font-black text-xl">✕</button>
                {selectedRoom.has360View && (
                  <div className="absolute bottom-4 left-4">
                    <a href={selectedRoom.view360Url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                       className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg">
                      <span>🌐</span> View 360°
                    </a>
                  </div>
                )}
              </div>

              {/* Thumbnail row */}
              {selectedRoom.images.gallery.length > 1 && (
                <div className="flex gap-2 px-6 py-3 border-b border-slate-100 overflow-x-auto">
                  {selectedRoom.images.gallery.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-indigo-500 scale-110' : 'border-slate-200 hover:border-slate-400'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = FALLBACK; }} />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Room {selectedRoom.roomNumber}</h2>
                    <p className="text-slate-500">{selectedRoom.windowView} · Floor {selectedRoom.floor}</p>
                  </div>
                  <p className="text-3xl font-black text-indigo-600">₹{selectedRoom.price}<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: '🏷️', label: 'Type', value: selectedRoom.type },
                    { icon: '📐', label: 'Size', value: selectedRoom.size },
                    { icon: '👥', label: 'Occupancy', value: `${selectedRoom.currentOccupancy}/${selectedRoom.capacity}` },
                    { icon: '🚿', label: 'Bathroom', value: selectedRoom.attachedBathroom ? 'Attached' : 'Shared' },
                    { icon: '❄️', label: 'AC', value: selectedRoom.ac ? 'Yes' : 'No' },
                    { icon: '🏢', label: 'Floor', value: selectedRoom.floor },
                    { icon: '🌄', label: 'View', value: selectedRoom.windowView },
                    { icon: '✅', label: 'Status', value: selectedRoom.currentOccupancy < selectedRoom.capacity ? 'Available' : 'Full' },
                  ].map((det, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">{det.icon} {det.label}</p>
                      <p className="font-black text-slate-800 text-sm">{det.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Amenities Included</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">✓ {a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGallery;
