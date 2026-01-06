'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Building2, Check } from 'lucide-react';
import { mockProperties } from '@/lib/data/adminMock';
import { ROLE_LABELS, type StaffRole } from '@/lib/types/staff';

export default function AddStaffPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff' as StaffRole,
    assignedPropertyIds: [] as string[],
  });

  // Get shortlet-enabled properties
  const shortletProperties = mockProperties.filter(
    (p) => p.allowShortlet || p.units?.some((u) => u.allowShortlet)
  );

  const handlePropertyToggle = (propertyId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedPropertyIds: prev.assignedPropertyIds.includes(propertyId)
        ? prev.assignedPropertyIds.filter((id) => id !== propertyId)
        : [...prev.assignedPropertyIds, propertyId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would create the staff member
    alert('Staff member created! (Mock - no actual data saved)');
    router.push('/admin/staff');
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/staff"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Staff Member</h1>
          <p className="text-gray-600">
            Create a new staff member for shortlet management
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Role</h2>
          <div className="space-y-3">
            {(['manager', 'senior_staff', 'staff'] as StaffRole[]).map(
              (role) => (
                <label
                  key={role}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.role === role
                      ? 'border-green-800 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={() => setFormData({ ...formData, role })}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {ROLE_LABELS[role]}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {role === 'manager' &&
                        'Full access: confirm, cancel, check-in/out, edit availability, view payments, export reports'}
                      {role === 'senior_staff' &&
                        'Most access: confirm, check-in/out, edit availability, view payments (cannot cancel or export)'}
                      {role === 'staff' &&
                        'Limited access: check-in/out guests only (cannot confirm, cancel, or view payments)'}
                    </p>
                  </div>
                </label>
              )
            )}
          </div>
        </div>

        {/* Property Assignment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Assign Properties
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the shortlet-enabled properties this staff member can manage
          </p>
          <div className="space-y-2">
            {shortletProperties.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">
                No shortlet-enabled properties available
              </p>
            ) : (
              shortletProperties.map((property) => {
                const isSelected = formData.assignedPropertyIds.includes(
                  property.id
                );
                return (
                  <label
                    key={property.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-green-800 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePropertyToggle(property.id)}
                      className="w-4 h-4 text-green-800 rounded"
                    />
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{property.name}</p>
                      <p className="text-sm text-gray-500">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-green-600" />}
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/staff"
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Staff Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
