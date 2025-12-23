'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  CreditCard,
  MessageSquareWarning,
  FileText,
  Settings,
  HomeIcon,
  BarChart3,
  CalendarDays
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Property Owners', href: '/admin/owners', icon: Building2 },
  { name: 'Properties', href: '/admin/properties', icon: HomeIcon },
  { name: 'Shortlets', href: '/admin/shortlets', icon: CalendarDays },
  { name: 'Tenants', href: '/admin/tenants', icon: Users },
  { name: 'KYC Review', href: '/admin/kyc', icon: UserCheck, badge: 'pending' },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Complaints', href: '/admin/complaints', icon: MessageSquareWarning, badge: 'active' },
  { name: 'Vacancies', href: '/admin/vacancies', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold" style={{ color: '#0B3D2C' }}>
          Tru<span style={{ color: '#B87333' }}>Vade</span>
        </h1>
        <span className="ml-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: '#0B3D2C', color: 'white' }}>Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'text-white hover:opacity-90'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              style={isActive ? { backgroundColor: '#0B3D2C' } : {}}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.name}</span>
              {item.badge === 'pending' && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  1
                </span>
              )}
              {item.badge === 'active' && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  2
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#0B3D2C' }}>
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@truvade.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
