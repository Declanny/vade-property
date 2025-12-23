'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bed,
  Bath,
  Maximize,
  Edit,
  CreditCard,
  MessageSquare,
  Wrench,
  AlertCircle,
  Check,
  Clock,
  Plus,
} from 'lucide-react';
import {
  mockProperties,
  mockPropertyOwners,
  mockPayments,
  mockComplaints,
  mockTenants,
  mockLeaseAgreements,
  isMultiUnitProperty,
  getPropertyOccupancy,
  getPropertyTotalRent,
} from '@/lib/data/adminMock';
import type { Unit } from '@/lib/types/admin';

type TabType = 'overview' | 'units' | 'tenant' | 'payments' | 'complaints' | 'maintenance';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Find property and related data
  const property = mockProperties.find((p) => p.id === propertyId);
  const owner = property ? mockPropertyOwners.find((o) => o.id === property.ownerId) : null;
  const isMultiUnit = property ? isMultiUnitProperty(property) : false;
  const occupancy = property ? getPropertyOccupancy(property) : { total: 0, occupied: 0, vacant: 0 };
  const totalRent = property ? getPropertyTotalRent(property) : 0;

  // For single-unit properties, get tenant from property.currentTenantId
  // For multi-unit properties, tenant is handled per unit in the Units tab
  const tenant = !isMultiUnit && property?.currentTenantId
    ? mockTenants.find((t) => t.id === property.currentTenantId)
    : null;
  const propertyPayments = mockPayments.filter((p) => p.propertyId === propertyId);
  const propertyComplaints = mockComplaints.filter((c) => c.propertyId === propertyId);
  const lease = tenant
    ? mockLeaseAgreements.find((l) => l.tenantId === tenant.id && l.propertyId === propertyId)
    : null;

  // Helper to get tenant for a unit
  const getTenantForUnit = (unit: Unit) => {
    return unit.currentTenantId ? mockTenants.find(t => t.id === unit.currentTenantId) : null;
  };

  // Helper to get unit status badge
  const getUnitStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      occupied: { bg: 'bg-green-100', text: 'text-green-700', label: 'Occupied' },
      vacant: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Vacant' },
      maintenance: { bg: 'bg-red-100', text: 'text-red-700', label: 'Maintenance' },
      reserved: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reserved' },
    };
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' },
      occupied: { bg: 'bg-green-100', text: 'text-green-700', label: 'Occupied' },
      vacant: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Vacant' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      maintenance: { bg: 'bg-red-100', text: 'text-red-700', label: 'Maintenance' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
      resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },
      current: { bg: 'bg-green-100', text: 'text-green-700', label: 'Current' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
    };
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
        {type.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      low: { bg: 'bg-gray-100', text: 'text-gray-700' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
      high: { bg: 'bg-orange-100', text: 'text-orange-700' },
      urgent: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const badge = badges[priority] || badges.low;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Handle property not found
  if (!property) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/properties"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-block"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Build tabs based on property type
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    // Only show Units tab for multi-unit properties
    ...(isMultiUnit ? [{ id: 'units' as TabType, label: 'Units', icon: Building2, count: property?.units?.length || 0 }] : []),
    // Only show Tenant tab for single-unit properties
    ...(!isMultiUnit ? [{ id: 'tenant' as TabType, label: 'Tenant', icon: Users }] : []),
    { id: 'payments' as TabType, label: 'Payments', icon: CreditCard, count: propertyPayments.length },
    { id: 'complaints' as TabType, label: 'Complaints', icon: MessageSquare, count: propertyComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/properties"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Link>

      {/* Property Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Property Image Banner */}
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            {getStatusBadge(property.status)}
            {getTypeBadge(property.type)}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-start text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
              <p className="text-gray-600 text-sm">{property.description}</p>
            </div>
            <Link
              href={`/admin/properties/${property.id}/edit`}
              className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
              style={{ backgroundColor: '#B87333' }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Property
            </Link>
          </div>

          {/* Owner Info */}
          {owner && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Owner:{' '}
                <Link
                  href={`/admin/owners/${owner.id}`}
                  className="font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                >
                  {owner.firstName} {owner.lastName}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#0B3D2C' }} />
            </div>
            <div>
              <p className="text-xs text-gray-600">{isMultiUnit ? 'Total Rent' : 'Monthly Rent'}</p>
              <p className="text-lg font-bold" style={{ color: '#0B3D2C' }}>{formatCurrency(totalRent)}</p>
            </div>
          </div>
        </div>
        {isMultiUnit ? (
          // Multi-unit: show occupancy stats
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Units</p>
                  <p className="text-lg font-bold text-blue-600">{occupancy.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Occupied</p>
                  <p className="text-lg font-bold text-green-600">{occupancy.occupied}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Home className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Vacant</p>
                  <p className="text-lg font-bold text-yellow-600">{occupancy.vacant}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Single-unit: show deposit, area, bedrooms
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Security Deposit</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(property.securityDeposit || 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Maximize className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Area</p>
                  <p className="text-lg font-bold text-gray-900">{property.area || 0} sqft</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Bed className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Bedrooms / Baths</p>
                  <p className="text-lg font-bold text-gray-900">{property.bedrooms || 0} / {property.bathrooms || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 p-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive ? { backgroundColor: '#0B3D2C' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Property Type</p>
                    <p className="font-medium text-gray-900 capitalize">{property.type}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div>{getStatusBadge(property.status)}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Listed Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {property.availableFrom && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Available From</p>
                      <p className="font-medium text-gray-900">
                        {new Date(property.availableFrom).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        <Check className="w-4 h-4 mr-1.5 text-green-600" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{propertyPayments.length}</p>
                    <p className="text-sm text-gray-600">Total Payments</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {propertyPayments.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{propertyComplaints.length}</p>
                    <p className="text-sm text-gray-600">Total Complaints</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {propertyComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}
                    </p>
                    <p className="text-sm text-gray-600">Active Issues</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Units Tab - Only for multi-unit properties */}
          {activeTab === 'units' && isMultiUnit && property.units && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Units ({property.units.length})
                </h3>
                <button
                  className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.units.map((unit) => {
                  const unitTenant = getTenantForUnit(unit);
                  return (
                    <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                        {getUnitStatusBadge(unit.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {unit.bedrooms} bed
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {unit.bathrooms} bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            {unit.area} sqft
                          </span>
                        </div>
                        {unit.floor && (
                          <p className="text-gray-500">Floor {unit.floor}</p>
                        )}
                      </div>
                      <p className="font-bold text-lg" style={{ color: '#0B3D2C' }}>
                        {formatCurrency(unit.monthlyRent)}/mo
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {unitTenant ? (
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/admin/tenants/${unitTenant.id}`}
                              className="text-sm font-medium hover:underline flex items-center gap-2"
                              style={{ color: '#0B3D2C' }}
                            >
                              <Users className="w-4 h-4" />
                              {unitTenant.firstName} {unitTenant.lastName}
                            </Link>
                            {getStatusBadge(unitTenant.rentStatus)}
                          </div>
                        ) : (
                          <Link
                            href={`/admin/tenants/add?propertyId=${property.id}&unitId=${unit.id}`}
                            className="text-sm font-medium hover:underline flex items-center gap-2"
                            style={{ color: '#0B3D2C' }}
                          >
                            <Plus className="w-4 h-4" />
                            Assign Tenant
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tenant Tab - Only for single-unit properties */}
          {activeTab === 'tenant' && !isMultiUnit && (
            <div>
              {tenant ? (
                <div className="space-y-6">
                  {/* Tenant Info Card */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: '#0B3D2C' }}
                      >
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/admin/tenants/${tenant.id}`}
                            className="text-xl font-bold text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                          >
                            {tenant.firstName} {tenant.lastName}
                          </Link>
                          {getStatusBadge(tenant.rentStatus)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {tenant.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {tenant.phone}
                          </div>
                          {tenant.moveInDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Move-in: {new Date(tenant.moveInDate).toLocaleDateString('en-NG')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lease Info */}
                  {lease && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Agreement</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Start Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(lease.startDate).toLocaleDateString('en-NG')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">End Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(lease.endDate).toLocaleDateString('en-NG')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Rent</p>
                            <p className="font-medium text-gray-900">{formatCurrency(lease.monthlyRent)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            {getStatusBadge(lease.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rent Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-xl font-bold" style={{ color: '#0B3D2C' }}>
                          {formatCurrency(tenant.monthlyRent || 0)}
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
                        <p className={`text-xl font-bold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(tenant.outstandingBalance)}
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Last Payment</p>
                        <p className="text-xl font-bold text-gray-900">
                          {tenant.lastPaymentDate
                            ? new Date(tenant.lastPaymentDate).toLocaleDateString('en-NG')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tenant Assigned</h3>
                  <p className="text-gray-600 mb-4">This property is currently vacant.</p>
                  <Link
                    href={`/admin/tenants/add?propertyId=${property.id}`}
                    className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-flex items-center"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Assign Tenant
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {propertyPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {propertyPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-900">{payment.description}</p>
                            <p className="text-sm text-gray-500 capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                          </td>
                          <td className="px-4 py-4 font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(payment.dueDate).toLocaleDateString('en-NG')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString('en-NG')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payments recorded for this property</p>
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              {propertyComplaints.length > 0 ? (
                <div className="space-y-4">
                  {propertyComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                        <div className="flex gap-2">
                          {getPriorityBadge(complaint.priority)}
                          {getStatusBadge(complaint.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">Category: {complaint.category}</span>
                        <span>Filed: {new Date(complaint.createdAt).toLocaleDateString('en-NG')}</span>
                        {complaint.resolvedAt && (
                          <span>Resolved: {new Date(complaint.resolvedAt).toLocaleDateString('en-NG')}</span>
                        )}
                      </div>
                      {complaint.resolutionNotes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <strong>Resolution:</strong> {complaint.resolutionNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints for this property</p>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Schedule</h3>
              <p className="text-gray-600 mb-4">
                No maintenance records yet. Schedule maintenance tasks to keep track of property upkeep.
              </p>
              <button
                className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-flex items-center"
                style={{ backgroundColor: '#0B3D2C' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Schedule Maintenance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
