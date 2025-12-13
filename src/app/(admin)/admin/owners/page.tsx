'use client';

import { mockPropertyOwners } from '@/lib/data/adminMock';
import { Plus, Mail, Phone, Calendar, Check, Clock, X } from 'lucide-react';
import Link from 'next/link';

export default function OwnersPage() {
  const owners = mockPropertyOwners;

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: Check, label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: X, label: 'Inactive' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Owners</h1>
          <p className="text-gray-600 mt-1">Manage property owners and their onboarding status</p>
        </div>
        <Link
          href="/admin/owners/invite"
          className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center"
          style={{ backgroundColor: '#0B3D2C' }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Invite Owner
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Owners</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{owners.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Active Owners</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {owners.filter(o => o.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {owners.filter(o => o.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Owners List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Onboarded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3" style={{ backgroundColor: '#0B3D2C' }}>
                        {owner.firstName[0]}{owner.lastName[0]}
                      </div>
                      <div>
                        <Link
                          href={`/admin/owners/${owner.id}`}
                          className="font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                        >
                          {owner.firstName} {owner.lastName}
                        </Link>
                        {owner.address && (
                          <p className="text-sm text-gray-500">{owner.address}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {owner.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {owner.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-2xl font-bold text-gray-900">{owner.totalProperties}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-2xl font-bold text-green-600">{owner.totalTenants}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(owner.monthlyRevenue)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(owner.status)}
                  </td>
                  <td className="px-6 py-4">
                    {owner.onboardedAt ? (
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {new Date(owner.onboardedAt).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                    ) : owner.inviteSentAt ? (
                      <div className="text-sm text-yellow-600">
                        <p>Invited {new Date(owner.inviteSentAt).toLocaleDateString('en-NG')}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not onboarded</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/owners/${owner.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </Link>
                      {owner.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Resend
                        </button>
                      )}
                    </div>
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
