'use client';

import Link from 'next/link';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { useStaffPermissions } from '@/contexts/StaffAuthContext';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function PropertiesPage() {
  const { properties, bookings } = useStaffBookings();
  const permissions = useStaffPermissions();

  // Get booking count for a property
  const getPropertyBookingCount = (propertyId: string) => {
    return bookings.filter((b) => b.propertyId === propertyId).length;
  };

  // Get active booking count
  const getActiveBookings = (propertyId: string) => {
    return bookings.filter(
      (b) =>
        b.propertyId === propertyId &&
        (b.status === 'confirmed' || b.status === 'checked_in')
    ).length;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned Properties</h1>
        <p className="text-gray-600">
          Properties you have access to manage for shortlet bookings
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No properties assigned to you</p>
            <p className="text-sm text-gray-400 mt-1">
              Contact an admin to get property assignments
            </p>
          </div>
        ) : (
          properties.map((property) => {
            // Check if property allows shortlet
            const allowsShortlet =
              property.allowShortlet ||
              property.units?.some((u) => u.allowShortlet);

            // Get shortlet pricing
            const shortletPricing =
              property.shortletPricing ||
              property.units?.find((u) => u.allowShortlet)?.shortletPricing;

            return (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Property Image */}
                <div className="h-40 bg-gray-200 relative">
                  {property.images?.[0] ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${property.images[0]})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {allowsShortlet && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        Shortlet
                      </span>
                    )}
                    {property.units && property.units.length > 0 && (
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                        {property.units.length} Units
                      </span>
                    )}
                  </div>

                  {/* Booking Count */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white text-gray-900 text-xs font-medium rounded shadow">
                      {getPropertyBookingCount(property.id)} bookings
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.city}, {property.state}
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} beds
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} baths
                      </div>
                    )}
                  </div>

                  {/* Shortlet Pricing */}
                  {shortletPricing && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Daily Rate</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(shortletPricing.dailyRate)}
                        <span className="text-sm font-normal text-gray-500">
                          /night
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">
                        {getActiveBookings(property.id)} active
                      </span>
                    </div>

                    <Link
                      href={`/staff/properties/${property.id}`}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                      style={{ color: STAFF_PRIMARY }}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
