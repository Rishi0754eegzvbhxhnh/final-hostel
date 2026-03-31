import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Wallet, QrCode, ShieldCheck, History, TrendingUp, Zap, Trophy, ArrowRight, Activity, Wallet2, Building2, Banknote, ShieldAlert, Sparkles, Receipt, DownloadCloud, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentCountdown from '../components/PaymentCountdown';

const GatewayCard = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 group relative overflow-hidden ${active ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
  >
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'}`}>
        <Icon className="w-8 h-8" />
     </div>
     <div className="text-center">
        <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</p>
     </div>
  </button>
);

const TransactionItem = ({ title, date, amount, status, type }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
     <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'tuition' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
           {type === 'tuition' ? <Building2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
        </div>
        <div>
           <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs group-hover:text-indigo-600 transition-colors">{title}</h4>
           <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{status}</span>
           </div>
        </div>
     </div>
     <div className="text-right">
        <p className="text-xl font-headline font-black text-slate-900">₹{amount}</p>
        <button className="text-[10px] text-indigo-600 font-black uppercase hover:underline">Receipt</button>
     </div>
  </div>
);

const PaymentHub = () => {
  const location = useLocation();
  const [activeMethod, setActiveMethod] = useState('upi');
  const [showCheckout, setShowCheckout] = useState(location.state?.autoOpenCheckout || false);
  const [stage, setStage] = useState('summary'); // 'summary' | 'processing' | 'success'
  const [totalPayable, setTotalPayable] = useState(location.state?.amount || 8500);
  const [nextDueDate, setNextDueDate] = useState(new Date('2026-04-05'));
  const [daysLeft, setDaysLeft] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/payments/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setNextDueDate(new Date(res.data.nextDueDate));
          setDaysLeft(res.data.daysLeft);
          setTotalPaid(res.data.totalPaid);
        }
      } catch (err) {
        console.error('Failed to fetch payment status:', err);
      }
    };
    fetchPaymentStatus();
  }, [token]);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const today = new Date();
      const due = new Date(nextDueDate);
      const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff);
    };
    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 60000);
    return () => clearInterval(interval);
  }, [nextDueDate]);

  const tx = [
    { title: 'Hostel Rent - April', date: 'Mar 12, 2026', amount: 8500, status: 'Success', type: 'rent' },
    { title: 'Electricity Arrears', date: 'Mar 08, 2026', amount: 450, status: 'Success', type: 'utility' },
    { title: 'Mess Advance', date: 'Feb 28, 2026', amount: 3200, status: 'Success', type: 'rent' },
  ];

  const handlePay = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('success');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] font-body text-slate-950 pb-20 pt-20">
      
      {/* Dynamic Header HUD */}
      <section className="bg-indigo-600 pt-32 pb-48 px-8 relative overflow-hidden">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-600 to-transparent z-10" />
         <div className="absolute inset-0 z-0 opacity-10">
            <Globe className="absolute -right-20 -bottom-20 w-[400px] h-[400px] text-white animate-spin-slow" />
         </div>
         
         <div className="max-w-6xl mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-indigo-200" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">256-Bit Neural Encrypted</p>
               </div>
               <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-[0.85] uppercase text-white mb-8 text-center md:text-left">Seamless <br /> <span className="text-white/40">Ledger</span></h1>
               
               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center gap-6">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-900/10">
                        <Banknote className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-60">Total Outstanding</p>
                        <p className="text-3xl font-headline font-black">₹12,450</p>
                     </div>
                  </div>
               </div>
            </motion.div>
            
            <div className="w-full md:w-[350px] bg-slate-950/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 space-y-6 text-center md:text-left">
               <div className="flex justify-between items-center opacity-60">
                  <p className="text-[10px] font-black uppercase tracking-widest">Next Due Date</p>
                  <History className="w-4 h-4" />
               </div>
               <h3 className="text-4xl font-headline font-black tracking-tight uppercase leading-none">April 05, <br /> 2026</h3>
               <p className="text-indigo-200 text-sm font-medium italic opacity-80">"Early payments boost your Sustainable Score and unlock Hall of Fame points."</p>
               <PaymentCountdown daysLeft={daysLeft} dueDate={nextDueDate} />
               <button 
                 onClick={() => setShowCheckout(true)}
                 className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-900/10 hover:bg-indigo-300 hover:text-white transition-all"
               >
                 Execute Settlement
               </button>
             </div>
         </div>
      </section>

      {/* Main Payment Grid */}
      <main className="max-w-6xl mx-auto px-6 -mt-24 relative z-30">
        
         {/* Statistics HUD */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <PaymentCountdown daysLeft={daysLeft} dueDate={nextDueDate} />
            
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200 flex flex-col justify-between">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                     <History className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+12% Savings</span>
               </div>
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Paid (2026)</p>
                  <p className="text-3xl font-headline font-black text-slate-900">₹{totalPaid.toLocaleString()}</p>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200 flex flex-col justify-between">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                     <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Premium Tier</span>
               </div>
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Neural Eco Points</p>
                  <p className="text-3xl font-headline font-black text-slate-900">4,820</p>
               </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[3rem] shadow-2xl shadow-indigo-950/20 text-white flex flex-col justify-between overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-[60px] group-hover:scale-125 transition-transform" />
               <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                     <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Analysis Mode</span>
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Monthly Billing Trend</p>
                  <p className="text-3xl font-headline font-black">Optimized</p>
               </div>
            </div>
         </div>

        {/* Transaction History */}
        <div className="space-y-8">
           <div className="flex items-center justify-between pl-6 border-l-4 border-indigo-600 mb-8">
              <div>
                 <h2 className="text-3xl font-headline font-black text-slate-950 uppercase tracking-tighter">Transaction Ledger</h2>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Found 42 records across the current cycle</p>
              </div>
              <div className="flex gap-2">
                 <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                    <DownloadCloud className="w-5 h-5" />
                 </button>
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all">
                   Filter Cycle
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {tx.map((t, i) => (
                <TransactionItem key={i} {...t} />
              ))}
              <button className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-all">
                 Load Full History Ledger
              </button>
           </div>
        </div>

      </main>

      {/* Checkout Modal Overlay */}
      <AnimatePresence>
         {showCheckout && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-4">
               <motion.div initial={{ y: 100, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 100, scale: 0.95 }} className="bg-white w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                  
                  <button onClick={() => { setShowCheckout(false); setStage('summary'); }} className="absolute top-10 right-10 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                     <ArrowRight className="w-5 h-5 rotate-45" />
                  </button>

                  <AnimatePresence mode='wait'>
                     {stage === 'summary' && (
                        <motion.div key="sum" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Settlement Portal</span>
                              <h4 className="text-4xl font-headline font-black uppercase tracking-tighter leading-none">Finalize Transaction</h4>
                           </div>
                           
                           <div className="grid grid-cols-3 gap-4">
                              <GatewayCard icon={QrCode} label="UPI / GPay" active={activeMethod === 'upi'} onClick={() => setActiveMethod('upi')} />
                              <GatewayCard icon={CreditCard} label="Cards / NFC" active={activeMethod === 'card'} onClick={() => setActiveMethod('card')} />
                              <GatewayCard icon={Wallet2} label="Hostel Wallet" active={activeMethod === 'wallet'} onClick={() => setActiveMethod('wallet')} />
                           </div>

                           <div className="bg-slate-50 rounded-[2rem] p-8 space-y-4">
                              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                 <span>Rent Settlement</span>
                                 <span className="text-slate-900">₹{totalPayable}</span>
                              </div>
                              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                 <span>Utility Balance</span>
                                 <span className="text-slate-900">₹450</span>
                              </div>
                              <div className="h-px bg-slate-200" />
                              <div className="flex justify-between items-center">
                                 <span className="text-sm font-black uppercase tracking-tighter">Total Payable</span>
                                 <span className="text-3xl font-headline font-black text-indigo-600">₹{totalPayable + 450}</span>
                              </div>
                           </div>

                           <button 
                             onClick={handlePay}
                             className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-900/10 hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                           >
                             Authorize Gateway <ArrowRight className="w-5 h-5" />
                           </button>
                        </motion.div>
                     )}

                     {stage === 'processing' && (
                        <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-8">
                           <div className="w-24 h-24 bg-indigo-50 rounded-full mx-auto flex items-center justify-center">
                              <Zap className="w-12 h-12 text-indigo-600 animate-pulse" />
                           </div>
                           <h4 className="text-2xl font-headline font-black uppercase tracking-tighter">Neural Signal Transmitting...</h4>
                           <p className="text-slate-400 text-sm font-medium italic">"Please do not refresh. Synchronizing payment with the hostel neural ledger."</p>
                        </motion.div>
                     )}

                     {stage === 'success' && (
                        <motion.div key="succ" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-8">
                           <div className="w-28 h-28 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                 <ShieldCheck className="w-14 h-14 text-white" />
                              </motion.div>
                           </div>
                           <div>
                              <h4 className="text-4xl font-headline font-black text-slate-950 uppercase tracking-tighter leading-none mb-2">Settlement <br /> Efficient</h4>
                              <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Transaction Verified: #99201-AL</p>
                           </div>
                           <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100/50 flex items-center justify-center gap-4">
                              <Sparkles className="w-6 h-6 text-amber-500" />
                              <span className="text-sm font-black text-amber-900 uppercase tracking-tighter">Achievement Unlocked: Early Bird +200 Pts</span>
                           </div>
                           <button onClick={() => setShowCheckout(false)} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                              Return to Dashboard
                           </button>
                        </motion.div>
                     )}
                  </AnimatePresence>
                  
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        .animate-spin-slow { animation: spin 30s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />

    </div>
  );
};

export default PaymentHub;
