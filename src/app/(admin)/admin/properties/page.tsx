'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { mockProperties, mockPropertyOwners, mockTenants } from '@/lib/data/adminMock';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property as PublicProperty } from '@/lib/types';
import type { Property as AdminProperty } from '@/lib/types/admin';

export default function PropertiesPage() {
  const properties = mockProperties;
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return 'Vacant';
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Vacant';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Convert admin property to public property format for PropertyCard
  const convertToPublicProperty = (adminProp: AdminProperty): PublicProperty => {
    // Use existing images from public folder since admin mock images don't exist
    const propertyImages = [
      '/propertymain.avif',
      '/section2prop.png',
      '/section3prop.png',
      '/section4prop.png',
    ];
    
    // Randomly select an image based on property ID for consistency
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
      latitude: 6.5244, // Default Lagos coordinates
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
      verified: adminProp.status === 'occupied' || adminProp.status === 'vacant',
      status: adminProp.status === 'occupied' ? 'rented' : 'active',
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
      occupied: { bg: 'bg-green-100', text: 'text-green-700' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-700' },
      maintenance: { bg: 'bg-orange-100', text: 'text-orange-700' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage all properties in the system</p>
        </div>
        <Link
          href="/admin/properties/add"
          className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center"
          style={{ backgroundColor: '#0B3D2C' }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Properties</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Occupied</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {properties.filter(p => p.status === 'occupied').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Vacant</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {properties.filter(p => p.status === 'vacant').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Value</p>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {formatCurrency(properties.reduce((sum, p) => sum + p.monthlyRent, 0))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {properties.map((property) => (
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
                <span className="text-gray-600">Tenant</span>
                {property.currentTenantId ? (
                  <Link
                    href={`/admin/tenants/${property.currentTenantId}`}
                    className="font-medium text-green-700 underline decoration-1 underline-offset-2 hover:text-[#B87333] hover:decoration-[#B87333] transition-colors"
                  >
                    {getTenantName(property.currentTenantId)}
                  </Link>
                ) : (
                  <span className="font-medium text-yellow-700">Vacant</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
