import React from 'react';

const AnalyticsView = ({ leads }) => {
  const statusCounts = {
    New: 0,
    Contacted: 0,
    'Site Visit Scheduled': 0,
    Closed: 0,
    Lost: 0,
  };

  const unitCounts = {
    '2 BHK': 0,
    '3 BHK': 0,
    'Villa': 0,
  };

  leads.forEach((lead) => {
    if (statusCounts.hasOwnProperty(lead.status)) {
      statusCounts[lead.status]++;
    }
    if (unitCounts.hasOwnProperty(lead.unitType)) {
      unitCounts[lead.unitType]++;
    }
  });

  const totalLeads = leads.length;

  const getPercentage = (count) => {
    if (totalLeads === 0) return 0;
    return Math.round((count / totalLeads) * 100);
  };

  const statusColors = {
    New: 'bg-lead-new',
    Contacted: 'bg-lead-contacted',
    'Site Visit Scheduled': 'bg-lead-visit',
    Closed: 'bg-lead-closed',
    Lost: 'bg-lead-lost',
  };

  const maxUnitCount = Math.max(...Object.values(unitCounts), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Lead Status Distribution Progress Grid */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col shadow-sm">
        <h3 className="text-base font-semibold text-white mb-5">Lead Status Distribution</h3>
        <div className="flex flex-col gap-5 justify-center flex-grow">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = getPercentage(count);
            return (
              <div key={status} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{status}</span>
                  <span className="text-gray-400">
                    {count} leads ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-800 ${statusColors[status]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Preferences Vertical Column Bar Chart */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col shadow-sm">
        <h3 className="text-base font-semibold text-white mb-5">Unit Type Preferences</h3>
        <div className="flex items-center justify-center gap-8 flex-grow min-h-[220px] pb-4">
          <div className="flex items-end justify-around h-[180px] w-full pt-4 border-b border-dark-border">
            {Object.entries(unitCounts).map(([unit, count]) => {
              const heightPercentage = Math.round((count / maxUnitCount) * 100);
              const percentage = getPercentage(count);
              return (
                <div key={unit} className="flex flex-col items-center w-1/4">
                  <div
                    className="w-10 bg-linear-to-t from-brand-secondary to-brand-primary rounded-t-md relative min-h-[4px] transition-all duration-500 shadow-md"
                    style={{
                      height: `${Math.max(heightPercentage * 1.2, 8)}px`,
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">{count}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-2 text-center whitespace-nowrap">
                    {unit}
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">{percentage}%</div>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
