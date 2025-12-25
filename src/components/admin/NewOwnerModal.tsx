'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { mockPropertyOwners } from '@/lib/data/adminMock';

export interface NewOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOwnerCreated: (ownerId: string) => void;
}

export function NewOwnerModal({ isOpen, onClose, onOwnerCreated }: NewOwnerModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const newOwner = {
      id: `owner-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: 'property_owner' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      propertiesCount: 0,
      totalProperties: 0,
      totalTenants: 0,
      monthlyRevenue: 0,
      bankDetails: formData.bankName ? {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      } : undefined,
    };

    // Add to mock data (in production, this would be an API call)
    mockPropertyOwners.push(newOwner);

    // Notify parent and reset
    onOwnerCreated(newOwner.id);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Create New Owner</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>

          {/* Bank Details (Optional) */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Bank Details (Optional)</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Select or enter bank"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="0000000000"
                    maxLength={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountName: e.target.value }))}
                    placeholder="Account holder name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Create Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
