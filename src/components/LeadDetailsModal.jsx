import React from 'react';

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const baseClass = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border";
    switch (status) {
      case 'New':
        return <span className={`${baseClass} bg-lead-new/10 text-lead-new border-lead-new/20`}><span className="w-1.5 h-1.5 rounded-full bg-lead-new"></span>New</span>;
      case 'Contacted':
        return <span className={`${baseClass} bg-lead-contacted/10 text-lead-contacted border-lead-contacted/20`}><span className="w-1.5 h-1.5 rounded-full bg-lead-contacted"></span>Contacted</span>;
      case 'Site Visit Scheduled':
        return <span className={`${baseClass} bg-lead-visit/10 text-lead-visit border-lead-visit/20`}><span className="w-1.5 h-1.5 rounded-full bg-lead-visit"></span>Site Visit</span>;
      case 'Closed':
        return <span className={`${baseClass} bg-lead-closed/10 text-lead-closed border-lead-closed/20`}><span className="w-1.5 h-1.5 rounded-full bg-lead-closed"></span>Closed</span>;
      case 'Lost':
        return <span className={`${baseClass} bg-lead-lost/10 text-lead-lost border-lead-lost/20`}><span className="w-1.5 h-1.5 rounded-full bg-lead-lost"></span>Lost</span>;
      default:
        return <span className={`${baseClass} bg-gray-500/10 text-gray-400 border-gray-500/20`}>{status}</span>;
    }
  };

  const renderFollowUpAlert = (dateString) => {
    if (!dateString) return null;
    
    const followUpDate = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    const compareDate = new Date(followUpDate);
    compareDate.setHours(0,0,0,0);
    
    const timeDiff = compareDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return (
        <div className="col-span-2 bg-lead-lost/10 border border-lead-lost/25 text-red-200 px-4 py-3 rounded-lg text-sm mb-2 flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-lead-lost animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
          <span>
            <strong className="font-semibold text-white">Overdue Follow-up!</strong> Outstanding call scheduled for {formatDate(dateString).split(' at')[0]}. Contact immediately.
          </span>
        </div>
      );
    } else if (daysDiff === 0) {
      return (
        <div className="col-span-2 bg-lead-visit/10 border border-lead-visit/25 text-yellow-100 px-4 py-3 rounded-lg text-sm mb-2 flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-lead-visit">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>
            <strong className="font-semibold text-white">Scheduled for Today!</strong> Make sure to make this call and record details.
          </span>
        </div>
      );
    } else {
      return (
        <div className="col-span-2 bg-lead-new/10 border border-lead-new/25 text-blue-200 px-4 py-3 rounded-lg text-sm mb-2 flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-lead-new">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12v7.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <span>
            Upcoming follow-up scheduled in <strong className="font-semibold text-white">{daysDiff} days</strong> ({formatDate(dateString).split(' at')[0]}).
          </span>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-modal-overlay" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-[620px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between bg-dark-surface">
          <h3 className="text-base font-bold text-white">Lead Profile & History</h3>
          <button className="text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Header Identity Card */}
            <div className="col-span-1 md:col-span-2 bg-linear-to-br from-slate-800 to-slate-900 border border-dark-border p-5 rounded-xl flex items-center gap-4 mb-2 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xl font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">{lead.name}</span>
                <span className="text-xs text-gray-400 mt-1">
                  Enquired on {formatDate(lead.createdAt).split(' at')[0]}
                </span>
              </div>
            </div>

            {/* Follow-up Banner */}
            {renderFollowUpAlert(lead.followUpDate)}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Email Address</span>
              <span className="text-sm text-white font-medium break-all">{lead.email}</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Phone Number</span>
              <span className="text-sm text-white font-medium">{lead.phone}</span>
            </div>

            {/* Property */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Interested Property</span>
              <span className="text-sm text-white font-medium">{lead.property}</span>
            </div>

            {/* Unit Type & Budget */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Unit & Budget</span>
              <span className="text-sm text-white font-medium">
                {lead.unitType} — <span className="text-emerald-400 font-semibold">{lead.budget}</span>
              </span>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Enquiry Status</span>
              <div className="mt-0.5">
                {getStatusBadge(lead.status)}
              </div>
            </div>

            {/* Lead Source */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Lead Source</span>
              <span className="text-sm text-white font-medium">{lead.source}</span>
            </div>

            {/* Scheduled Follow-up Date */}
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Scheduled Follow-up Date</span>
              <span className="text-sm text-white font-medium">
                {lead.followUpDate ? formatDate(lead.followUpDate).split(' at')[0] : 'No follow-up scheduled'}
              </span>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Enquiry Notes & Comments</span>
              <div className="bg-dark-bg border border-dark-border rounded-md p-4 text-gray-400 italic text-sm whitespace-pre-line leading-relaxed">
                {lead.notes || 'No interaction notes recorded for this enquiry.'}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-dark-border bg-dark-surface flex justify-end">
          <button
            className="px-5 py-2 text-sm font-semibold rounded-md text-white bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:brightness-95 transition-all cursor-pointer shadow-md"
            onClick={onClose}
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
