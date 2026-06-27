import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import LeadTable from '../components/LeadTable';
import AddEditLeadModal from '../components/AddEditLeadModal';
import LeadDetailsModal from '../components/LeadDetailsModal';
import AnalyticsView from '../components/AnalyticsView';
import AdminProfileModal from '../components/AdminProfileModal';

const Dashboard = ({ email, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState({});
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    unitType: 'All',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadLeads = useCallback(async () => {
    try {
      setLeadsLoading(true);
      const data = await api.getLeads(filters);
      setLeads(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLeadsLoading(false);
    }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const data = await api.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard stats summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch summary once on component mount
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Fetch leads when filters change
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    if (justLoggedIn === 'true') {
      showToast('Login successful! Welcome back, Administrator.');
      sessionStorage.removeItem('just_logged_in');
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedLead && selectedLead._id) {
        await api.updateLead(selectedLead._id, formData);
        showToast('Lead details updated successfully!');
      } else {
        await api.createLead(formData);
        showToast('New buyer lead enquiry added successfully!');
      }
      setIsAddEditOpen(false);
      setSelectedLead(null);
      loadLeads();
      loadSummary();
    } catch (err) {
      showToast(err.message || 'Error saving lead details', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteLead(deleteConfirmId);
      showToast('Lead deleted successfully.', 'success');
      setDeleteConfirmId(null);
      loadLeads();
      loadSummary();
    } catch (err) {
      showToast(err.message || 'Failed to delete lead', 'error');
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast('No leads available to export.', 'error');
      return;
    }

    const headers = [
      'Lead Name',
      'Phone Number',
      'Email Address',
      'Interested Property',
      'Unit Type',
      'Budget',
      'Lead Source',
      'Status',
      'Follow-up Date',
      'Created Date',
      'Notes'
    ];

    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.phone}"`,
      `"${lead.email}"`,
      `"${lead.property.replace(/"/g, '""')}"`,
      `"${lead.unitType}"`,
      `"${lead.budget}"`,
      `"${lead.source}"`,
      `"${lead.status}"`,
      `"${lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'N/A'}"`,
      `"${new Date(lead.createdAt).toLocaleDateString()}"`,
      `"${(lead.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Fute_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads exported to CSV successfully!');
  };

  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100 font-sans relative">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <div className={`bg-dark-surface border border-dark-border border-l-4 p-4 rounded-lg shadow-xl text-white text-sm flex items-center gap-3 transition-all ${toast.type === 'success' ? 'border-l-lead-closed' : 'border-l-lead-lost'}`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-lead-closed">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-lead-lost">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-[260px] bg-dark-card border-r border-dark-border flex flex-col transition-all duration-300 z-40 fixed md:static top-0 bottom-0 h-screen md:h-auto ${sidebarOpen ? 'left-0' : '-left-[260px]'} md:left-0`}>
        <div className="px-6 py-5 flex items-center gap-3 border-b border-dark-border">
          <div className="w-9 h-9 bg-linear-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            F
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Fute Services</span>
        </div>

        <nav className="p-4 flex flex-col gap-1.5 flex-grow">
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all w-full text-left cursor-pointer border-none ${activeTab === 'overview' ? 'text-white bg-dark-surface border-l-3 border-brand-primary font-semibold' : 'text-gray-400 bg-transparent hover:text-white hover:bg-dark-surface'}`}
            onClick={() => {
              setActiveTab('overview');
              setSidebarOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Buyer Enquiries
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all w-full text-left cursor-pointer border-none ${activeTab === 'analytics' ? 'text-white bg-dark-surface border-l-3 border-brand-primary font-semibold' : 'text-gray-400 bg-transparent hover:text-white hover:bg-dark-surface'}`}
            onClick={() => {
              setActiveTab('analytics');
              setSidebarOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            Leads Analytics
          </button>
        </nav>

        <div className="p-5 border-t border-dark-border flex flex-col gap-4">
          <button
            onClick={() => setIsAdminProfileOpen(true)}
            className="flex items-center gap-3 w-full bg-transparent hover:bg-dark-surface/40 p-2 rounded-lg transition-all cursor-pointer border-none text-left"
          >
            <div className="w-9 h-9 bg-dark-surface rounded-full flex items-center justify-center text-white font-bold border border-dark-border shrink-0">
              {email ? email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-sm font-semibold text-white truncate">{email.split('@')[0]}</div>
              <div className="text-[10px] text-gray-400">System Admin</div>
            </div>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-md border border-red-500/25 bg-transparent hover:bg-red-500/10 text-red-300 hover:text-red-200 transition-all cursor-pointer w-full"
            onClick={onLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Overlay (on mobile drawer open state) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 shrink-0">
          <button
            className="text-white hover:text-gray-300 md:hidden cursor-pointer mr-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          <h2 className="text-base font-bold text-white">
            {activeTab === 'overview' ? 'Buyer Enquiries Dashboard' : 'Lead Analytics Distribution'}
          </h2>
          
          <div className="text-xs text-gray-400 font-medium hidden sm:block">
            Real Estate Sales Portal
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6">
          {error && (
            <div className="bg-lead-lost/10 border border-lead-lost/25 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'overview' ? (
            <>
              <SummaryCards summary={summary} loading={summaryLoading} />
              <LeadTable
                leads={leads}
                loading={leadsLoading}
                filters={filters}
                onFilterChange={handleFilterChange}
                onViewClick={(lead) => {
                  setSelectedLead(lead);
                  setIsDetailsOpen(true);
                }}
                onEditClick={(lead) => {
                  setSelectedLead(lead);
                  setIsAddEditOpen(true);
                }}
                onDeleteClick={(id) => setDeleteConfirmId(id)}
                onExportCSV={handleExportCSV}
                onAddNewClick={() => {
                  setSelectedLead(null);
                  setIsAddEditOpen(true);
                }}
              />
            </>
          ) : (
            <AnalyticsView leads={leads} />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddEditLeadModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleFormSubmit}
        lead={selectedLead}
      />

      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
      />

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-lead-lost/10 text-lead-lost flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Delete Buyer Enquiry</h3>
              <p className="text-sm text-gray-400 mt-2">Are you sure you want to delete this lead? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-dark-border bg-dark-surface flex gap-3">
              <button
                type="button"
                className="flex-grow py-2 text-sm font-medium rounded-md border border-dark-border text-gray-300 bg-transparent hover:text-white hover:border-gray-400 hover:bg-white/3 transition-all cursor-pointer"
                onClick={() => setDeleteConfirmId(null)}
              >
                No, Keep
              </button>
              <button
                type="button"
                className="flex-grow py-2 text-sm font-semibold rounded-md text-white bg-lead-lost hover:brightness-110 active:brightness-95 transition-all cursor-pointer shadow-md"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        onClose={() => setIsAdminProfileOpen(false)}
        email={email}
      />
    </div>
  );
};

export default Dashboard;
