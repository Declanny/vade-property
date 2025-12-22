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
  Check,
  Clock,
  X,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Plus,
  Pencil,
} from 'lucide-react';
import {
  mockPropertyOwners,
  mockProperties,
  mockPayments,
  mockComplaints,
  mockTenants,
} from '@/lib/data/adminMock';

type TabType = 'overview' | 'properties' | 'vacant' | 'payments' | 'complaints';

export default function OwnerProfilePage() {
  const params = useParams();
  const ownerId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Find owner and related data
  const owner = mockPropertyOwners.find((o) => o.id === ownerId);
  const ownerProperties = mockProperties.filter((p) => p.ownerId === ownerId);
  const ownerPayments = mockPayments.filter((p) => p.ownerId === ownerId);
  const ownerComplaints = mockComplaints.filter((c) => c.ownerId === ownerId);

  // Calculate stats
  const stats = {
    totalProperties: ownerProperties.length,
    occupied: ownerProperties.filter((p) => p.status === 'occupied').length,
    vacant: ownerProperties.filter((p) => p.status === 'vacant').length,
    underReview: ownerProperties.filter((p) => p.status === 'under_review').length,
    monthlyRevenue: ownerProperties.reduce((sum, p) => sum + p.monthlyRent, 0),
  };

  const vacantProperties = ownerProperties.filter(
    (p) => p.status === 'vacant' || p.status === 'under_review'
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return 'Vacant';
    const tenant = mockTenants.find((t) => t.id === tenantId);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown';
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
    };
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
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

  // Handle owner not found
  if (!owner) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Owner Not Found</h3>
          <p className="text-gray-600 mb-4">The owner you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/owners"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-block"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Back to Owners
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    { id: 'properties' as TabType, label: 'All Properties', icon: Building2 },
    { id: 'vacant' as TabType, label: 'Vacant units', icon: Building2, count: vacantProperties.length },
    { id: 'payments' as TabType, label: 'Payments', icon: CreditCard },
    { id: 'complaints' as TabType, label: 'Complaints', icon: MessageSquare, count: ownerComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/owners"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Owners
      </Link>

      {/* Owner Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              {owner.firstName[0]}
              {owner.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {owner.firstName} {owner.lastName}
                </h1>
                {getStatusBadge(owner.status)}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {owner.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {owner.phone}
                </div>
                {owner.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {owner.address}
                  </div>
                )}
                {owner.onboardedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(owner.onboardedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/owners/${owner.id}/edit`}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Owner
            </Link>
            <Link
              href={`/admin/tenants/add?ownerId=${owner.id}`}
              className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
              style={{ backgroundColor: '#B87333' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-green-600">{stats.occupied}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vacant</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.vacant + stats.underReview}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#0B3D2C' }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-xl font-bold" style={{ color: '#0B3D2C' }}>{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
          </div>
        </div>
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
              {/* Recent Properties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
                <div className="grid gap-4">
                  {ownerProperties.slice(0, 3).map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {property.bedrooms} bed, {property.bathrooms} bath, {property.area} sqft
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(property.status)}
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            {formatCurrency(property.monthlyRent)}/mo
                          </p>
                        </div>
                      </div>
                      {property.currentTenantId && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Tenant: {getTenantName(property.currentTenantId)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {ownerProperties.length > 3 && (
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="mt-4 text-sm font-medium hover:underline"
                    style={{ color: '#0B3D2C' }}
                  >
                    View all {ownerProperties.length} properties
                  </button>
                )}
              </div>

              {/* Recent Payments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                {ownerPayments.length > 0 ? (
                  <div className="space-y-3">
                    {ownerPayments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-600">
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString('en-NG')
                              : `Due: ${new Date(payment.dueDate).toLocaleDateString('en-NG')}`}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(payment.status)}
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No payments yet</p>
                )}
              </div>

              {/* Active Complaints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Complaints</h3>
                {ownerComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length > 0 ? (
                  <div className="space-y-3">
                    {ownerComplaints
                      .filter((c) => c.status !== 'resolved' && c.status !== 'closed')
                      .slice(0, 3)
                      .map((complaint) => (
                        <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                            </div>
                            <div className="flex gap-2">
                              {getPriorityBadge(complaint.priority)}
                              {getStatusBadge(complaint.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No active complaints</p>
                )}
              </div>
            </div>
          )}

          {/* All Properties Tab */}
          {activeTab === 'properties' && (
            <div>
              {ownerProperties.length > 0 ? (
                <div className="grid gap-4">
                  {ownerProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.address}, {property.city}, {property.state}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {property.type.charAt(0).toUpperCase() + property.type.slice(1)} | {property.bedrooms} bed, {property.bathrooms} bath, {property.area} sqft
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {property.amenities.slice(0, 4).map((amenity, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                            {property.amenities.length > 4 && (
                              <span className="text-xs text-gray-500">+{property.amenities.length - 4} more</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(property.status)}
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            {formatCurrency(property.monthlyRent)}/mo
                          </p>
                        </div>
                      </div>
                      {property.currentTenantId && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Tenant: {getTenantName(property.currentTenantId)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No properties yet</p>
              )}
            </div>
          )}

          {/* Vacant Properties Tab */}
          {activeTab === 'vacant' && (
            <div>
              {vacantProperties.length > 0 ? (
                <div className="grid gap-4">
                  {vacantProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.address}, {property.city}, {property.state}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {property.type.charAt(0).toUpperCase() + property.type.slice(1)} | {property.bedrooms} bed, {property.bathrooms} bath, {property.area} sqft
                          </p>
                          {property.availableFrom && (
                            <p className="text-sm text-green-600 mt-2">
                              Available from: {new Date(property.availableFrom).toLocaleDateString('en-NG')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(property.status)}
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            {formatCurrency(property.monthlyRent)}/mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No vacant properties</p>
                  <p className="text-sm text-gray-400 mt-1">All properties are currently occupied</p>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {ownerPayments.length > 0 ? (
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
                      {ownerPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-900">{payment.description}</p>
                            <p className="text-sm text-gray-500">{payment.paymentMethod}</p>
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
                  <p className="text-gray-500">No payments yet</p>
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              {ownerComplaints.length > 0 ? (
                <div className="space-y-4">
                  {ownerComplaints.map((complaint) => (
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
                        <span>Category: {complaint.category}</span>
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
                  <p className="text-gray-500">No complaints</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
