import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../components/Header';
import { Search, MapPin, Wifi, Utensils, Wind, Shield, BookOpen, Clock, Users, Star, Sparkles, ChevronRight, Filter, Home, DollarSign, Zap } from 'lucide-react';

const BACKEND = 'http://localhost:5000';

const HostelDiscovery = () => {
  const [preferences, setPreferences] = useState({
    budget: '',
    foodType: 'both',
    washrooms: 'any',
    studyNeeds: false,
    lateGate: false,
    security: true,
    location: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [quickSearches] = useState([
    { label: 'Under ₹5000', query: { budget: 5000 } },
    { label: 'AC Rooms', query: { ac: true } },
    { label: 'With Food', query: { food: true } },
    { label: 'Near College', query: { location: 'college' } }
  ]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setShowResults(true);
    
    try {
      const res = await axios.post(`${BACKEND}/api/discovery/recommend`, preferences);
      if (res.data.success) {
        setResults(res.data.recommendations);
        
        const searchEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          preferences: { ...preferences },
          resultsCount: res.data.count
        };
        setSearchHistory(prev => [searchEntry, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    }
    
    setLoading(false);
  };

  const quickSearch = (query) => {
    const newPrefs = { ...preferences, ...query };
    setPreferences(newPrefs);
    setTimeout(() => {
      setLoading(true);
      setShowResults(true);
      axios.post(`${BACKEND}/api/discovery/recommend`, newPrefs)
        .then(res => {
          if (res.data.success) setResults(res.data.recommendations);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 100);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-body">
      <Header activePage="Discovery" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Discovery
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-black text-slate-900 tracking-tight mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect Hostel</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Tell us your preferences and our AI will find the best matching hostels for you
          </p>
        </motion.div>

        {/* Quick Searches */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {quickSearches.map((qs, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => quickSearch(qs.query)}
              className="px-6 py-3 bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              {qs.label}
            </motion.button>
          ))}
        </div>

        {/* Main Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Budget */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Monthly Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={preferences.budget}
                  onChange={(e) => handlePreferenceChange('budget', e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg font-semibold"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-red-500" />
                Preferred Location
              </label>
              <input
                type="text"
                value={preferences.location}
                onChange={(e) => handlePreferenceChange('location', e.target.value)}
                placeholder="Near college, market, etc."
                className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            {/* Food Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-orange-500" />
                Food Preference
              </label>
              <select
                value={preferences.foodType}
                onChange={(e) => handlePreferenceChange('foodType', e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
              >
                <option value="both">Vegetarian + Non-Veg</option>
                <option value="veg">Pure Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
                <option value="none">No Food Required</option>
              </select>
            </div>

            {/* Washrooms */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Home className="w-4 h-4 text-blue-500" />
                Washroom Type
              </label>
              <select
                value={preferences.washrooms}
                onChange={(e) => handlePreferenceChange('washrooms', e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
              >
                <option value="any">Any</option>
                <option value="attached">Attached</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 block">
                Amenities Required
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'studyNeeds', icon: BookOpen, label: 'Study Room' },
                  { key: 'lateGate', icon: Clock, label: 'Late Gate' },
                  { key: 'security', icon: Shield, label: 'Security' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => handlePreferenceChange(item.key, !preferences[item.key])}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 text-sm font-semibold transition-all ${
                      preferences[item.key] 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Search Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Find Best Match
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-black text-slate-900">
                {loading ? 'Searching...' : `Found ${results.length} Matching Hostels`}
              </h2>
              <button 
                onClick={() => setShowResults(false)}
                className="text-sm text-slate-500 hover:text-indigo-600 font-semibold"
              >
                Clear Results
              </button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.map((room, i) => (
                  <motion.div
                    key={room._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-headline font-bold text-slate-900">{room.type || 'Standard Room'}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {room.location || 'City Center'}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border-2 ${getScoreBg(room.matchScore || 0)}`}>
                        <span className={`text-2xl font-black ${getScoreColor(room.matchScore || 0)}`}>
                          {room.matchScore || 0}%
                        </span>
                        <p className="text-[10px] font-bold uppercase text-center">Match</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-headline font-black text-indigo-600">₹{room.price || 0}</span>
                      <span className="text-slate-400">/month</span>
                      <span className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                        <Star className="w-4 h-4 fill-current" /> 4.{5 - i}.{8 + i}
                      </span>
                    </div>

                    {/* Match Reasons */}
                    {room.reasons && room.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.reasons.map((reason, j) => (
                          <span key={j} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(room.facilities || []).map((facility, j) => (
                        <span key={j} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {facility}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        Book Now <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : !loading && (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-headline font-bold text-slate-700 mb-2">No Exact Matches Found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your preferences or browse all available hostels</p>
                <button 
                  onClick={() => setPreferences({ budget: '', foodType: 'both', washrooms: 'any', studyNeeds: false, lateGate: false, security: true, location: '' })}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          {[
            { icon: Sparkles, title: 'AI-Powered', desc: 'Smart matching based on your preferences', color: 'indigo' },
            { icon: Shield, title: 'Verified Hostels', desc: 'All listings are verified by our team', color: 'emerald' },
            { icon: Zap, title: 'Instant Booking', desc: 'Book your room in minutes', color: 'amber' },
            { icon: Users, title: '24/7 Support', desc: 'Round-the-clock assistance available', color: 'rose' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 bg-${feature.color}-50 rounded-2xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
              </div>
              <h3 className="font-headline font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- NEW SECTION: CORE OFFERINGS & STRICT POLICIES --- */}
        <div className="mt-20 mb-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-black text-slate-900 tracking-tight">
              Standard <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Offerings & Policies</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Every Smart Hostel maintains a premium standard of living combined with strict disciplinary rules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-headline font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Premium Living Offerings
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Wind className="w-5 h-5 text-indigo-600" /></div>
                  <div>
                    <p className="font-bold text-slate-800">Room Configurations</p>
                    <p className="text-sm text-slate-500">Choose between AC and Fan rooms. Attached and shared washroom facilities are clearly displayed on every booking page.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg"><Wifi className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <p className="font-bold text-slate-800">24/7 Hot Water & Free WiFi</p>
                    <p className="text-sm text-slate-500">Uninterrupted high-speed internet access and constant hot water supply in all configurations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg"><Utensils className="w-5 h-5 text-orange-600" /></div>
                  <div>
                    <p className="font-bold text-slate-800">Healthy Food & Homely Environment</p>
                    <p className="text-sm text-slate-500">Nutritious, hygienic, and healthy meals served daily in a safe, homely, and welcoming ecosystem.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 rounded-lg"><Shield className="w-5 h-5 text-emerald-600" /></div>
                  <div>
                    <p className="font-bold text-slate-800">24/7 Security Surveillance</p>
                    <p className="text-sm text-slate-500">State-of-the-art CCTV monitoring and digital gate logs ensure absolute safety.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Strict Rules */}
            <div className="bg-rose-50 rounded-3xl p-8 shadow-xl border border-rose-100">
              <h3 className="text-xl font-headline font-bold text-rose-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">gavel</span> Strict Hostel Policies
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100"><span className="material-symbols-outlined text-rose-600">smoke_free</span></div>
                  <div>
                    <p className="font-bold text-rose-900">Zero Tolerance for Intoxicants</p>
                    <p className="text-sm text-rose-700/80">It is <strong>seriously taboo</strong> and strictly prohibited to consume or possess alcohol, cigarettes, or any illegal substances on the premises. Immediate expulsion applies.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100"><span className="material-symbols-outlined text-rose-600">payments</span></div>
                  <div>
                    <p className="font-bold text-rose-900">Punctual Fee Payments</p>
                    <p className="text-sm text-rose-700/80">Fee payment should be made strictly on time. Late payments may result in immediate late fines or suspension of smart amenities.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100"><span className="material-symbols-outlined text-rose-600">directions_run</span></div>
                  <div>
                    <p className="font-bold text-rose-900">Vacation & Moving Out</p>
                    <p className="text-sm text-rose-700/80">Prior written information and official notice is mandatory before you vacate from the hostel. Security deposits rely on this notice.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HostelDiscovery;
