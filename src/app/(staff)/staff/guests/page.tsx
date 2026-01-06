'use client';

import { useState } from 'react';
import { Search, Users, Mail, Phone, CalendarDays } from 'lucide-react';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function GuestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { guests } = useStaffBookings();

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
        <p className="text-gray-600">All guests who have booked your properties</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': STAFF_PRIMARY } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Guests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''}
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No guests found</p>
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: STAFF_PRIMARY }}
                    >
                      {guest.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{guest.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        {guest.email}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Phone className="w-4 h-4" />
                        {guest.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      {guest.totalBookings} booking
                      {guest.totalBookings !== 1 ? 's' : ''}
                    </div>
                    {guest.lastBooking && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last:{' '}
                        {new Date(guest.lastBooking.createdAt).toLocaleDateString(
                          'en-NG',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
