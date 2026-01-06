'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import { mockStaffMembers } from '@/lib/data/staffMock';
import { mockProperties } from '@/lib/data/adminMock';
import { ROLE_LABELS, STATUS_LABELS } from '@/lib/types/staff';

export default function AdminStaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter staff
  const filteredStaff = mockStaffMembers.filter((staff) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
      if (
        !fullName.includes(query) &&
        !staff.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Role filter
    if (roleFilter !== 'all' && staff.role !== roleFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && staff.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Get property names for a staff member
  const getPropertyNames = (propertyIds: string[]) => {
    return propertyIds
      .map((id) => mockProperties.find((p) => p.id === id)?.name || 'Unknown')
      .join(', ');
  };

  // Stats
  const stats = {
    total: mockStaffMembers.length,
    active: mockStaffMembers.filter((s) => s.status === 'active').length,
    managers: mockStaffMembers.filter((s) => s.role === 'manager').length,
    seniorStaff: mockStaffMembers.filter((s) => s.role === 'senior_staff').length,
    staff: mockStaffMembers.filter((s) => s.role === 'staff').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">
            Manage staff members and their property assignments
          </p>
        </div>
        <Link
          href="/admin/staff/add"
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#0B3D2C' }}
        >
          <UserPlus className="w-4 h-4" />
          Add Staff
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Staff</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-purple-600">{stats.managers}</p>
          <p className="text-sm text-gray-600">Managers</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-blue-600">{stats.seniorStaff}</p>
          <p className="text-sm text-gray-600">Senior Staff</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-gray-600">{stats.staff}</p>
          <p className="text-sm text-gray-600">Staff</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="manager">Manager</option>
              <option value="senior_staff">Senior Staff</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium">Staff Member</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Properties</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: '#0B3D2C' }}
                        >
                          {staff.firstName[0]}
                          {staff.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <p className="text-sm text-gray-500 font-mono">
                            {staff.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          staff.role === 'manager'
                            ? 'bg-purple-100 text-purple-700'
                            : staff.role === 'senior_staff'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ROLE_LABELS[staff.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {staff.assignedPropertyIds.length} assigned
                        </span>
                      </div>
                      {staff.assignedPropertyIds.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                          {getPropertyNames(staff.assignedPropertyIds)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          staff.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : staff.status === 'inactive'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {STATUS_LABELS[staff.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {staff.lastLogin
                        ? new Date(staff.lastLogin).toLocaleDateString('en-NG', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/staff/${staff.id}`}
                          className="text-sm font-medium text-green-800 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/staff/${staff.id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900">About Staff Management</h3>
        <p className="text-sm text-blue-700 mt-1">
          Staff members can access the Staff Portal at <code className="px-1 py-0.5 bg-blue-100 rounded">/staff</code> to manage shortlet bookings for their assigned properties.
          Different roles have different permissions: Managers can do everything, Senior Staff can confirm bookings but not cancel, and Staff can only check guests in/out.
        </p>
      </div>
    </div>
  );
}
