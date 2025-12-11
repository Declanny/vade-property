'use client';

import { mockProperties, mockPropertyOwners, mockTenants } from '@/lib/data/adminMock';
import { Home, MapPin, DollarSign, User } from 'lucide-react';

export default function PropertiesPage() {
  const properties = mockProperties;

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-600 mt-1">Manage all properties in the system</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute top-3 right-3">
                {getStatusBadge(property.status)}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <p>{property.address}, {property.city}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>{property.bedrooms} bed</div>
                <div>{property.bathrooms} bath</div>
                <div>{property.area} sqft</div>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-bold text-blue-600">{formatCurrency(property.monthlyRent)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Owner</span>
                  <span className="font-medium text-gray-900">{getOwnerName(property.ownerId)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tenant</span>
                  <span className={`font-medium ${property.currentTenantId ? 'text-green-700' : 'text-yellow-700'}`}>
                    {getTenantName(property.currentTenantId)}
                  </span>
                </div>
              </div>

              <button className="w-full text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: '#0B3D2C' }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
