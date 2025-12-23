'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, User, Home, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { OwnerWithProperties } from '@/lib/types/admin';
import { getPropertyTotalRent } from '@/lib/data/adminMock';

interface Props {
  owners: OwnerWithProperties[];
}

export default function OwnerPropertyHierarchy({ owners }: Props) {
  const [expandedOwners, setExpandedOwners] = useState<Set<string>>(new Set());
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());

  const toggleOwner = (ownerId: string) => {
    const newExpanded = new Set(expandedOwners);
    if (newExpanded.has(ownerId)) {
      newExpanded.delete(ownerId);
    } else {
      newExpanded.add(ownerId);
    }
    setExpandedOwners(newExpanded);
  };

  const toggleProperty = (propertyId: string) => {
    const newExpanded = new Set(expandedProperties);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedProperties(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      vacant: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Vacant' },
      occupied: { bg: 'bg-green-100', text: 'text-green-700', label: 'Occupied' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' },
      maintenance: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Maintenance' },
    };
    const badge = badges[status as keyof typeof badges] || badges.vacant;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getRentStatusBadge = (status: string) => {
    const badges = {
      current: { bg: 'bg-green-100', text: 'text-green-700', label: 'Current', icon: CheckCircle },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue', icon: AlertCircle },
      delinquent: { bg: 'bg-red-200', text: 'text-red-800', label: 'Delinquent', icon: AlertCircle },
      paid: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Paid', icon: CheckCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.current;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
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

  return (
    <div className="space-y-4">
      {owners.map((ownerData) => {
        const { owner, properties, stats } = ownerData;
        const isOwnerExpanded = expandedOwners.has(owner.id);

        return (
          <div key={owner.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Owner Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOwner(owner.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Expand/Collapse Icon */}
                  <button className="text-gray-400 hover:text-gray-600">
                    {isOwnerExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {/* Owner Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg" style={{ backgroundColor: '#0B3D2C' }}>
                    {owner.firstName[0]}{owner.lastName[0]}
                  </div>

                  {/* Owner Info */}
                  <div className="flex-1">
                    <Link
                      href={`/admin/owners/${owner.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg font-semibold text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                    >
                      {owner.firstName} {owner.lastName}
                    </Link>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {owner.email}
                      </span>
                      <span>{owner.phone}</span>
                    </div>
                  </div>

                  {/* Owner Stats */}
                  <div className="hidden lg:flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                      <p className="text-gray-600">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.occupiedProperties}</p>
                      <p className="text-gray-600">Occupied</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{stats.vacantProperties}</p>
                      <p className="text-gray-600">Vacant</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.totalMonthlyRent)}</p>
                      <p className="text-gray-600">Monthly Rent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats Row */}
              {isOwnerExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Collected This Month</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(stats.collectedThisMonth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overdue Amount</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(stats.overdueAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Complaints</p>
                    <p className="text-lg font-semibold text-orange-600">{stats.activeComplaints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {((stats.occupiedProperties / stats.totalProperties) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Properties List */}
            {isOwnerExpanded && (
              <div className="bg-gray-50 border-t border-gray-200">
                {properties.map((propData) => {
                  const { property, tenant, lease, recentPayments, activeComplaints } = propData;
                  const isPropertyExpanded = expandedProperties.has(property.id);

                  return (
                    <div key={property.id} className="border-b border-gray-200 last:border-0">
                      {/* Property Header */}
                      <div
                        className="p-4 pl-20 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProperty(property.id);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Expand Icon */}
                            <button className="text-gray-400">
                              {isPropertyExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>

                            {/* Property Icon */}
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <Home className="w-5 h-5 text-indigo-600" />
                            </div>

                            {/* Property Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                                {getStatusBadge(property.status)}
                                {activeComplaints.length > 0 && (
                                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {activeComplaints.length} Issues
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {property.address}, {property.city}
                                </span>
                                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(getPropertyTotalRent(property))}/mo</span>
                              </div>
                            </div>

                            {/* Tenant Badge or Vacant */}
                            {tenant ? (
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <Link
                                    href={`/admin/tenants/${tenant.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-sm font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#B87333] hover:decoration-[#B87333] transition-colors"
                                  >
                                    {tenant.firstName} {tenant.lastName}
                                  </Link>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {getRentStatusBadge(tenant.rentStatus)}
                                  </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                                  {tenant.firstName[0]}{tenant.lastName[0]}
                                </div>
                              </div>
                            ) : (
                              <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-medium">
                                No Tenant
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Property Details */}
                      {isPropertyExpanded && (
                        <div className="bg-white pl-36 pr-6 py-4 space-y-4">
                          {/* Tenant Details */}
                          {tenant ? (
                            <div className="space-y-3">
                              <h5 className="font-semibold text-gray-900 text-sm">Tenant Information</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Email</p>
                                  <p className="font-medium text-gray-900">{tenant.email}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Phone</p>
                                  <p className="font-medium text-gray-900">{tenant.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Move-in Date</p>
                                  <p className="font-medium text-gray-900">
                                    {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString('en-NG') : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Outstanding Balance</p>
                                  <p className={`font-semibold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatCurrency(tenant.outstandingBalance)}
                                  </p>
                                </div>
                              </div>

                              {/* Recent Payments */}
                              {recentPayments.length > 0 && (
                                <div className="mt-4">
                                  <h6 className="font-medium text-gray-900 text-sm mb-2">Recent Payments</h6>
                                  <div className="space-y-2">
                                    {recentPayments.map((payment) => (
                                      <div key={payment.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                        <span className="text-gray-600">{payment.description}</span>
                                        <div className="flex items-center space-x-3">
                                          <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                          }`}>
                                            {payment.status}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Active Complaints */}
                              {activeComplaints.length > 0 && (
                                <div className="mt-4">
                                  <h6 className="font-medium text-gray-900 text-sm mb-2">Active Issues</h6>
                                  <div className="space-y-2">
                                    {activeComplaints.map((complaint) => (
                                      <div key={complaint.id} className="flex items-start justify-between text-sm bg-red-50 border border-red-200 p-3 rounded">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">{complaint.title}</p>
                                          <p className="text-gray-600 text-xs mt-1">{complaint.category} • {complaint.priority} priority</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ml-3 ${
                                          complaint.status === 'open' ? 'bg-red-100 text-red-700' :
                                          complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                          'bg-green-100 text-green-700'
                                        }`}>
                                          {complaint.status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quick Actions */}
                              <div className="flex space-x-3 pt-3 border-t border-gray-200">
                                <button className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: '#0B3D2C' }}>
                                  View Lease
                                </button>
                                <button className="px-4 py-2 text-sm rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: '#B87333', color: 'white' }}>
                                  Send Message
                                </button>
                                <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                                  Mark as Moved Out
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-gray-600 mb-4">This property is currently vacant</p>
                              <div className="flex justify-center space-x-3">
                                <button className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: '#0B3D2C' }}>
                                  Publish Vacancy
                                </button>
                                <button className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: '#B87333' }}>
                                  Assign Tenant
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
