import React from 'react';

const AdminProfileModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-modal-overlay" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-[420px] shadow-2xl overflow-hidden flex flex-col transform transition-all animate-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-dark-border flex justify-between items-center bg-dark-surface/50">
          <h3 className="text-base font-bold text-white">System Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-linear-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_20px_rgba(99,102,241,0.4)] mb-4 border-2 border-white/10">
            {email ? email.charAt(0).toUpperCase() : 'A'}
          </div>
          
          <h4 className="text-lg font-bold text-white mb-1">{email ? email.split('@')[0] : 'Administrator'}</h4>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-6">
            System Administrator
          </span>

          <div className="w-full space-y-4 text-sm bg-dark-surface/30 border border-dark-border/60 rounded-lg p-4">
            <div className="flex justify-between py-1 border-b border-dark-border/40">
              <span className="text-gray-400">Email Address</span>
              <span className="text-white font-medium">{email || 'admin@futeservices.com'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/40">
              <span className="text-gray-400">Access Role</span>
              <span className="text-white font-medium">Owner</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/40">
              <span className="text-gray-400">Security Type</span>
              <span className="text-white font-medium">JWT Bearer Auth</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Session Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active & Secure
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-dark-border bg-dark-surface/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-md text-white bg-brand-primary hover:brightness-110 active:brightness-95 transition-all cursor-pointer shadow-md border-none"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileModal;
