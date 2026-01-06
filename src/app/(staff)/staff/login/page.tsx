'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { useStaffAuth, getAvailableStaffForSwitcher } from '@/contexts/StaffAuthContext';
import { ROLE_LABELS } from '@/lib/types/staff';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function StaffLoginPage() {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useStaffAuth();

  const availableStaff = getAvailableStaffForSwitcher();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/staff');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedStaffId) {
      setError('Please select a staff member');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(selectedStaffId);

    if (success) {
      router.push('/staff');
    } else {
      setError('Failed to login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span style={{ color: '#0B3D2C' }}>Tru</span>
            <span style={{ color: '#B87333' }}>Vade</span>
          </h1>
          <div className="mt-2 inline-flex items-center gap-2">
            <span
              className="text-xs px-2 py-1 rounded text-white"
              style={{ backgroundColor: STAFF_PRIMARY }}
            >
              Staff Portal
            </span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Staff Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage shortlet bookings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          {/* Mock Auth Notice */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700">
              <strong>Development Mode:</strong> Select a staff member below to
              simulate login. No password required.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Staff Selection */}
            <div>
              <label
                htmlFor="staff"
                className="block text-sm font-medium text-gray-700"
              >
                Select Staff Account
              </label>
              <select
                id="staff"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm rounded-lg"
                style={
                  {
                    '--tw-ring-color': STAFF_PRIMARY,
                  } as React.CSSProperties
                }
              >
                <option value="">-- Select a staff member --</option>
                {availableStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName} ({ROLE_LABELS[staff.role]})
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Details Preview */}
            {selectedStaffId && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                {(() => {
                  const staff = availableStaff.find((s) => s.id === selectedStaffId);
                  if (!staff) return null;

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: STAFF_PRIMARY }}
                        >
                          {staff.firstName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Role</p>
                          <p className="font-medium">{ROLE_LABELS[staff.role]}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Properties</p>
                          <p className="font-medium">
                            {staff.assignedPropertyIds.length} assigned
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !selectedStaffId}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: STAFF_PRIMARY }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Admin Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Are you an admin?{' '}
              <a
                href="/admin"
                className="font-medium hover:underline"
                style={{ color: STAFF_PRIMARY }}
              >
                Go to Admin Portal
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
