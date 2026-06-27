import React, { useState, useEffect } from 'react';

const LeadTable = ({
  leads,
  loading = false,
  filters,
  onFilterChange,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onExportCSV,
  onAddNewClick,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Sync internal state when filters.search changes from parent (e.g. on reset)
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  // Debounce the onFilterChange('search') updates by 250ms
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange('search', searchTerm);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onFilterChange, filters.search]);

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Search and Filters Toolbar */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-6 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full bg-dark-bg/60 border border-dark-border rounded-md pl-10 pr-4 py-2 text-white text-sm focus:outline-hidden focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 transition-all placeholder:text-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:brightness-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              onClick={onAddNewClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Lead
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-dark-border text-gray-300 bg-transparent hover:text-white hover:border-gray-400 hover:bg-white/3 transition-all flex items-center gap-2 cursor-pointer"
              onClick={onExportCSV}
              title="Export current filtered list to CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-dark-border pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Status</label>
              <select
                className="bg-dark-surface border border-dark-border rounded-md px-3 py-1.5 text-white text-xs cursor-pointer focus:outline-hidden focus:border-brand-primary"
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                <option value="Closed">Closed</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Unit Type</label>
              <select
                className="bg-dark-surface border border-dark-border rounded-md px-3 py-1.5 text-white text-xs cursor-pointer focus:outline-hidden focus:border-brand-primary"
                value={filters.unitType}
                onChange={(e) => onFilterChange('unitType', e.target.value)}
              >
                <option value="All">All Units</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Sort By Date</label>
              <select
                className="bg-dark-surface border border-dark-border rounded-md px-3 py-1.5 text-white text-xs cursor-pointer focus:outline-hidden focus:border-brand-primary"
                value={filters.sortOrder}
                onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-gray-400 self-end">
            Showing <strong className="text-white">{leads.length}</strong> leads
          </div>
        </div>
      </div>

      {/* Desktop Leads Table */}
      <div className="hidden md:block bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-dark-surface/60 border-b border-dark-border">
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Lead Name</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Email</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Phone Number</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Interested Property</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Unit</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Budget</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4">Created Date</th>
                <th className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-dark-border/40">
                    <td className="px-5 py-5"><div className="w-24 h-4 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-32 h-3.5 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-24 h-3.5 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-36 h-3.5 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-12 h-4 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-16 h-4 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-16 h-5 rounded-full animate-shimmer" /></td>
                    <td className="px-5 py-5"><div className="w-20 h-3.5 rounded-xs animate-shimmer" /></td>
                    <td className="px-5 py-5">
                      <div className="flex gap-2 justify-center">
                        <div className="w-8 h-8 rounded-md animate-shimmer shrink-0" />
                        <div className="w-8 h-8 rounded-md animate-shimmer shrink-0" />
                        <div className="w-8 h-8 rounded-md animate-shimmer shrink-0" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{lead.name}</td>
                    <td className="px-5 py-4 text-gray-300">{lead.email}</td>
                    <td className="px-5 py-4 text-gray-300 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-5 py-4 text-gray-300">{lead.property}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-sm bg-slate-800 text-gray-400 text-xs font-medium">{lead.unitType}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">{lead.budget}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                    <td className="px-5 py-4 w-[130px]">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="w-8 h-8 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-new hover:border-lead-new/40 hover:bg-lead-new/5"
                          title="View Details"
                          onClick={() => onViewClick(lead)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-visit hover:border-lead-visit/40 hover:bg-lead-visit/5"
                          title="Edit Lead"
                          onClick={() => onEditClick(lead)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-lost hover:border-lead-lost/40 hover:bg-lead-lost/5"
                          title="Delete Lead"
                          onClick={() => onDeleteClick(lead._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-20 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <h3 className="text-white font-medium text-base">No leads found</h3>
                      <p className="text-xs">Try adjusting your search terms or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Leads List (Cards) */}
      <div className="md:hidden space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                  <div className="w-32 h-4 rounded-xs animate-shimmer" />
                  <div className="w-40 h-3 rounded-xs animate-shimmer" />
                </div>
                <div className="w-16 h-5 rounded-full animate-shimmer shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 py-3 border-y border-dark-border/40 text-xs">
                <div className="space-y-1.5">
                  <div className="w-16 h-2 rounded-xs bg-dark-hover/40" />
                  <div className="w-24 h-3.5 rounded-xs animate-shimmer" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-16 h-2 rounded-xs bg-dark-hover/40" />
                  <div className="w-16 h-3.5 rounded-xs animate-shimmer" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <div className="w-28 h-2 rounded-xs bg-dark-hover/40" />
                  <div className="w-48 h-3.5 rounded-xs animate-shimmer" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="w-24 h-3 rounded-xs animate-shimmer" />
                <div className="flex gap-2">
                  <div className="w-8.5 h-8.5 rounded-md animate-shimmer shrink-0" />
                  <div className="w-8.5 h-8.5 rounded-md animate-shimmer shrink-0" />
                  <div className="w-8.5 h-8.5 rounded-md animate-shimmer shrink-0" />
                </div>
              </div>
            </div>
          ))
        ) : leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead._id} className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-base truncate">{lead.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{lead.email}</p>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(lead.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-3 border-y border-dark-border/40 text-xs">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] font-bold">Phone Number</span>
                  <span className="text-gray-300 font-semibold">{lead.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] font-bold">Estimated Budget</span>
                  <span className="text-white font-bold text-sm">{lead.budget}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] font-bold">Property & Unit Selection</span>
                  <span className="text-gray-200 font-medium">
                    {lead.property}
                    <span className="text-[10px] bg-slate-800 border border-slate-700/60 text-gray-300 px-1.5 py-0.5 rounded ml-1.5 font-bold uppercase">{lead.unitType}</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Created: {formatDate(lead.createdAt)}</span>
                <div className="flex gap-2">
                  <button
                    className="w-8.5 h-8.5 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-new hover:bg-lead-new/5 hover:border-lead-new/20"
                    title="View Details"
                    onClick={() => onViewClick(lead)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button
                    className="w-8.5 h-8.5 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-visit hover:bg-lead-visit/5 hover:border-lead-visit/20"
                    title="Edit Lead"
                    onClick={() => onEditClick(lead)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    className="w-8.5 h-8.5 rounded-md border border-dark-border bg-dark-surface text-gray-400 flex items-center justify-center cursor-pointer transition-all hover:text-lead-lost hover:bg-lead-lost/5 hover:border-lead-lost/20"
                    title="Delete Lead"
                    onClick={() => onDeleteClick(lead._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-dark-card border border-dark-border rounded-xl text-center py-16 text-gray-500 flex flex-col items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h3 className="text-white font-medium text-base">No leads found</h3>
            <p className="text-xs">Adjust your search criteria or filter presets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTable;
