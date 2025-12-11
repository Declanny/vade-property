'use client';

import { mockTenants } from '@/lib/data/adminMock';
import { Mail, Phone, Home, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function TenantsPage() {
  const tenants = mockTenants;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRentStatusBadge = (status: string) => {
    const badges = {
      current: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.current;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
        <p className="text-gray-600 mt-1">Manage all tenants across properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Tenants</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{tenants.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Active Leases</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {tenants.filter(t => t.leaseStatus === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Rent Current</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {tenants.filter(t => t.rentStatus === 'current').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Move-in Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3" style={{ backgroundColor: '#B87333' }}>
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tenant.firstName} {tenant.lastName}</p>
                        <p className="text-xs text-gray-500">ID: {tenant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {tenant.rentAmount ? formatCurrency(tenant.rentAmount) : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getRentStatusBadge(tenant.rentStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString('en-NG') : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
