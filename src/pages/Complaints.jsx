import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const BACKEND = 'http://127.0.0.1:5000';
const CATEGORIES = ['maintenance', 'food', 'cleanliness', 'security', 'noise', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const CATEGORY_ICONS = {
  maintenance: 'build', food: 'restaurant', cleanliness: 'cleaning_services',
  security: 'security', noise: 'volume_up', other: 'help',
};
const PRIORITY_COLORS = {
  low: 'border-green-300 bg-green-50 text-green-700',
  medium: 'border-yellow-300 bg-yellow-50 text-yellow-700',
  high: 'border-orange-300 bg-orange-50 text-orange-700',
  urgent: 'border-red-300 bg-red-50 text-red-700',
};

const MyComplaints = ({ complaints }) => (
  <div className="mt-8">
    <h3 className="font-headline text-xl font-bold text-primary mb-4">My Previous Complaints</h3>
    {complaints.length === 0
      ? <p className="text-on-surface-variant text-sm text-center py-8">No complaints filed yet.</p>
      : complaints.map(c => (
        <div key={c._id} className="bg-white rounded-xl p-5 mb-3 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-on-surface">{c.title}</p>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : c.status === 'in_review' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {c.status?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mb-2">{c.description}</p>
          {c.adminResponse && (
            <div className="bg-primary/5 rounded-lg p-3 mt-2 border-l-4 border-primary">
              <p className="text-xs font-bold text-primary mb-1">Admin Response:</p>
              <p className="text-sm text-on-surface">{c.adminResponse}</p>
            </div>
          )}
          {c.images?.length > 0 && (
            <div className="flex gap-2 mt-3">
              {c.images.slice(0, 3).map((img, i) => (
                <img key={i} src={img} alt={`proof-${i}`} className="w-14 h-14 object-cover rounded-lg border border-outline-variant/20" />
              ))}
            </div>
          )}
          <p className="text-[10px] text-outline mt-2">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      ))
    }
  </div>
);

const Complaints = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '', roomNumber: '', category: 'maintenance', priority: 'medium' });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myComplaints, setMyComplaints] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (token) fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/complaints/my`, { headers: { Authorization: `Bearer ${token}` } });
      setMyComplaints(res.data);
    } catch {}
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const analyzeImage = async (base64Image) => {
    try {
      const res = await axios.post(`${BACKEND}/api/image-analysis/analyze-image`, {
        image: base64Image
      });
      return res.data;
    } catch (err) {
      console.error('Image analysis failed:', err);
      return {
        isAI: false,
        confidence: 0,
        success: false
      };
    }
  };

  const processFiles = useCallback((files) => {
    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith('image/')) return;
      if (images.length >= 5) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgData = {
          src: e.target.result,
          name: file.name,
          isAI: false,
          confidence: 0,
          isScanning: true
        };

        setImages(prev => [...prev, imgData].slice(0, 5));

        try {
          const result = await analyzeImage(e.target.result);
          
          setImages(prevArr => prevArr.map(img => 
            img.src === e.target.result ? { 
              ...img, 
              isScanning: false,
              isAI: result.isAI || false,
              confidence: result.confidence || 0
            } : img
          ));
        } catch {
          setImages(prevArr => prevArr.map(img => 
            img.src === e.target.result ? { ...img, isScanning: false } : img
          ));
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images]);

  const handleFileChange = (e) => processFiles(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/'); return; }
    
    // Check if any AI images used
    if (images.some(img => img.isAI)) {
      setError('System Alert: AI-generated images detected. Please upload authentic smartphone photos of the issue.');
      return;
    }

    setLoading(true); setError('');
    try {
      await axios.post(`${BACKEND}/api/complaints`, {
        ...form,
        studentName: user.fullName || 'Unknown',
        studentEmail: user.email || '',
        images: images.map(img => img.src),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setForm({ title: '', description: '', roomNumber: '', category: 'maintenance', priority: 'medium' });
      setImages([]);
      fetchMyComplaints();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-24 pt-20">
      <Header activePage="Complaints" />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-10">
          <span className="font-label text-xs font-bold text-secondary tracking-[0.2em] uppercase block mb-3">Student Portal</span>
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">File a Complaint</h2>
          <p className="text-on-surface-variant mt-2">Attach photos as visual proof to speed up resolution.</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <p className="font-bold text-green-700">Complaint Submitted!</p>
              <p className="text-sm text-green-600">We'll review it and get back to you soon.</p>
            </div>
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">{error}</div>}

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setForm(p => ({ ...p, category: cat }))}
                    className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${form.category === cat ? 'border-primary bg-primary text-white' : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-primary/30'}`}>
                    <span className="material-symbols-outlined text-[20px]" style={form.category === cat ? { fontVariationSettings: "'FILL' 1" } : {}}>{CATEGORY_ICONS[cat]}</span>
                    <span className="capitalize text-xs">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Priority</label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map(p => (
                  <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    className={`py-2.5 rounded-xl border-2 text-xs font-bold capitalize transition-all ${form.priority === p ? PRIORITY_COLORS[p] + ' border-current' : 'border-outline-variant/20 text-on-surface-variant hover:border-current'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Room */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Complaint Title</label>
                <input id="title" type="text" placeholder="Broken AC, Dirty washroom..." value={form.title}
                  onChange={handleChange} required
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Room Number</label>
                <input id="roomNumber" type="text" placeholder="e.g. 302A" value={form.roomNumber}
                  onChange={handleChange} required
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
              <textarea id="description" rows={4} placeholder="Describe the issue in detail..." value={form.description}
                onChange={handleChange} required
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                Visual Proof <span className="text-outline font-medium normal-case tracking-normal">(up to 5 photos)</span>
              </label>

              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block" style={{ fontVariationSettings: "'FILL' 0" }}>
                  cloud_upload
                </span>
                <p className="font-semibold text-on-surface-variant text-sm">Drag photos here or click to browse</p>
                <p className="text-xs text-outline mt-1">PNG, JPG, WEBP up to 5MB each</p>
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className={`relative rounded-xl overflow-hidden h-24 bg-surface-container-low group border-2 ${img.isScanning ? 'border-primary animate-pulse' : img.isAI ? 'border-error' : 'border-success'}`}>
                      <img src={img.src} alt={`upload-${i}`} className={`w-full h-full object-cover transition-all ${img.isScanning ? 'blur-sm grayscale' : ''}`} />
                      
                      {/* Scanning Overlay */}
                      {img.isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                           <span className="material-symbols-outlined text-white animate-spin text-sm">sync</span>
                           <span className="text-[8px] text-white font-bold uppercase mt-1">Vision AI Scanning...</span>
                        </div>
                      )}

                      {/* Result Badge */}
                      {!img.isScanning && (
                        <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${img.isAI ? 'bg-error text-white' : 'bg-green-600 text-white'}`}>
                          {img.isAI ? 'AI Generated' : 'Real Photo'} ({img.confidence}%)
                        </div>
                      )}

                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="h-24 rounded-xl border-2 border-dashed border-outline-variant/40 flex items-center justify-center hover:border-primary/40 transition-colors">
                      <span className="material-symbols-outlined text-outline text-2xl">add</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 editorial-gradient text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading
                ? <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Submitting...</>
                : <><span className="material-symbols-outlined text-sm">send</span> Submit Complaint</>}
            </button>
          </form>
        </div>

        <MyComplaints complaints={myComplaints} />
      </main>
    </div>
  );
};

export default Complaints;
