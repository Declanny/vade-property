'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { mockProperties, mockPropertyOwners } from '@/lib/data/adminMock';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property as PublicProperty } from '@/lib/types';
import type { Property as AdminProperty } from '@/lib/types/admin';
import { Home, Eye, EyeOff } from 'lucide-react';

export default function VacanciesPage() {
  const vacantProperties = mockProperties.filter(p => p.status === 'vacant' || p.status === 'under_review');
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const togglePublish = (propertyId: string) => {
    const newSet = new Set(publishedIds);
    if (newSet.has(propertyId)) {
      newSet.delete(propertyId);
    } else {
      newSet.add(propertyId);
    }
    setPublishedIds(newSet);
  };

  const handleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  }, []);

  const getOwnerName = (ownerId: string) => {
    const owner = mockPropertyOwners.find(o => o.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
  };

  // Convert admin property to public property format for PropertyCard
  const convertToPublicProperty = (adminProp: AdminProperty): PublicProperty => {
    const propertyImages = [
      '/propertymain.avif',
      '/section2prop.png',
      '/section3prop.png',
      '/section4prop.png',
    ];

    const imageIndex = parseInt(adminProp.id.split('-')[1] || '1', 10) % propertyImages.length;

    return {
      id: adminProp.id,
      ownerId: adminProp.ownerId,
      title: adminProp.name,
      description: adminProp.description,
      type: adminProp.type,
      address: adminProp.address,
      city: adminProp.city,
      state: adminProp.state,
      country: 'Nigeria',
      zipCode: adminProp.zipCode,
      latitude: 6.5244,
      longitude: 3.3792,
      price: adminProp.monthlyRent,
      currency: 'NGN',
      paymentPlans: ['1_month', '3_months', '6_months', '12_months'],
      bedrooms: adminProp.bedrooms,
      bathrooms: adminProp.bathrooms,
      area: adminProp.area,
      areaUnit: 'sqft',
      amenities: adminProp.amenities,
      images: [propertyImages[imageIndex]],
      verified: adminProp.status === 'vacant',
      status: 'active',
      featured: false,
      rating: 4.5,
      reviewCount: 0,
      createdAt: new Date(adminProp.createdAt),
      updatedAt: new Date(adminProp.updatedAt),
    } as PublicProperty;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      vacant: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.vacant;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {status.replace('_', ' ')}
      </span>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {vacantProperties.map((property) => {
            const isPublished = publishedIds.has(property.id);

            return (
              <div key={property.id} className="relative">
                <PropertyCard
                  property={convertToPublicProperty(property)}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(property.id)}
                />
                {/* Admin Info Overlay */}
                <div className="mt-3 bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Status</span>
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Owner</span>
                    <Link
                      href={`/admin/owners/${property.ownerId}`}
                      className="font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                    >
                      {getOwnerName(property.ownerId)}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Published</span>
                    {isPublished ? (
                      <span className="flex items-center text-green-700 font-medium">
                        <Eye className="w-3 h-3 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500 font-medium">
                        <EyeOff className="w-3 h-3 mr-1" />
                        No
                      </span>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => togglePublish(property.id)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: isPublished ? '#EF4444' : '#0B3D2C' }}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors" style={{ backgroundColor: '#B87333' }}>
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
