import React from 'react';

const SummaryCards = ({ summary = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-linear-to-br from-slate-800 to-slate-900 border border-dark-border/40 rounded-xl p-5 relative overflow-hidden shadow-md flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-dark-surface/60" />
            <div className="flex justify-between items-center mb-2">
              <div className="w-16 h-3 rounded-xs animate-shimmer" />
              <div className="w-8 h-8 rounded-full animate-shimmer shrink-0" />
            </div>
            <div className="w-10 h-7 rounded-sm animate-shimmer mt-4" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Leads',
      count: summary.Total || 0,
      colorClass: 'bg-indigo-500',
      textClass: 'text-indigo-400',
      bgClass: 'bg-indigo-500/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'New Leads',
      count: summary.New || 0,
      colorClass: 'bg-lead-new',
      textClass: 'text-lead-new',
      bgClass: 'bg-lead-new/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Contacted Leads',
      count: summary.Contacted || 0,
      colorClass: 'bg-lead-contacted',
      textClass: 'text-lead-contacted',
      bgClass: 'bg-lead-contacted/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: 'Site Visit Scheduled',
      count: summary['Site Visit Scheduled'] || 0,
      colorClass: 'bg-lead-visit',
      textClass: 'text-lead-visit',
      bgClass: 'bg-lead-visit/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Closed Leads',
      count: summary.Closed || 0,
      colorClass: 'bg-lead-closed',
      textClass: 'text-lead-closed',
      bgClass: 'bg-lead-closed/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Lost Leads',
      count: summary.Lost || 0,
      colorClass: 'bg-lead-lost',
      textClass: 'text-lead-lost',
      bgClass: 'bg-lead-lost/12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-linear-to-br from-slate-800 to-slate-900 border border-dark-border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:border-brand-primary/30 hover:shadow-[0_4px_20px_rgba(99,102,241,0.12)] cursor-pointer shadow-md"
        >
          {/* Card Accent Top Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${card.colorClass}`} />
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">{card.title}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 hover:rotate-12 ${card.bgClass} ${card.textClass}`}>
              {card.icon}
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2 transition-all duration-300">{card.count}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
