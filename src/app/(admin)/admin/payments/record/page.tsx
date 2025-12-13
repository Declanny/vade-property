'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Search, Check, DollarSign } from 'lucide-react';
import { mockTenants, mockProperties, mockPropertyOwners } from '@/lib/data/adminMock';

const PAYMENT_TYPES = [
  { value: 'rent', label: 'Monthly Rent' },
  { value: 'security_deposit', label: 'Security Deposit' },
  { value: 'late_fee', label: 'Late Fee' },
  { value: 'maintenance', label: 'Maintenance Fee' },
  { value: 'utility', label: 'Utility Payment' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card Payment' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mobile_money', label: 'Mobile Money' },
];

export default function RecordPaymentPage() {
  const router = useRouter();
  const [tenantSearch, setTenantSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    type: 'rent',
    amount: '',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionReference: '',
    notes: '',
  });

  const activeTenants = mockTenants.filter((t) => t.leaseStatus === 'active');

  const filteredTenants = activeTenants.filter((tenant) => {
    if (!tenantSearch.trim()) return true;
    const searchLower = tenantSearch.toLowerCase();
    return (
      tenant.firstName.toLowerCase().includes(searchLower) ||
      tenant.lastName.toLowerCase().includes(searchLower) ||
      tenant.email.toLowerCase().includes(searchLower)
    );
  });

  const selectedTenant = mockTenants.find((t) => t.id === formData.tenantId);
  const selectedProperty = selectedTenant
    ? mockProperties.find((p) => p.currentTenantId === selectedTenant.id)
    : null;

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount || '0') : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectTenant = (tenantId: string) => {
    const tenant = mockTenants.find((t) => t.id === tenantId);
    const property = mockProperties.find((p) => p.currentTenantId === tenantId);
    setFormData((prev) => ({
      ...prev,
      tenantId,
      propertyId: property?.id || '',
      amount: formData.type === 'rent' && tenant?.monthlyRent ? tenant.monthlyRent.toString() : prev.amount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Recorded!</h2>
          <p className="text-gray-600 mb-2">
            Payment of {formatCurrency(formData.amount)} has been recorded for{' '}
            {selectedTenant?.firstName} {selectedTenant?.lastName}.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Transaction Reference: {formData.transactionReference || 'N/A'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/admin/payments"
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              View All Payments
            </Link>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  tenantId: '',
                  propertyId: '',
                  type: 'rent',
                  amount: '',
                  paymentMethod: 'bank_transfer',
                  paymentDate: new Date().toISOString().split('T')[0],
                  transactionReference: '',
                  notes: '',
                });
              }}
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Record Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/payments"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payments
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
        <p className="text-gray-600 mt-1">Manually record a payment from a tenant</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Tenant */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Tenant</h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tenantSearch}
              onChange={(e) => setTenantSearch(e.target.value)}
              placeholder="Search tenants by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>

          {/* Tenant List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTenants.map((tenant) => {
              const property = mockProperties.find((p) => p.currentTenantId === tenant.id);
              return (
                <button
                  key={tenant.id}
                  type="button"
                  onClick={() => selectTenant(tenant.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    formData.tenantId === tenant.id
                      ? 'border-[#0B3D2C] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: '#0B3D2C' }}
                      >
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {tenant.firstName} {tenant.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{property?.name || 'No property'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(tenant.monthlyRent || 0)}/mo</p>
                      <p className={`text-xs ${tenant.rentStatus === 'current' ? 'text-green-600' : 'text-red-600'}`}>
                        {tenant.rentStatus === 'current' ? 'Current' : 'Overdue'}
                      </p>
                    </div>
                    {formData.tenantId === tenant.id && (
                      <Check className="w-5 h-5 text-green-600 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
            {filteredTenants.length === 0 && (
              <p className="text-center text-gray-500 py-4">No tenants found</p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        {formData.tenantId && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>

            {/* Selected Tenant Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedTenant?.firstName} {selectedTenant?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedProperty?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Monthly Rent</p>
                  <p className="font-bold" style={{ color: '#0B3D2C' }}>
                    {formatCurrency(selectedTenant?.monthlyRent || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) => {
                    handleChange(e);
                    const rent = selectedTenant?.monthlyRent;
                    if (e.target.value === 'rent' && rent) {
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value,
                        amount: rent.toString(),
                      }));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  {PAYMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
                {formData.amount && (
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(formData.amount)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
                <input
                  type="text"
                  name="transactionReference"
                  value={formData.transactionReference}
                  onChange={handleChange}
                  placeholder="e.g., TXN-123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any additional notes about this payment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/payments"
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || !formData.tenantId || !formData.amount}
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Recording...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Record Payment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
