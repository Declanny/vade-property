import type { StaffMember, PropertyAssignment, StaffDashboardStats, CalendarEvent } from '../types/staff';
import type { ShortletBooking, Property } from '../types/admin';
import { mockShortletBookings, mockProperties } from './adminMock';

// Mock Staff Members
export const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    email: 'ada.manager@truvade.com',
    firstName: 'Ada',
    lastName: 'Okonkwo',
    phone: '+234 803 111 2222',
    role: 'manager',
    status: 'active',
    assignedPropertyIds: ['prop-1', 'prop-7'], // Skyline Apartments, Ikoyi Luxury Shortlet
    createdAt: '2024-06-01T10:00:00Z',
    lastLogin: '2024-12-18T09:00:00Z',
  },
  {
    id: 'staff-2',
    email: 'emeka.staff@truvade.com',
    firstName: 'Emeka',
    lastName: 'Nwachukwu',
    phone: '+234 805 333 4444',
    role: 'staff',
    status: 'active',
    assignedPropertyIds: ['prop-7'], // Only Ikoyi Luxury Shortlet
    createdAt: '2024-08-15T10:00:00Z',
    lastLogin: '2024-12-17T14:00:00Z',
  },
  {
    id: 'staff-3',
    email: 'fatima.senior@truvade.com',
    firstName: 'Fatima',
    lastName: 'Ibrahim',
    phone: '+234 807 555 6666',
    role: 'senior_staff',
    status: 'active',
    assignedPropertyIds: ['prop-1'], // Only Skyline Apartments
    createdAt: '2024-07-20T10:00:00Z',
    lastLogin: '2024-12-18T08:30:00Z',
  },
  {
    id: 'staff-4',
    email: 'kola.inactive@truvade.com',
    firstName: 'Kola',
    lastName: 'Adeyemi',
    phone: '+234 809 777 8888',
    role: 'staff',
    status: 'inactive',
    assignedPropertyIds: [],
    createdAt: '2024-05-10T10:00:00Z',
    lastLogin: '2024-10-01T12:00:00Z',
  },
];

// Mock Property Assignments History (for audit trail)
export const mockPropertyAssignments: PropertyAssignment[] = [
  {
    id: 'assign-1',
    staffId: 'staff-1',
    propertyId: 'prop-1',
    assignedAt: '2024-06-01T10:00:00Z',
    assignedBy: 'admin-1',
  },
  {
    id: 'assign-2',
    staffId: 'staff-1',
    propertyId: 'prop-7',
    assignedAt: '2024-06-15T10:00:00Z',
    assignedBy: 'admin-1',
  },
  {
    id: 'assign-3',
    staffId: 'staff-2',
    propertyId: 'prop-7',
    assignedAt: '2024-08-15T10:00:00Z',
    assignedBy: 'admin-1',
  },
  {
    id: 'assign-4',
    staffId: 'staff-3',
    propertyId: 'prop-1',
    assignedAt: '2024-07-20T10:00:00Z',
    assignedBy: 'admin-1',
  },
];

// ==================== HELPER FUNCTIONS ====================

// Get staff member by ID
export function getStaffById(staffId: string): StaffMember | undefined {
  return mockStaffMembers.find(s => s.id === staffId);
}

// Get staff member by email
export function getStaffByEmail(email: string): StaffMember | undefined {
  return mockStaffMembers.find(s => s.email === email);
}

// Get all active staff members
export function getActiveStaff(): StaffMember[] {
  return mockStaffMembers.filter(s => s.status === 'active');
}

// Get staff assigned to a specific property
export function getStaffForProperty(propertyId: string): StaffMember[] {
  return mockStaffMembers.filter(
    s => s.status === 'active' && s.assignedPropertyIds.includes(propertyId)
  );
}

// Check if staff can access a property
export function canStaffAccessProperty(staffId: string, propertyId: string): boolean {
  const staff = getStaffById(staffId);
  if (!staff || staff.status !== 'active') return false;
  return staff.assignedPropertyIds.includes(propertyId);
}

// Check if staff can access a booking
export function canStaffAccessBooking(staffId: string, booking: ShortletBooking): boolean {
  return canStaffAccessProperty(staffId, booking.propertyId);
}

// ==================== FILTERED DATA ACCESS ====================

// Get bookings filtered by staff's assigned properties
export function getBookingsForStaff(staffId: string): ShortletBooking[] {
  const staff = getStaffById(staffId);
  if (!staff || staff.status !== 'active') return [];

  return mockShortletBookings.filter(
    booking => staff.assignedPropertyIds.includes(booking.propertyId)
  );
}

// Get properties filtered by staff's assignments
export function getPropertiesForStaff(staffId: string): Property[] {
  const staff = getStaffById(staffId);
  if (!staff || staff.status !== 'active') return [];

  return mockProperties.filter(
    property => staff.assignedPropertyIds.includes(property.id)
  );
}

// Get shortlet-enabled properties for staff
export function getShortletPropertiesForStaff(staffId: string): Property[] {
  const properties = getPropertiesForStaff(staffId);
  return properties.filter(p => {
    // Check if property allows shortlet
    if (p.allowShortlet) return true;
    // Check if any units allow shortlet
    if (p.units && p.units.some(u => u.allowShortlet)) return true;
    return false;
  });
}

// ==================== DASHBOARD STATS ====================

// Get dashboard stats for a staff member (filtered by their properties)
export function getStaffDashboardStats(staffId: string): StaffDashboardStats {
  const staff = getStaffById(staffId);
  if (!staff) {
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

  const bookings = getBookingsForStaff(staffId);
  const today = new Date().toISOString().split('T')[0];

  return {
    assignedProperties: staff.assignedPropertyIds.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    todayCheckIns: bookings.filter(b => b.checkIn === today && b.status === 'confirmed').length,
    todayCheckOuts: bookings.filter(b => b.checkOut === today && b.status === 'checked_in').length,
    currentGuests: bookings.filter(b => b.status === 'checked_in').length,
    upcomingBookings: bookings.filter(b => b.status === 'confirmed' && b.checkIn > today).length,
    recentPayments: bookings.filter(b => b.paymentStatus === 'completed').length,
  };
}

// ==================== CALENDAR EVENTS ====================

// Convert bookings to calendar events
export function getCalendarEventsForStaff(staffId: string): CalendarEvent[] {
  const bookings = getBookingsForStaff(staffId);
  const properties = getPropertiesForStaff(staffId);

  const events: CalendarEvent[] = [];

  // Add booking events
  bookings.forEach(booking => {
    const property = properties.find(p => p.id === booking.propertyId);
    const propertyName = property?.name || 'Unknown Property';

    events.push({
      id: `event-${booking.id}`,
      bookingId: booking.id,
      propertyId: booking.propertyId,
      unitId: booking.unitId !== booking.propertyId ? booking.unitId : undefined,
      title: booking.guestName,
      start: booking.checkIn,
      end: booking.checkOut,
      type: 'booking',
      status: booking.status,
      guestName: booking.guestName,
      color: getBookingStatusColor(booking.status),
    });
  });

  // Add blocked date events
  properties.forEach(property => {
    const blockedDates = property.availability?.blockedDates || [];
    blockedDates.forEach((date, index) => {
      events.push({
        id: `blocked-${property.id}-${index}`,
        propertyId: property.id,
        title: 'Blocked',
        start: date,
        end: date,
        type: 'blocked',
        color: '#6B7280', // Gray
      });
    });

    // Also check units for blocked dates
    property.units?.forEach(unit => {
      const unitBlockedDates = unit.availability?.blockedDates || [];
      unitBlockedDates.forEach((date, index) => {
        events.push({
          id: `blocked-${unit.id}-${index}`,
          propertyId: property.id,
          unitId: unit.id,
          title: `Blocked - ${unit.name}`,
          start: date,
          end: date,
          type: 'blocked',
          color: '#6B7280',
        });
      });
    });
  });

  return events;
}

// Get color based on booking status
function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return '#F59E0B'; // Yellow
    case 'confirmed':
      return '#3B82F6'; // Blue
    case 'checked_in':
      return '#10B981'; // Green
    case 'checked_out':
      return '#6B7280'; // Gray
    case 'cancelled':
      return '#EF4444'; // Red
    default:
      return '#6B7280';
  }
}

// ==================== BOOKING FILTERS ====================

// Filter bookings by status
export function filterBookingsByStatus(
  staffId: string,
  status: ShortletBooking['status']
): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  return bookings.filter(b => b.status === status);
}

// Filter bookings by property
export function filterBookingsByProperty(
  staffId: string,
  propertyId: string
): ShortletBooking[] {
  const staff = getStaffById(staffId);
  if (!staff || !staff.assignedPropertyIds.includes(propertyId)) return [];

  return mockShortletBookings.filter(b => b.propertyId === propertyId);
}

// Filter bookings by date range
export function filterBookingsByDateRange(
  staffId: string,
  startDate: string,
  endDate: string
): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  return bookings.filter(b => b.checkIn >= startDate && b.checkOut <= endDate);
}

// Get today's check-ins
export function getTodayCheckIns(staffId: string): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  const today = new Date().toISOString().split('T')[0];
  return bookings.filter(b => b.checkIn === today && b.status === 'confirmed');
}

// Get today's check-outs
export function getTodayCheckOuts(staffId: string): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  const today = new Date().toISOString().split('T')[0];
  return bookings.filter(b => b.checkOut === today && b.status === 'checked_in');
}

// Get upcoming bookings (next 7 days)
export function getUpcomingBookings(staffId: string, days: number = 7): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const todayStr = today.toISOString().split('T')[0];
  const futureDateStr = futureDate.toISOString().split('T')[0];

  return bookings.filter(
    b => b.checkIn >= todayStr &&
         b.checkIn <= futureDateStr &&
         (b.status === 'pending' || b.status === 'confirmed')
  );
}

// ==================== GUEST MANAGEMENT ====================

// Get unique guests from bookings
export interface GuestInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  totalBookings: number;
  lastBooking?: ShortletBooking;
}

export function getGuestsForStaff(staffId: string): GuestInfo[] {
  const bookings = getBookingsForStaff(staffId);
  const guestMap = new Map<string, GuestInfo>();

  bookings.forEach(booking => {
    const existingGuest = guestMap.get(booking.guestEmail);

    if (existingGuest) {
      existingGuest.totalBookings += 1;
      // Update last booking if this one is more recent
      if (!existingGuest.lastBooking || booking.createdAt > existingGuest.lastBooking.createdAt) {
        existingGuest.lastBooking = booking;
      }
    } else {
      guestMap.set(booking.guestEmail, {
        id: `guest-${booking.guestEmail}`,
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone,
        idNumber: booking.guestIdNumber,
        totalBookings: 1,
        lastBooking: booking,
      });
    }
  });

  return Array.from(guestMap.values());
}

// Get booking history for a guest
export function getGuestBookingHistory(staffId: string, guestEmail: string): ShortletBooking[] {
  const bookings = getBookingsForStaff(staffId);
  return bookings
    .filter(b => b.guestEmail === guestEmail)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==================== PAYMENT TRACKING ====================

// Get shortlet payments for staff's properties
export interface ShortletPaymentInfo {
  bookingId: string;
  guestName: string;
  propertyName: string;
  amount: number;
  status: string;
  reference?: string;
  date: string;
}

export function getShortletPaymentsForStaff(staffId: string): ShortletPaymentInfo[] {
  const bookings = getBookingsForStaff(staffId);
  const properties = getPropertiesForStaff(staffId);

  return bookings.map(booking => {
    const property = properties.find(p => p.id === booking.propertyId);
    return {
      bookingId: booking.id,
      guestName: booking.guestName,
      propertyName: property?.name || 'Unknown Property',
      amount: booking.totalAmount,
      status: booking.paymentStatus,
      reference: booking.paymentReference,
      date: booking.createdAt,
    };
  });
}
