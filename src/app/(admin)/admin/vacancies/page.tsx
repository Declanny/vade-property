'use client';

import { useState } from 'react';
import { mockProperties, mockPropertyOwners } from '@/lib/data/adminMock';
import { Home, MapPin, DollarSign, Bed, Bath, Maximize, Eye, EyeOff, Plus } from 'lucide-react';

export default function VacanciesPage() {
  const vacantProperties = mockProperties.filter(p => p.status === 'vacant' || p.status === 'under_review');
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());

  const togglePublish = (propertyId: string) => {
    const newSet = new Set(publishedIds);
    if (newSet.has(propertyId)) {
      newSet.delete(propertyId);
    } else {
      newSet.add(propertyId);
    }
    setPublishedIds(newSet);
  };

  const getOwnerName = (ownerId: string) => {
    const owner = mockPropertyOwners.find(o => o.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Vacancy Management</h1>
        <p className="text-gray-600 mt-1">Publish and manage vacant properties</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Vacant</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{vacantProperties.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Published</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{publishedIds.size}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Unpublished</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{vacantProperties.length - publishedIds.size}</p>
        </div>
      </div>

      {/* Vacant Properties Grid */}
      {vacantProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Properties Occupied!</h3>
          <p className="text-gray-600">There are no vacant properties at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacantProperties.map((property) => {
            const isPublished = publishedIds.has(property.id);

            return (
              <div
                key={property.id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                  isPublished ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                {/* Property Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute top-3 right-3">
                    {isPublished ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Published
                      </span>
                    ) : (
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Draft
                      </span>
                    )}
                  </div>
                  {property.status === 'under_review' && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Under Review
                      </span>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <p>{property.address}, {property.city}, {property.state}</p>
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Maximize className="w-4 h-4 mr-1" />
                      {property.area} sqft
                    </div>
                  </div>

                  {/* Rent */}
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(property.monthlyRent)}</p>
                  </div>

                  {/* Owner */}
                  <div className="text-sm">
                    <p className="text-gray-600">Owner</p>
                    <p className="font-medium text-gray-900">{getOwnerName(property.ownerId)}</p>
                  </div>

                  {/* Amenities */}
                  {property.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => togglePublish(property.id)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: isPublished ? '#EF4444' : '#0B3D2C' }}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-colors" style={{ backgroundColor: '#B87333' }}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Publishing Vacancies</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Published properties appear on the public website with full details</li>
          <li>✓ Prospective tenants can apply and start the KYC process</li>
          <li>✓ You'll receive notifications when applications are submitted</li>
          <li>✓ Properties under review won't be visible to the public until approved</li>
        </ul>
      </div>
    </div>
  );
}
