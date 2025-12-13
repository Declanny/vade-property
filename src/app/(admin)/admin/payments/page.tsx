'use client';

import { useState } from 'react';
import { mockPayments, mockTenants, mockProperties, getOverduePayments } from '@/lib/data/adminMock';
import Link from 'next/link';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Filter, Plus } from 'lucide-react';
import type { PaymentStatus } from '@/lib/types/admin';

export default function PaymentsPage() {
  const [payments] = useState(mockPayments);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');

  const filteredPayments = payments.filter(
    p => selectedStatus === 'all' || p.status === selectedStatus
  );

  const getStatusBadge = (status: PaymentStatus) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'Processing' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Completed' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Failed' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle, label: 'Refunded' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getTenantName = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown';
  };

  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overduePayments = getOverduePayments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Rent Collection</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all property payments</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/payments/record"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Record Payment
          </Link>
          <button className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          <p className="text-gray-500 text-xs mt-2">
            {payments.filter(p => p.status === 'completed').length} payments
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
          <p className="text-gray-500 text-xs mt-2">
            {payments.filter(p => p.status === 'pending').length} pending
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
          <p className="text-gray-500 text-xs mt-2">
            {formatCurrency(overduePayments.reduce((sum, p) => sum + p.amount, 0))}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">This Month</p>
          <p className="text-2xl font-bold text-gray-900">
            {payments.filter(
              p => p.status === 'completed' &&
              new Date(p.paidAt || '').getMonth() === new Date().getMonth()
            ).length}
          </p>
          <p className="text-gray-500 text-xs mt-2">Payments received</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === 'all' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={selectedStatus === 'all' ? { backgroundColor: '#0B3D2C' } : {}}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === 'completed' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={selectedStatus === 'completed' ? { backgroundColor: '#0B3D2C' } : {}}
        >
          Completed ({payments.filter(p => p.status === 'completed').length})
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === 'pending' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={selectedStatus === 'pending' ? { backgroundColor: '#0B3D2C' } : {}}
        >
          Pending ({payments.filter(p => p.status === 'pending').length})
        </button>
      </div>

      {/* Overdue Alert */}
      {overduePayments.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total overdue amount: <span className="font-medium text-red-600">{formatCurrency(overduePayments.reduce((sum, p) => sum + p.amount, 0))}</span>
            </p>
          </div>
          <button
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Send Reminders
          </button>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();

                return (
                  <tr key={payment.id} className={`hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-mono text-gray-900">{payment.id}</p>
                      {payment.transactionReference && (
                        <p className="text-xs text-gray-500 font-mono">{payment.transactionReference}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{getTenantName(payment.tenantId)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{getPropertyName(payment.propertyId)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                        {payment.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900 capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm ${isOverdue ? 'text-red-700 font-semibold' : 'text-gray-900'}`}>
                        {new Date(payment.dueDate).toLocaleDateString('en-NG')}
                      </p>
                      {isOverdue && (
                        <p className="text-xs text-red-600">OVERDUE</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.paidAt ? (
                        <p className="text-sm text-green-700 font-medium">
                          {new Date(payment.paidAt).toLocaleDateString('en-NG')}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                          View
                        </button>
                        {payment.receiptUrl && (
                          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
