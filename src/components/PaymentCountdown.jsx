import React from 'react';

const PaymentCountdown = ({ daysLeft, dueDate }) => {
  const maxDays = 30;
  const percentage = Math.max(0, Math.min(100, (daysLeft / maxDays) * 100));
  
  const isUrgent = daysLeft <= 5;
  const isWarning = daysLeft <= 10 && daysLeft > 5;
  
  const getColor = () => {
    if (isUrgent) return '#EF4444';
    if (isWarning) return '#F59E0B';
    return '#10B981';
  };
  
  const getBgColor = () => {
    if (isUrgent) return 'bg-red-50';
    if (isWarning) return 'bg-amber-50';
    return 'bg-emerald-50';
  };

  return (
    <div className={`p-6 rounded-[2rem] border transition-all ${getBgColor()} ${isUrgent ? 'border-red-200' : isWarning ? 'border-amber-200' : 'border-emerald-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'text-red-500' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isUrgent ? '⚠️ URGENT' : isWarning ? '⏰ DUE SOON' : '✓ ON TRACK'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-1">Days Until Payment</p>
          <h3 className={`text-4xl font-headline font-black ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-900'}`}>
            {daysLeft}
            <span className="text-lg font-normal text-slate-400 ml-1">days</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Due: {dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
          </p>
        </div>
        
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={getColor()}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-black ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
      
      {isUrgent && (
        <div className="mt-4 p-3 bg-red-100 rounded-xl">
          <p className="text-xs font-bold text-red-700 text-center">
            ⚠️ Payment overdue! Please clear dues immediately to avoid penalties.
          </p>
        </div>
      )}
      
      {isWarning && !isUrgent && (
        <div className="mt-4 p-3 bg-amber-100 rounded-xl">
          <p className="text-xs font-bold text-amber-700 text-center">
            ⏰ Payment due soon! Plan your settlement.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentCountdown;
