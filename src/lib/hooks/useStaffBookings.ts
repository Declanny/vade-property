'use client';

import { useMemo, useCallback } from 'react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { mockShortletBookings, mockProperties } from '@/lib/data/adminMock';
import {
  getBookingsForStaff,
  getPropertiesForStaff,
  getShortletPropertiesForStaff,
  getStaffDashboardStats,
  getCalendarEventsForStaff,
  getTodayCheckIns,
  getTodayCheckOuts,
  getUpcomingBookings,
  getGuestsForStaff,
  getShortletPaymentsForStaff,
  canStaffAccessProperty,
  canStaffAccessBooking,
  type GuestInfo,
  type ShortletPaymentInfo,
} from '@/lib/data/staffMock';
import type { ShortletBooking, Property } from '@/lib/types/admin';
import type { StaffDashboardStats, CalendarEvent } from '@/lib/types/staff';

export interface UseStaffBookingsReturn {
  // Data
  bookings: ShortletBooking[];
  properties: Property[];
  shortletProperties: Property[];
  stats: StaffDashboardStats;
  calendarEvents: CalendarEvent[];
  todayCheckIns: ShortletBooking[];
  todayCheckOuts: ShortletBooking[];
  upcomingBookings: ShortletBooking[];
  guests: GuestInfo[];
  payments: ShortletPaymentInfo[];

  // Getters
  getBookingById: (id: string) => ShortletBooking | undefined;
  getPropertyById: (id: string) => Property | undefined;

  // Filters
  filterByStatus: (status: ShortletBooking['status']) => ShortletBooking[];
  filterByProperty: (propertyId: string) => ShortletBooking[];
  filterByDateRange: (start: string, end: string) => ShortletBooking[];

  // Access checks
  canAccessBooking: (bookingId: string) => boolean;
  canAccessProperty: (propertyId: string) => boolean;

  // Loading state
  isLoading: boolean;
}

export function useStaffBookings(): UseStaffBookingsReturn {
  const { user, isLoading: authLoading } = useStaffAuth();

  // Memoized data filtered by staff's assigned properties
  const bookings = useMemo(() => {
    if (!user) return [];
    return getBookingsForStaff(user.id);
  }, [user]);

  const properties = useMemo(() => {
    if (!user) return [];
    return getPropertiesForStaff(user.id);
  }, [user]);

  const shortletProperties = useMemo(() => {
    if (!user) return [];
    return getShortletPropertiesForStaff(user.id);
  }, [user]);

  const stats = useMemo(() => {
    if (!user) {
      return {
        assignedProperties: 0,
        totalBookings: 0,
        pendingBookings: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        currentGuests: 0,
        upcomingBookings: 0,
        recentPayments: 0,
      };
    }
    return getStaffDashboardStats(user.id);
  }, [user]);

  const calendarEvents = useMemo(() => {
    if (!user) return [];
    return getCalendarEventsForStaff(user.id);
  }, [user]);

  const todayCheckIns = useMemo(() => {
    if (!user) return [];
    return getTodayCheckIns(user.id);
  }, [user]);

  const todayCheckOuts = useMemo(() => {
    if (!user) return [];
    return getTodayCheckOuts(user.id);
  }, [user]);

  const upcomingBookings = useMemo(() => {
    if (!user) return [];
    return getUpcomingBookings(user.id);
  }, [user]);

  const guests = useMemo(() => {
    if (!user) return [];
    return getGuestsForStaff(user.id);
  }, [user]);

  const payments = useMemo(() => {
    if (!user) return [];
    return getShortletPaymentsForStaff(user.id);
  }, [user]);

  // Getters with access control
  const getBookingById = useCallback(
    (id: string): ShortletBooking | undefined => {
      if (!user) return undefined;
      const booking = mockShortletBookings.find(b => b.id === id);
      if (!booking) return undefined;
      // Check access
      if (!canStaffAccessBooking(user.id, booking)) return undefined;
      return booking;
    },
    [user]
  );

  const getPropertyById = useCallback(
    (id: string): Property | undefined => {
      if (!user) return undefined;
      if (!canStaffAccessProperty(user.id, id)) return undefined;
      return mockProperties.find(p => p.id === id);
    },
    [user]
  );

  // Filter functions
  const filterByStatus = useCallback(
    (status: ShortletBooking['status']): ShortletBooking[] => {
      return bookings.filter(b => b.status === status);
    },
    [bookings]
  );

  const filterByProperty = useCallback(
    (propertyId: string): ShortletBooking[] => {
      if (!user || !canStaffAccessProperty(user.id, propertyId)) return [];
      return bookings.filter(b => b.propertyId === propertyId);
    },
    [bookings, user]
  );

  const filterByDateRange = useCallback(
    (start: string, end: string): ShortletBooking[] => {
      return bookings.filter(b => b.checkIn >= start && b.checkOut <= end);
    },
    [bookings]
  );

  // Access check functions
  const canAccessBooking = useCallback(
    (bookingId: string): boolean => {
      if (!user) return false;
      const booking = mockShortletBookings.find(b => b.id === bookingId);
      if (!booking) return false;
      return canStaffAccessBooking(user.id, booking);
    },
    [user]
  );

  const canAccessProperty = useCallback(
    (propertyId: string): boolean => {
      if (!user) return false;
      return canStaffAccessProperty(user.id, propertyId);
    },
    [user]
  );

  return {
    // Data
    bookings,
    properties,
    shortletProperties,
    stats,
    calendarEvents,
    todayCheckIns,
    todayCheckOuts,
    upcomingBookings,
    guests,
    payments,

    // Getters
    getBookingById,
    getPropertyById,

    // Filters
    filterByStatus,
    filterByProperty,
    filterByDateRange,

    // Access checks
    canAccessBooking,
    canAccessProperty,

    // Loading state
    isLoading: authLoading,
  };
}

// Re-export for convenience
export { useStaffAuth, useStaffPermissions, useHasPermission } from '@/contexts/StaffAuthContext';
