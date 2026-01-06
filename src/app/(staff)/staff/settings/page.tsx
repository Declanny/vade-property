'use client';

import { User, Mail, Phone, Shield, Building2 } from 'lucide-react';
import { useStaffAuth, useStaffPermissions } from '@/contexts/StaffAuthContext';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/lib/types/staff';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function SettingsPage() {
  const { user } = useStaffAuth();
  const permissions = useStaffPermissions();
  const { properties } = useStaffBookings();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Your account information and permissions</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: STAFF_PRIMARY }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <span
                    className="inline-flex px-2 py-1 text-sm font-medium rounded text-white"
                    style={{ backgroundColor: STAFF_PRIMARY }}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Permissions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your role: {ROLE_LABELS[user.role]}
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(permissions || {}).map(([key, value]) => {
              const labels: Record<string, string> = {
                canConfirmBookings: 'Confirm Bookings',
                canCancelBookings: 'Cancel Bookings',
                canCheckInOut: 'Check-in / Check-out Guests',
                canEditAvailability: 'Edit Property Availability',
                canViewPayments: 'View Payment Information',
                canExportReports: 'Export Reports',
              };

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{labels[key] || key}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      value
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {value ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assigned Properties Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Assigned Properties
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length} properties assigned to you
          </p>
        </div>
        <div className="p-6">
          {properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No properties assigned</p>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${STAFF_PRIMARY}20` }}
                    >
                      <Building2
                        className="w-5 h-5"
                        style={{ color: STAFF_PRIMARY }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{property.name}</p>
                      <p className="text-sm text-gray-500">
                        {property.city}, {property.state}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      property.allowShortlet ||
                      property.units?.some((u) => u.allowShortlet)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {property.allowShortlet ||
                    property.units?.some((u) => u.allowShortlet)
                      ? 'Shortlet Enabled'
                      : 'Long-term Only'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Account Info</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Staff ID</p>
              <p className="font-mono text-gray-900">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className="inline-flex px-2 py-1 text-sm font-medium rounded bg-green-100 text-green-700">
                {user.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="text-gray-900">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
