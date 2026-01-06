'use client';

import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useStaffAuth, useStaffPermissions } from '@/contexts/StaffAuthContext';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { ROLE_LABELS } from '@/lib/types/staff';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function StaffDashboardPage() {
  const { user } = useStaffAuth();
  const permissions = useStaffPermissions();
  const {
    stats,
    todayCheckIns,
    todayCheckOuts,
    upcomingBookings,
    properties,
  } = useStaffBookings();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              {ROLE_LABELS[user?.role || 'staff']} &bull;{' '}
              {stats.assignedProperties} properties assigned
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-NG', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Properties */}
        <Link
          href="/staff/properties"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${STAFF_PRIMARY}20` }}
            >
              <Building2 className="w-6 h-6" style={{ color: STAFF_PRIMARY }} />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {stats.assignedProperties}
          </p>
          <p className="text-sm text-gray-600">Assigned Properties</p>
        </Link>

        {/* Total Bookings */}
        <Link
          href="/staff/bookings"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-100">
              <CalendarDays className="w-6 h-6 text-green-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {stats.totalBookings}
          </p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </Link>

        {/* Pending Bookings */}
        <Link
          href="/staff/bookings?status=pending"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-100">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {stats.pendingBookings}
          </p>
          <p className="text-sm text-gray-600">Pending Approval</p>
        </Link>

        {/* Current Guests */}
        <Link
          href="/staff/guests"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {stats.currentGuests}
          </p>
          <p className="text-sm text-gray-600">Current Guests</p>
        </Link>
      </div>

      {/* Today's Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Today&apos;s Check-ins
              </h2>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {stats.todayCheckIns} guests
            </span>
          </div>
          <div className="p-4">
            {todayCheckIns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No check-ins scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayCheckIns.map((booking) => {
                  const property = properties.find(
                    (p) => p.id === booking.propertyId
                  );
                  return (
                    <Link
                      key={booking.id}
                      href={`/staff/bookings/${booking.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.guestName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property?.name || 'Unknown Property'}
                        </p>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Check-in
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Today&apos;s Check-outs
              </h2>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {stats.todayCheckOuts} guests
            </span>
          </div>
          <div className="p-4">
            {todayCheckOuts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No check-outs scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayCheckOuts.map((booking) => {
                  const property = properties.find(
                    (p) => p.id === booking.propertyId
                  );
                  return (
                    <Link
                      key={booking.id}
                      href={`/staff/bookings/${booking.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.guestName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property?.name || 'Unknown Property'}
                        </p>
                      </div>
                      <span className="text-sm text-orange-600 font-medium">
                        Check-out
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: STAFF_PRIMARY }} />
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Bookings (Next 7 Days)
            </h2>
          </div>
          <Link
            href="/staff/calendar"
            className="text-sm font-medium hover:underline"
            style={{ color: STAFF_PRIMARY }}
          >
            View Calendar
          </Link>
        </div>
        <div className="p-4">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No upcoming bookings in the next 7 days</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Property</th>
                    <th className="pb-3 font-medium">Check-in</th>
                    <th className="pb-3 font-medium">Nights</th>
                    <th className="pb-3 font-medium">Status</th>
                    {permissions?.canViewPayments && (
                      <th className="pb-3 font-medium text-right">Amount</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.slice(0, 5).map((booking) => {
                    const property = properties.find(
                      (p) => p.id === booking.propertyId
                    );
                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3">
                          <Link
                            href={`/staff/bookings/${booking.id}`}
                            className="font-medium text-gray-900 hover:underline"
                          >
                            {booking.guestName}
                          </Link>
                        </td>
                        <td className="py-3 text-gray-600">
                          {property?.name || 'Unknown'}
                        </td>
                        <td className="py-3 text-gray-600">
                          {formatDate(booking.checkIn)}
                        </td>
                        <td className="py-3 text-gray-600">
                          {booking.nights} nights
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'pending'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        {permissions?.canViewPayments && (
                          <td className="py-3 text-right font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/staff/bookings?status=pending"
          className="p-4 bg-orange-50 rounded-xl border border-orange-200 hover:border-orange-300 transition-colors"
        >
          <Clock className="w-6 h-6 text-orange-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Review Pending</h3>
          <p className="text-sm text-gray-600">
            {stats.pendingBookings} bookings need approval
          </p>
        </Link>

        <Link
          href="/staff/calendar"
          className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors"
        >
          <Calendar className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900">View Calendar</h3>
          <p className="text-sm text-gray-600">
            Check availability and schedules
          </p>
        </Link>

        <Link
          href="/staff/guests"
          className="p-4 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors"
        >
          <Users className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Guest Directory</h3>
          <p className="text-sm text-gray-600">
            View all guests and their history
          </p>
        </Link>
      </div>
    </div>
  );
}
