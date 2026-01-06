'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, UserCog, Check } from 'lucide-react';
import { useStaffAuth, getAvailableStaffForSwitcher } from '@/contexts/StaffAuthContext';
import { ROLE_LABELS } from '@/lib/types/staff';

// Staff theme color
const STAFF_PRIMARY = '#1E40AF';

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, switchRole } = useStaffAuth();

  const availableStaff = getAvailableStaffForSwitcher();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (staffId: string) => {
    switchRole(staffId);
    setIsOpen(false);
    // Reload the page to refresh all data
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        title="Switch Staff Account (Dev Tool)"
      >
        <UserCog className="w-4 h-4" />
        <span className="hidden sm:inline">Switch Role</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Development Tool
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Switch between staff accounts for testing
            </p>
          </div>

          <div className="py-1">
            {availableStaff.map((staff) => {
              const isCurrentUser = user?.id === staff.id;

              return (
                <button
                  key={staff.id}
                  onClick={() => handleSwitch(staff.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    isCurrentUser ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: STAFF_PRIMARY }}
                  >
                    {staff.firstName[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {staff.firstName} {staff.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ROLE_LABELS[staff.role]} &bull; {staff.assignedPropertyIds.length} properties
                    </p>
                  </div>

                  {/* Check mark for current user */}
                  {isCurrentUser && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Each staff has different property access and permissions based on their role.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
