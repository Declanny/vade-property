'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Search, Check, AlertCircle } from 'lucide-react';
import { mockProperties, mockTenants, mockPropertyOwners } from '@/lib/data/adminMock';

const COMPLAINT_CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC / Air Conditioning' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'security', label: 'Security' },
  { value: 'noise', label: 'Noise Complaint' },
  { value: 'cleaning', label: 'Cleaning / Sanitation' },
  { value: 'structural', label: 'Structural Issues' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', description: 'Can be addressed within a week', color: 'text-gray-600' },
  { value: 'medium', label: 'Medium', description: 'Should be addressed within 2-3 days', color: 'text-blue-600' },
  { value: 'high', label: 'High', description: 'Needs attention within 24 hours', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', description: 'Requires immediate attention', color: 'text-red-600' },
];

export default function CreateComplaintPage() {
  const router = useRouter();
  const [propertySearch, setPropertySearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: '',
    tenantId: '',
    reportedBy: 'tenant', // 'tenant' or 'owner'
    category: 'maintenance',
    priority: 'medium',
    title: '',
    description: '',
  });

  const occupiedProperties = mockProperties.filter((p) => p.status === 'occupied');

  const filteredProperties = occupiedProperties.filter((property) => {
    if (!propertySearch.trim()) return true;
    const searchLower = propertySearch.toLowerCase();
    const owner = mockPropertyOwners.find((o) => o.id === property.ownerId);
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      owner?.firstName.toLowerCase().includes(searchLower) ||
      owner?.lastName.toLowerCase().includes(searchLower)
    );
  });

  const selectedProperty = mockProperties.find((p) => p.id === formData.propertyId);
  const selectedTenant = selectedProperty?.currentTenantId
    ? mockTenants.find((t) => t.id === selectedProperty.currentTenantId)
    : null;
  const selectedOwner = selectedProperty
    ? mockPropertyOwners.find((o) => o.id === selectedProperty.ownerId)
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectProperty = (propertyId: string) => {
    const property = mockProperties.find((p) => p.id === propertyId);
    setFormData((prev) => ({
      ...prev,
      propertyId,
      tenantId: property?.currentTenantId || '',
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Created!</h2>
          <p className="text-gray-600 mb-2">
            A new {formData.priority} priority {formData.category} complaint has been filed for{' '}
            {selectedProperty?.name}.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The complaint will appear in the complaints queue for resolution.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/admin/complaints"
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              View All Complaints
            </Link>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  propertyId: '',
                  tenantId: '',
                  reportedBy: 'tenant',
                  category: 'maintenance',
                  priority: 'medium',
                  title: '',
                  description: '',
                });
              }}
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Create Another Complaint
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
        href="/admin/complaints"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Complaints
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Complaint</h1>
        <p className="text-gray-600 mt-1">File a new complaint on behalf of a tenant or owner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Property */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Property</h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={propertySearch}
              onChange={(e) => setPropertySearch(e.target.value)}
              placeholder="Search properties by name, address, or owner..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>

          {/* Property List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredProperties.map((property) => {
              const owner = mockPropertyOwners.find((o) => o.id === property.ownerId);
              const tenant = mockTenants.find((t) => t.id === property.currentTenantId);
              return (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => selectProperty(property.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    formData.propertyId === property.id
                      ? 'border-[#0B3D2C] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{property.name}</p>
                      <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Owner: {owner?.firstName} {owner?.lastName}</span>
                        <span>Tenant: {tenant?.firstName} {tenant?.lastName}</span>
                      </div>
                    </div>
                    {formData.propertyId === property.id && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              );
            })}
            {filteredProperties.length === 0 && (
              <p className="text-center text-gray-500 py-4">No occupied properties found</p>
            )}
          </div>
        </div>

        {/* Complaint Details */}
        {formData.propertyId && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Complaint Details</h2>

            {/* Selected Property Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Property</p>
                  <p className="font-medium text-gray-900">{selectedProperty?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Owner</p>
                  <p className="font-medium text-gray-900">
                    {selectedOwner?.firstName} {selectedOwner?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tenant</p>
                  <p className="font-medium text-gray-900">
                    {selectedTenant?.firstName} {selectedTenant?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{selectedProperty?.address}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                <select
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  <option value="tenant">Tenant</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin (Internal)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PRIORITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: level.value }))}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.priority === level.value
                          ? 'border-[#0B3D2C] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className={`font-medium ${level.color}`}>{level.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Provide detailed information about the complaint..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Priority Warning */}
            {formData.priority === 'urgent' && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Urgent Priority Selected</p>
                  <p className="text-sm text-red-700 mt-1">
                    This will trigger immediate notifications to the property manager and maintenance team.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/complaints"
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || !formData.propertyId || !formData.title || !formData.description}
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Create Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
