'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { StaffMember, StaffSession, StaffPermissions } from '@/lib/types/staff';
import { getStaffPermissions } from '@/lib/types/staff';
import { mockStaffMembers, getStaffById } from '@/lib/data/staffMock';

const STORAGE_KEY = 'staff_session';

const StaffAuthContext = createContext<StaffSession | undefined>(undefined);

interface StaffAuthProviderProps {
  children: ReactNode;
}

export function StaffAuthProvider({ children }: StaffAuthProviderProps) {
  const [user, setUser] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const staffId = JSON.parse(stored);
        const staff = getStaffById(staffId);
        if (staff && staff.status === 'active') {
          setUser(staff);
        } else {
          // Invalid or inactive staff - clear storage
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading staff session:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((staffId: string) => {
    const staff = getStaffById(staffId);
    if (staff && staff.status === 'active') {
      setUser(staff);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(staffId));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchRole = useCallback((staffId: string) => {
    // For development testing - switch between different staff accounts
    login(staffId);
  }, [login]);

  const value: StaffSession = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
  };

  return (
    <StaffAuthContext.Provider value={value}>
      {children}
    </StaffAuthContext.Provider>
  );
}

// Hook to access the auth context
export function useStaffAuth(): StaffSession {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within StaffAuthProvider');
  }
  return context;
}

// Hook to get current staff's permissions
export function useStaffPermissions(): StaffPermissions | null {
  const { user } = useStaffAuth();
  if (!user) return null;
  return getStaffPermissions(user.role);
}

// Hook to check a specific permission
export function useHasPermission(permission: keyof StaffPermissions): boolean {
  const permissions = useStaffPermissions();
  if (!permissions) return false;
  return permissions[permission];
}

// Get all available staff for role switcher (development tool)
export function getAvailableStaffForSwitcher(): StaffMember[] {
  return mockStaffMembers.filter(s => s.status === 'active');
}
