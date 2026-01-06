'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { useStaffPermissions } from '@/contexts/StaffAuthContext';
import type { ShortletBooking } from '@/lib/types/admin';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

type BookingStatus = ShortletBooking['status'] | 'all';

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'checked_in':
      return 'bg-green-100 text-green-700';
    case 'checked_out':
      return 'bg-gray-100 text-gray-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get('status') as BookingStatus) || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus>(initialStatus);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<ShortletBooking | null>(
    null
  );

  const { bookings, properties } = useStaffBookings();
  const permissions = useStaffPermissions();

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Property filter
      if (propertyFilter !== 'all' && booking.propertyId !== propertyFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.guestName.toLowerCase().includes(query) ||
          booking.guestEmail.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [bookings, statusFilter, propertyFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      checkedIn: bookings.filter((b) => b.status === 'checked_in').length,
    };
  }, [bookings]);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">
            Manage shortlet bookings for your assigned properties
          </p>
        </div>
        <Link
          href="/staff/calendar"
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: STAFF_PRIMARY }}
        >
          <Calendar className="w-4 h-4" />
          Calendar View
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
          <p className="text-sm text-gray-600">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
          <p className="text-sm text-gray-600">Checked In</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, email, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': STAFF_PRIMARY } as React.CSSProperties}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': STAFF_PRIMARY } as React.CSSProperties}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': STAFF_PRIMARY } as React.CSSProperties}
          >
            <option value="all">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Table/List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No bookings found</p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const property = properties.find(
                  (p) => p.id === booking.propertyId
                );
                const isSelected = selectedBooking?.id === booking.id;

                return (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {booking.guestName}
                          </p>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {property?.name || 'Unknown Property'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{formatDate(booking.checkIn)}</span>
                          <span>→</span>
                          <span>{formatDate(booking.checkOut)}</span>
                          <span className="text-gray-400">|</span>
                          <span>{booking.nights} nights</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Booking Detail Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
          {selectedBooking ? (
            <div>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Booking Details</h2>
                  <Link
                    href={`/staff/bookings/${selectedBooking.id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: STAFF_PRIMARY }}
                  >
                    Full Details
                  </Link>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Guest Info */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Guest</p>
                  <p className="font-medium text-gray-900">
                    {selectedBooking.guestName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {selectedBooking.guestEmail}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {selectedBooking.guestPhone}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in</p>
                    <p className="text-gray-900">
                      {formatDate(selectedBooking.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-out</p>
                    <p className="text-gray-900">
                      {formatDate(selectedBooking.checkOut)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Booking Status
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment</p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusBadge(
                        selectedBooking.paymentStatus
                      )}`}
                    >
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                {permissions?.canViewPayments && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </p>
                  </div>
                )}

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Special Requests
                    </p>
                    <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded-lg">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {selectedBooking.status === 'pending' &&
                    permissions?.canConfirmBookings && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Booking
                      </button>
                    )}

                  {selectedBooking.status === 'confirmed' &&
                    permissions?.canCheckInOut && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                        style={{ backgroundColor: STAFF_PRIMARY }}
                      >
                        <LogIn className="w-4 h-4" />
                        Check-in Guest
                      </button>
                    )}

                  {selectedBooking.status === 'checked_in' &&
                    permissions?.canCheckInOut && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Check-out Guest
                      </button>
                    )}

                  {selectedBooking.status === 'pending' &&
                    permissions?.canCancelBookings && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline Booking
                      </button>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select a booking to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
