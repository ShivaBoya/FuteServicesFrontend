import React, { useState, useEffect } from 'react';

const AddEditLeadModal = ({ isOpen, onClose, onSubmit, lead = null }) => {
  const isEdit = !!lead;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    unitType: '2 BHK',
    budget: '',
    source: 'Website',
    status: 'New',
    notes: '',
    followUpDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      let formattedDate = '';
      if (lead.followUpDate) {
        formattedDate = new Date(lead.followUpDate).toISOString().split('T')[0];
      }
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        property: lead.property || '',
        unitType: lead.unitType || '2 BHK',
        budget: lead.budget || '',
        source: lead.source || 'Website',
        status: lead.status || 'New',
        notes: lead.notes || '',
        followUpDate: formattedDate,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        property: '',
        unitType: '2 BHK',
        budget: '',
        source: 'Website',
        status: 'New',
        notes: '',
        followUpDate: '',
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.property.trim()) {
      newErrors.property = 'Interested Property is required';
    }

    if (!formData.unitType) {
      newErrors.unitType = 'Unit type is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null,
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-bg/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-modal-overlay" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-[620px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between bg-dark-surface">
          <h3 className="text-base font-bold text-white">{isEdit ? 'Edit Buyer Enquiry' : 'Add New Buyer Enquiry'}</h3>
          <button className="text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
          <div className="p-6 overflow-y-auto flex-grow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="name" className="text-xs font-semibold text-gray-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="text-red-400 text-xs mt-1.5">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-xs font-semibold text-gray-400 mb-2">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600"
                  placeholder="e.g. rajesh@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="text-red-400 text-xs mt-1.5">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-xs font-semibold text-gray-400 mb-2">Phone Number *</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="text-red-400 text-xs mt-1.5">{errors.phone}</span>}
              </div>

              {/* Property */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="property" className="text-xs font-semibold text-gray-400 mb-2">Interested Property *</label>
                <input
                  type="text"
                  id="property"
                  name="property"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600"
                  placeholder="e.g. Green Valley Residency"
                  value={formData.property}
                  onChange={handleChange}
                />
                {errors.property && <span className="text-red-400 text-xs mt-1.5">{errors.property}</span>}
              </div>

              {/* Unit Type */}
              <div className="flex flex-col">
                <label htmlFor="unitType" className="text-xs font-semibold text-gray-400 mb-2">Unit Type *</label>
                <select
                  id="unitType"
                  name="unitType"
                  className="w-full bg-dark-surface border border-dark-border rounded-md px-3 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                  value={formData.unitType}
                  onChange={handleChange}
                >
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="Villa">Villa</option>
                </select>
                {errors.unitType && <span className="text-red-400 text-xs mt-1.5">{errors.unitType}</span>}
              </div>

              {/* Budget */}
              <div className="flex flex-col">
                <label htmlFor="budget" className="text-xs font-semibold text-gray-400 mb-2">Budget *</label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600"
                  placeholder="e.g. 85 Lakhs / 2.1 Cr"
                  value={formData.budget}
                  onChange={handleChange}
                />
                {errors.budget && <span className="text-red-400 text-xs mt-1.5">{errors.budget}</span>}
              </div>

              {/* Lead Source */}
              <div className="flex flex-col">
                <label htmlFor="source" className="text-xs font-semibold text-gray-400 mb-2">Lead Source</label>
                <select
                  id="source"
                  name="source"
                  className="w-full bg-dark-surface border border-dark-border rounded-md px-3 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label htmlFor="status" className="text-xs font-semibold text-gray-400 mb-2">Lead Status *</label>
                <select
                  id="status"
                  name="status"
                  className="w-full bg-dark-surface border border-dark-border rounded-md px-3 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
                {errors.status && <span className="text-red-400 text-xs mt-1.5">{errors.status}</span>}
              </div>

              {/* Follow-up Date */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="followUpDate" className="text-xs font-semibold text-gray-400 mb-2">Next Follow-up Date (Optional)</label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all text-gray-300"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="notes" className="text-xs font-semibold text-gray-400 mb-2">Interactions / Internal Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-2.5 text-white text-sm focus:outline-hidden focus:border-brand-primary transition-all placeholder:text-gray-600 resize-none"
                  placeholder="Enter details of conversation, client preferences..."
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-dark-border bg-dark-surface flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium rounded-md border border-dark-border text-gray-300 bg-transparent hover:text-white hover:border-gray-400 hover:bg-white/3 transition-all cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:brightness-95 transition-all cursor-pointer shadow-md"
            >
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditLeadModal;
