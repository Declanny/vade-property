'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check,
  Clock,
  AlertCircle,
  CreditCard,
  MessageSquare,
  FileText,
  User,
  Home,
  Pencil,
} from 'lucide-react';
import {
  mockTenants,
  mockProperties,
  mockPayments,
  mockComplaints,
  mockLeaseAgreements,
  mockPropertyOwners,
  getPropertyTotalRent,
} from '@/lib/data/adminMock';

type TabType = 'overview' | 'payments' | 'complaints' | 'documents' | 'lease';

export default function TenantProfilePage() {
  const params = useParams();
  const tenantId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Find tenant and related data
  const tenant = mockTenants.find((t) => t.id === tenantId);
  const tenantProperty = tenant?.propertyId
    ? mockProperties.find((p) => p.id === tenant.propertyId)
    : null;
  const tenantOwner = tenantProperty
    ? mockPropertyOwners.find((o) => o.id === tenantProperty.ownerId)
    : null;
  const tenantPayments = mockPayments.filter((p) => p.tenantId === tenantId);
  const tenantComplaints = mockComplaints.filter((c) => c.tenantId === tenantId);
  const tenantLease = mockLeaseAgreements.find((l) => l.tenantId === tenantId);

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
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired' },
      terminated: { bg: 'bg-red-100', text: 'text-red-700', label: 'Terminated' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
      signed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Signed' },
      current: { bg: 'bg-green-100', text: 'text-green-700', label: 'Current' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
      delinquent: { bg: 'bg-red-200', text: 'text-red-800', label: 'Delinquent' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
      partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Partial' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
      resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
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

  // Handle tenant not found
  if (!tenant) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tenant Not Found</h3>
          <p className="text-gray-600 mb-4">The tenant you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/tenants"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-block"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Back to Tenants
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    { id: 'payments' as TabType, label: 'Payments', icon: CreditCard, count: tenantPayments.length },
    { id: 'complaints' as TabType, label: 'Complaints', icon: MessageSquare, count: tenantComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
    { id: 'documents' as TabType, label: 'Documents', icon: FileText, count: tenant.documents?.length || 0 },
    { id: 'lease' as TabType, label: 'Lease', icon: FileText },
  ];

  // Calculate stats
  const totalPaid = tenantPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = tenantPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/tenants"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tenants
      </Link>

      {/* Tenant Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: '#B87333' }}
            >
              {tenant.firstName[0]}
              {tenant.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {tenant.firstName} {tenant.lastName}
                </h1>
                {getStatusBadge(tenant.leaseStatus)}
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
                    Move-in: {new Date(tenant.moveInDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Edit Button */}
          <Link
            href={`/admin/tenants/${tenant.id}/edit`}
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Tenant
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="text-xl font-bold text-gray-900">
                {tenant.rentAmount ? formatCurrency(tenant.rentAmount) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${tenant.outstandingBalance > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertCircle className={`w-6 h-6 ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className={`text-xl font-bold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(tenant.outstandingBalance)}
              </p>
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
                  style={isActive ? { backgroundColor: '#B87333' } : {}}
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
              {/* Property Information */}
              {tenantProperty && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Property</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{tenantProperty.name}</h4>
                        <p className="text-sm text-gray-600">{tenantProperty.address}, {tenantProperty.city}, {tenantProperty.state}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {tenantProperty.bedrooms} bed, {tenantProperty.bathrooms} bath, {tenantProperty.area} sqft
                        </p>
                        {tenantOwner && (
                          <div className="mt-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Owner: </span>
                            <Link
                              href={`/admin/owners/${tenantOwner.id}`}
                              className="text-sm font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                            >
                              {tenantOwner.firstName} {tenantOwner.lastName}
                            </Link>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(getPropertyTotalRent(tenantProperty))}/mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Verification Status</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {tenant.documents?.length || 0} document(s) submitted
                      </p>
                    </div>
                    {getStatusBadge(tenant.kycStatus)}
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                {tenantPayments.length > 0 ? (
                  <div className="space-y-3">
                    {tenantPayments.slice(0, 3).map((payment) => (
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
                {tenantComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length > 0 ? (
                  <div className="space-y-3">
                    {tenantComplaints
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

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {tenantPayments.length > 0 ? (
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
                      {tenantPayments.map((payment) => (
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
              {tenantComplaints.length > 0 ? (
                <div className="space-y-4">
                  {tenantComplaints.map((complaint) => (
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

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              {tenant.documents && tenant.documents.length > 0 ? (
                <div className="space-y-4">
                  {tenant.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type.replace('_', ' ')} | Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-NG')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents submitted</p>
                </div>
              )}
            </div>
          )}

          {/* Lease Tab */}
          {activeTab === 'lease' && (
            <div>
              {tenantLease ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Lease Agreement</h4>
                      {getStatusBadge(tenantLease.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(tenantLease.startDate).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(tenantLease.endDate).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Rent</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(tenantLease.monthlyRent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Security Deposit</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(tenantLease.securityDeposit)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        {tenantLease.signedByTenant ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className={tenantLease.signedByTenant ? 'text-green-700' : 'text-yellow-700'}>
                          {tenantLease.signedByTenant ? 'Signed by Tenant' : 'Pending Tenant Signature'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tenantLease.signedByOwner ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className={tenantLease.signedByOwner ? 'text-green-700' : 'text-yellow-700'}>
                          {tenantLease.signedByOwner ? 'Signed by Owner' : 'Pending Owner Signature'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No lease agreement</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
