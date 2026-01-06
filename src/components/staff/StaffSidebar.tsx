'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  CreditCard,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useStaffBookings } from '@/lib/hooks/useStaffBookings';
import { ROLE_LABELS } from '@/lib/types/staff';

const navigation = [
  { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
  { name: 'Bookings', href: '/staff/bookings', icon: CalendarDays, badge: 'pending' },
  { name: 'Calendar', href: '/staff/calendar', icon: Calendar },
  { name: 'Guests', href: '/staff/guests', icon: Users },
  { name: 'Payments', href: '/staff/payments', icon: CreditCard },
  { name: 'Properties', href: '/staff/properties', icon: Building2 },
  { name: 'Settings', href: '/staff/settings', icon: Settings },
];

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function StaffSidebar() {
  const pathname = usePathname();
  const { user, logout } = useStaffAuth();
  const { stats } = useStaffBookings();

  const handleLogout = () => {
    logout();
    window.location.href = '/staff/login';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold" style={{ color: '#0B3D2C' }}>
          Tru<span style={{ color: '#B87333' }}>Vade</span>
        </h1>
        <span
          className="ml-2 text-xs px-2 py-1 rounded text-white"
          style={{ backgroundColor: STAFF_PRIMARY }}
        >
          Staff
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/staff' && pathname.startsWith(item.href));
          const Icon = item.icon;

          // Get badge count based on item
          let badgeCount = 0;
          if (item.badge === 'pending') {
            badgeCount = stats.pendingBookings;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? 'text-white hover:opacity-90'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              style={isActive ? { backgroundColor: STAFF_PRIMARY } : {}}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {badgeCount > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: STAFF_PRIMARY }}
          >
            {user?.firstName?.[0] || 'S'}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Staff'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user ? ROLE_LABELS[user.role] : ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
