'use client';

import { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  Home,
  Users,
  MessageSquare,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { mockPayments, mockProperties, mockComplaints, mockTenants, mockPropertyOwners, getPropertyTotalRent } from '@/lib/data/adminMock';

type ReportType = 'revenue' | 'occupancy' | 'payments' | 'complaints';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('revenue');
  const [dateRange, setDateRange] = useState('this_month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate report data
  const completedPayments = mockPayments.filter((p) => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = mockPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const occupiedCount = mockProperties.filter((p) => p.status === 'occupied').length;
  const vacantCount = mockProperties.filter((p) => p.status === 'vacant').length;
  const occupancyRate = ((occupiedCount / mockProperties.length) * 100).toFixed(1);

  const openComplaints = mockComplaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length;
  const resolvedComplaints = mockComplaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;

  const reports = [
    { id: 'revenue' as ReportType, label: 'Revenue', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'occupancy' as ReportType, label: 'Occupancy', icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'payments' as ReportType, label: 'Payments', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'complaints' as ReportType, label: 'Complaints', icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  // Mock monthly data for charts
  const monthlyData = [
    { month: 'Jul', revenue: 3200000, payments: 8, complaints: 2 },
    { month: 'Aug', revenue: 3500000, payments: 10, complaints: 3 },
    { month: 'Sep', revenue: 3800000, payments: 9, complaints: 1 },
    { month: 'Oct', revenue: 4100000, payments: 11, complaints: 4 },
    { month: 'Nov', revenue: 3900000, payments: 10, complaints: 2 },
    { month: 'Dec', revenue: 4050000, payments: 12, complaints: 3 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View insights and generate reports</p>
        </div>
        <button
          className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
          style={{ backgroundColor: '#0B3D2C' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-4">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
        >
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_quarter">This Quarter</option>
          <option value="this_year">This Year</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reports.map((report) => {
          const Icon = report.icon;
          const isActive = activeReport === report.id;
          return (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={isActive ? { backgroundColor: '#0B3D2C' } : {}}
            >
              <Icon className="w-4 h-4" />
              {report.label}
            </button>
          );
        })}
      </div>

      {/* Revenue Report */}
      {activeReport === 'revenue' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% from last month
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Pending Revenue</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(pendingRevenue)}</p>
              <p className="text-sm text-gray-500 mt-2">Awaiting collection</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Average Rent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(mockProperties.reduce((sum, p) => sum + getPropertyTotalRent(p), 0) / mockProperties.length)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Per property</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">87.5%</p>
              <p className="text-sm text-gray-500 mt-2">On-time payments</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h3>
            <div className="flex items-end gap-4 h-64">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                      backgroundColor: '#0B3D2C',
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">{data.month}</p>
                  <p className="text-xs font-medium text-gray-700">{formatCurrency(data.revenue)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Owner */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Revenue by Owner</h3>
            <div className="space-y-4">
              {mockPropertyOwners.filter((o) => o.status === 'active').map((owner) => {
                const ownerProperties = mockProperties.filter((p) => p.ownerId === owner.id);
                const ownerRevenue = ownerProperties.reduce((sum, p) => sum + getPropertyTotalRent(p), 0);
                const percentage = ((ownerRevenue / totalRevenue) * 100).toFixed(1);
                return (
                  <div key={owner.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{owner.firstName} {owner.lastName}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(ownerRevenue)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: '#0B3D2C' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{ownerProperties.length} properties • {percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Occupancy Report */}
      {activeReport === 'occupancy' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{occupancyRate}%</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5% from last month
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{occupiedCount}</p>
              <p className="text-sm text-gray-500 mt-2">Properties</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Vacant</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{vacantCount}</p>
              <p className="text-sm text-gray-500 mt-2">Properties</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockProperties.length}</p>
              <p className="text-sm text-gray-500 mt-2">In portfolio</p>
            </div>
          </div>

          {/* Occupancy by Property Type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Occupancy by Property Type</h3>
            <div className="space-y-4">
              {['apartment', 'house', 'duplex'].map((type) => {
                const typeProperties = mockProperties.filter((p) => p.type === type);
                const typeOccupied = typeProperties.filter((p) => p.status === 'occupied').length;
                const typeRate = typeProperties.length > 0 ? ((typeOccupied / typeProperties.length) * 100).toFixed(0) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{type}</span>
                      <span className="font-medium text-gray-900">{typeOccupied}/{typeProperties.length} ({typeRate}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${typeRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Properties List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Property Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{property.name}</p>
                        <p className="text-sm text-gray-500">{property.city}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{property.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'occupied' ? 'bg-green-100 text-green-700' :
                          property.status === 'vacant' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(getPropertyTotalRent(property))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payments Report */}
      {activeReport === 'payments' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockPayments.length}</p>
              <p className="text-sm text-gray-500 mt-2">All time</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedPayments.length}</p>
              <p className="text-sm text-gray-500 mt-2">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {mockPayments.filter((p) => p.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500 mt-2">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {mockPayments.filter((p) => p.status === 'failed').length}
              </p>
              <p className="text-sm text-gray-500 mt-2">Requires attention</p>
            </div>
          </div>

          {/* Payment Methods Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['bank_transfer', 'card', 'cash'].map((method) => {
                const methodPayments = mockPayments.filter((p) => p.paymentMethod === method);
                const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                return (
                  <div key={method} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{methodPayments.length}</p>
                    <p className="text-sm text-gray-600 capitalize mt-1">{method.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(methodTotal)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockPayments.map((payment) => {
                    const tenant = mockTenants.find((t) => t.id === payment.tenantId);
                    const property = mockProperties.find((p) => p.id === payment.propertyId);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {tenant?.firstName} {tenant?.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{property?.name}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Complaints Report */}
      {activeReport === 'complaints' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockComplaints.length}</p>
              <p className="text-sm text-gray-500 mt-2">All time</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{openComplaints}</p>
              <p className="text-sm text-gray-500 mt-2">Needs attention</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{resolvedComplaints}</p>
              <p className="text-sm text-gray-500 mt-2">Completed</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {((resolvedComplaints / mockComplaints.length) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">Overall</p>
            </div>
          </div>

          {/* Complaints by Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Complaints by Category</h3>
            <div className="space-y-4">
              {['maintenance', 'plumbing', 'electrical', 'noise'].map((category) => {
                const categoryComplaints = mockComplaints.filter((c) => c.category === category);
                const percentage = ((categoryComplaints.length / mockComplaints.length) * 100).toFixed(0);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{category}</span>
                      <span className="font-medium text-gray-900">{categoryComplaints.length} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: '#B87333' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['low', 'medium', 'high', 'urgent'].map((priority) => {
                const priorityComplaints = mockComplaints.filter((c) => c.priority === priority);
                const colors = {
                  low: 'text-gray-600',
                  medium: 'text-blue-600',
                  high: 'text-orange-600',
                  urgent: 'text-red-600',
                };
                return (
                  <div key={priority} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className={`text-2xl font-bold ${colors[priority as keyof typeof colors]}`}>
                      {priorityComplaints.length}
                    </p>
                    <p className="text-sm text-gray-600 capitalize mt-1">{priority}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Complaints</h3>
            <div className="space-y-4">
              {mockComplaints.map((complaint) => {
                const property = mockProperties.find((p) => p.id === complaint.propertyId);
                return (
                  <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                        <p className="text-sm text-gray-500">{property?.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          complaint.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {complaint.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'resolved' || complaint.status === 'closed' ? 'bg-green-100 text-green-700' :
                          complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{complaint.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
