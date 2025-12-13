'use client';

import { mockDashboardStats, getOwnersWithProperties } from '@/lib/data/adminMock';
import {
  Building2,
  Users,
  Home,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import OwnerPropertyHierarchy from '@/components/admin/OwnerPropertyHierarchy';

const stats = mockDashboardStats;

const statCards = [
  {
    name: 'Total Owners',
    value: stats.totalOwners,
    icon: Users,
    href: '/admin/owners'
  },
  {
    name: 'Total Properties',
    value: stats.totalProperties,
    icon: Building2,
    href: '/admin/properties'
  },
  {
    name: 'Active Tenants',
    value: stats.totalTenants,
    icon: Home,
    href: '/admin/tenants'
  },
  {
    name: 'Occupancy Rate',
    value: `${stats.occupancyRate.toFixed(1)}%`,
    icon: TrendingUp,
  },
  {
    name: 'Monthly Revenue',
    value: `₦${(stats.totalMonthlyRevenue / 1000000).toFixed(1)}M`,
    icon: DollarSign,
    href: '/admin/payments'
  },
  {
    name: 'Pending KYC',
    value: stats.pendingKYC,
    icon: Clock,
    href: '/admin/kyc'
  },
  {
    name: 'Active Complaints',
    value: stats.activeComplaints,
    icon: AlertCircle,
    href: '/admin/complaints'
  },
  {
    name: 'Vacant Properties',
    value: stats.vacantProperties,
    icon: CheckCircle,
    href: '/admin/vacancies'
  },
];

export default function AdminDashboard() {
  const ownersWithProperties = getOwnersWithProperties();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your property management platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          const Card = (
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.name} href={stat.href}>
              {Card}
            </Link>
          ) : (
            <div key={stat.name}>{Card}</div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/owners/invite"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
              <Users className="w-5 h-5" style={{ color: '#0B3D2C' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Invite Property Owner</h3>
          </div>
          <p className="text-gray-600 text-sm">Send onboarding email to new owners</p>
        </Link>
        <Link
          href="/admin/kyc"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF3E8' }}>
              <UserCheck className="w-5 h-5" style={{ color: '#B87333' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Review KYC Applications</h3>
          </div>
          <p className="text-gray-600 text-sm">{stats.pendingKYC} pending review</p>
        </Link>
        <Link
          href="/admin/complaints"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-100">
              <AlertCircle className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Handle Complaints</h3>
          </div>
          <p className="text-gray-600 text-sm">{stats.activeComplaints} active issues</p>
        </Link>
      </div>

      {/* Main Hierarchical View */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Properties Overview</h2>
          <Link
            href="/admin/owners"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#0B3D2C' }}
          >
            View All →
          </Link>
        </div>
        <OwnerPropertyHierarchy owners={ownersWithProperties} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => {
            const typeIcons = {
              owner_onboarded: Users,
              tenant_applied: UserCheck,
              payment_received: CheckCircle,
              complaint_filed: AlertCircle,
              property_added: Building2,
            };
            const Icon = typeIcons[activity.type];

            return (
              <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
