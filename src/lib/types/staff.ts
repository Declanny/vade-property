// Staff System Type Definitions

export type StaffRole = 'staff' | 'senior_staff' | 'manager';

export type StaffStatus = 'active' | 'inactive' | 'suspended';

// Staff member model
export interface StaffMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;

  // Property assignments - staff can only access these properties
  assignedPropertyIds: string[];

  // Profile
  profilePhoto?: string;

  // Timestamps
  createdAt: string;
  lastLogin?: string;
}

// Property assignment record (for audit/history)
export interface PropertyAssignment {
  id: string;
  staffId: string;
  propertyId: string;
  assignedAt: string;
  assignedBy: string; // Admin ID who made the assignment
  revokedAt?: string;
  revokedBy?: string;
}

// Auth session type
export interface StaffSession {
  user: StaffMember | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (staffId: string) => void;
  logout: () => void;
  switchRole: (staffId: string) => void; // For testing/dev
}

// Staff dashboard stats (filtered by assigned properties)
export interface StaffDashboardStats {
  assignedProperties: number;
  totalBookings: number;
  pendingBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  currentGuests: number;
  upcomingBookings: number;
  recentPayments: number;
}

// Calendar event for availability view
export interface CalendarEvent {
  id: string;
  bookingId?: string;
  propertyId: string;
  unitId?: string;
  title: string; // Guest name or "Blocked"
  start: string; // ISO date
  end: string; // ISO date
  type: 'booking' | 'blocked';
  status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  guestName?: string;
  color?: string;
}

// Role-based permissions
export interface StaffPermissions {
  canConfirmBookings: boolean;
  canCancelBookings: boolean;
  canCheckInOut: boolean;
  canEditAvailability: boolean;
  canViewPayments: boolean;
  canExportReports: boolean;
}

// Permission definitions by role
export const ROLE_PERMISSIONS: Record<StaffRole, StaffPermissions> = {
  manager: {
    canConfirmBookings: true,
    canCancelBookings: true,
    canCheckInOut: true,
    canEditAvailability: true,
    canViewPayments: true,
    canExportReports: true,
  },
  senior_staff: {
    canConfirmBookings: true,
    canCancelBookings: false, // Needs manager approval
    canCheckInOut: true,
    canEditAvailability: true,
    canViewPayments: true,
    canExportReports: false,
  },
  staff: {
    canConfirmBookings: false, // View only
    canCancelBookings: false,
    canCheckInOut: true, // Primary duty
    canEditAvailability: false,
    canViewPayments: false, // No financial access
    canExportReports: false,
  },
};

// Helper to get permissions for a staff member
export function getStaffPermissions(role: StaffRole): StaffPermissions {
  return ROLE_PERMISSIONS[role];
}

// Helper to check if staff has a specific permission
export function hasPermission(
  role: StaffRole,
  permission: keyof StaffPermissions
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

// Role display labels
export const ROLE_LABELS: Record<StaffRole, string> = {
  manager: 'Manager',
  senior_staff: 'Senior Staff',
  staff: 'Staff',
};

// Status display labels
export const STATUS_LABELS: Record<StaffStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
};

// Form types for staff management
export interface CreateStaffForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: StaffRole;
  assignedPropertyIds: string[];
}

export interface UpdateStaffForm {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: StaffRole;
  status?: StaffStatus;
  assignedPropertyIds?: string[];
}
