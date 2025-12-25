'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  LogIn,
  LogOut,
  User,
  Home,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  MoreVertical,
} from 'lucide-react';
import {
  mockShortletBookings,
  mockProperties,
  mockPropertyOwners,
} from '@/lib/data/adminMock';
import { ShortletBooking, ShortletBookingStatus, PaymentStatus } from '@/lib/types/admin';

export default function AdminShortletsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<ShortletBooking | null>(null);
  const [bookings, setBookings] = useState<ShortletBooking[]>(mockShortletBookings);

  // Booking action handlers
  const updateBookingStatus = (bookingId: string, newStatus: ShortletBookingStatus) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    // Update selected booking if it's the one being changed
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'confirmed');
    }
  };

  const handleDeclineBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'cancelled');
    }
  };

  const handleCheckIn = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'checked_in');
    }
  };

  const handleCheckOut = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'checked_out');
    }
  };

  // Get property/unit name
  const getLocationName = (booking: ShortletBooking) => {
    const property = mockProperties.find((p) => p.id === booking.propertyId);
    if (!property) return 'Unknown';

    if (property.units && property.units.length > 0) {
      const unit = property.units.find((u) => u.id === booking.unitId);
      return unit ? `${property.name} - ${unit.name}` : property.name;
    }
    return property.name;
  };

  // Get owner name
  const getOwnerName = (ownerId: string) => {
    const owner = mockPropertyOwners.find((o) => o.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocationName(booking).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    checkedIn: bookings.filter((b) => b.status === 'checked_in').length,
    checkedOut: bookings.filter((b) => b.status === 'checked_out').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: ShortletBookingStatus) => {
    const badges: Record<ShortletBookingStatus, { bg: string; text: string; icon: React.ElementType }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      checked_in: { bg: 'bg-green-100', text: 'text-green-700', icon: LogIn },
      checked_out: { bg: 'bg-gray-100', text: 'text-gray-700', icon: LogOut },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const badges: Record<PaymentStatus, { bg: string; text: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
      completed: { bg: 'bg-green-100', text: 'text-green-700' },
      failed: { bg: 'bg-red-100', text: 'text-red-700' },
      refunded: { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    const badge = badges[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shortlet Bookings</h1>
        <p className="text-gray-600 mt-1">Manage all shortlet reservations and check-ins</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-yellow-600 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-blue-600 uppercase">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-green-600 uppercase">Checked In</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.checkedIn}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Checked Out</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.checkedOut}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-red-600 uppercase">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Revenue</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest name, email, or property..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No shortlet bookings have been made yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in / Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nights
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getLocationName(booking)}</p>
                          <Link
                            href={`/admin/owners/${booking.ownerId}`}
                            className="text-xs text-gray-500 hover:text-[#0B3D2C]"
                          >
                            {getOwnerName(booking.ownerId)}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(booking.checkIn)}</p>
                        <p className="text-gray-500">{formatDate(booking.checkOut)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{booking.nights}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(booking.nightlyRate)}/night</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(booking.paymentStatus)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedBooking.status)}
                  {getPaymentBadge(selectedBooking.paymentStatus)}
                </div>
                <p className="text-sm text-gray-500">
                  Booking ID: {selectedBooking.id}
                </p>
              </div>

              {/* Guest Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedBooking.guestPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedBooking.guestEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Property
                </h4>
                <p className="font-medium text-gray-900">{getLocationName(selectedBooking)}</p>
                <Link
                  href={`/admin/owners/${selectedBooking.ownerId}`}
                  className="text-sm text-gray-500 hover:text-[#0B3D2C]"
                >
                  Owner: {getOwnerName(selectedBooking.ownerId)}
                </Link>
              </div>

              {/* Booking Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Stay Details
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Check-out</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nights</p>
                    <p className="font-medium text-gray-900">{selectedBooking.nights} nights</p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {formatCurrency(selectedBooking.nightlyRate)} x {selectedBooking.nights} nights
                    </span>
                    <span className="font-medium">{formatCurrency(selectedBooking.subtotal)}</span>
                  </div>
                  {selectedBooking.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning Fee</span>
                      <span className="font-medium">{formatCurrency(selectedBooking.cleaningFee)}</span>
                    </div>
                  )}
                  {selectedBooking.cautionDeposit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Caution Deposit (refundable)</span>
                      <span className="font-medium">{formatCurrency(selectedBooking.cautionDeposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg" style={{ color: '#0B3D2C' }}>
                      {formatCurrency(selectedBooking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Special Requests</h4>
                  <p className="text-sm text-amber-800">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={handleConfirmBooking}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={handleDeclineBooking}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    Check-in Guest
                  </button>
                )}
                {selectedBooking.status === 'checked_in' && (
                  <button
                    onClick={handleCheckOut}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors bg-gray-700"
                  >
                    Check-out Guest
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
