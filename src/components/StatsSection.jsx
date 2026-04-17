import React from 'react';

const StatsSection = () => {
  return (
    <div className="relative w-full py-24 px-6 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      
      {/* Section Title (Optional) */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Metrics</h2>
      </div>

      {/* Stats Container */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: PAYBACK */}
        {/* Changed from rectangle to rounded-[2rem] for capsule/soft feel */}
        <div className="relative p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
           <div className="text-sm text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mb-2">// PAYBACK_PERIOD</div>
           <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">6 MO</div>
           <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
             You will recover your investment in approximately half a year.
           </p>
        </div>

        {/* CARD 2: DELTA */}
        <div className="relative p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
           <div className="text-sm text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mb-2">// SALARY_DELTA</div>
           <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">35%</div>
           <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
             Instant jump in market value compared to your current baseline.
           </p>
        </div>

      </div>
    </div>
  );
};

export default StatsSection;