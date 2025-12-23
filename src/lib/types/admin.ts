// Admin System Type Definitions

export type UserRole = 'admin' | 'property_owner' | 'tenant';

export type PropertyStatus = 'vacant' | 'occupied' | 'under_review' | 'maintenance';

export type RentStatus = 'current' | 'overdue' | 'delinquent' | 'paid' | 'partial';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'documents_required';

export type LeaseStatus = 'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type PropertyType = 'apartment' | 'house' | 'duplex' | 'commercial' | 'studio' | 'penthouse';

export type UnitStatus = 'vacant' | 'occupied' | 'maintenance' | 'reserved';

export type ShortletBookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

// Shortlet pricing configuration
export interface ShortletPricing {
  dailyRate: number;
  weeklyRate?: number; // Optional discounted rate for weekly bookings
  minimumNights: number; // Default: 1
  maximumNights?: number; // Optional cap on booking length
  cleaningFee?: number;
  cautionDeposit?: number;
}

// Availability configuration for shortlets
export interface UnitAvailability {
  blockedDates: string[]; // ISO date strings for unavailable dates
  instantBook: boolean; // Auto-approve bookings or require manual approval
}

// Unit within a multi-unit property (building)
export interface Unit {
  id: string;
  propertyId: string;
  name: string; // e.g., "Unit 2A", "Flat 3", "Suite 101"
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft

  // Rental mode flags
  allowLongTerm: boolean; // Enable monthly rental
  allowShortlet: boolean; // Enable shortlet booking

  // Long-term pricing
  monthlyRent: number;
  securityDeposit: number;
  utilityCharges?: number;

  // Shortlet pricing (only if allowShortlet is true)
  shortletPricing?: ShortletPricing;

  // Availability for shortlets
  availability?: UnitAvailability;

  status: UnitStatus;
  currentTenantId?: string;
  availableFrom?: string;
  description?: string;
  images?: string[]; // unit-specific images
  createdAt: string;
  updatedAt: string;
}

// Shortlet booking record
export interface ShortletBooking {
  id: string;
  unitId: string;
  propertyId: string;
  ownerId: string;

  // Guest information
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestIdNumber?: string;

  // Booking details
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  nights: number;

  // Pricing breakdown
  nightlyRate: number;
  subtotal: number; // nights * nightlyRate
  cleaningFee: number;
  cautionDeposit: number;
  totalAmount: number;

  // Status
  status: ShortletBookingStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;

  // Notes
  specialRequests?: string;
  checkInNotes?: string;
  checkOutNotes?: string;

  createdAt: string;
  updatedAt: string;
}

// Core Models

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin';
  createdAt: string;
  lastLogin: string;
}

export interface PropertyOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'property_owner';
  status: 'active' | 'inactive' | 'pending';

  // Invitation tracking
  inviteToken?: string;
  inviteSentAt?: string;
  inviteExpiresAt?: string;
  onboardedAt?: string;

  // Profile completion
  profilePhoto?: string;
  idDocument?: string; // ID verification document URL
  idVerified?: boolean;

  createdAt: string;
  totalProperties: number;
  totalTenants: number;
  monthlyRevenue: number;
  propertiesCount?: number;

  // Bank details for rent payments
  bankAccountDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bvn?: string;
  };

  // Onboarding data (tenants the owner invited during onboarding)
  pendingTenantInvites?: {
    email: string;
    propertyId: string;
    unitId?: string;
  }[];
}

export interface Property {
  id: string;
  ownerId: string;
  name: string; // Building/property name: "Skyline Apartments"
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;

  // Building-level amenities and images (shared by all units)
  amenities: string[];
  images: string[];
  description?: string;

  // For single-unit properties (houses, standalone units)
  // These fields are used when units array is empty or undefined
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // in sqft
  monthlyRent?: number;
  securityDeposit?: number;
  utilityCharges?: number;
  currentTenantId?: string;
  availableFrom?: string;

  // Rental mode flags (for single-unit properties)
  allowLongTerm?: boolean; // Enable monthly rental
  allowShortlet?: boolean; // Enable shortlet booking

  // Shortlet pricing (for single-unit properties)
  shortletPricing?: ShortletPricing;
  availability?: UnitAvailability;

  // Multi-unit support
  units?: Unit[];
  totalUnits?: number; // Computed or stored for quick access

  // Status: for single-unit = unit status, for multi-unit = overall building status
  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  role: 'tenant';
  propertyId?: string;
  unitId?: string; // For multi-unit properties - which unit the tenant occupies
  kycStatus: KYCStatus;
  leaseStatus: LeaseStatus;
  moveInDate?: string;
  moveOutDate?: string;
  rentAmount?: number;
  monthlyRent?: number;
  rentStatus: RentStatus;
  lastPaymentDate?: string;
  nextPaymentDue?: string;
  outstandingBalance: number;
  createdAt: string;
  documents: KYCDocument[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  employmentInfo?: {
    employer?: string;
    employerName?: string;
    position?: string;
    jobTitle?: string;
    income?: string;
    monthlyIncome?: number;
  };
}

export interface KYCDocument {
  id: string;
  tenantId: string;
  type: 'id_card' | 'employment_proof' | 'guarantor_form' | 'bank_statement' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface LeaseAgreement {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId?: string; // For multi-unit properties
  ownerId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  documentUrl?: string;
  signedByTenant?: boolean;
  signedByOwner?: boolean;
  tenantSignedAt?: string;
  ownerSignedAt?: string;
  createdAt: string;
  terms: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId?: string; // For multi-unit properties
  ownerId: string;
  amount: number;
  type: 'rent' | 'utility' | 'deposit' | 'late_fee' | 'other';
  status: PaymentStatus;
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money' | 'cash';
  transactionReference?: string;
  dueDate: string;
  paidAt?: string;
  description?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId?: string; // For multi-unit properties
  ownerId: string;
  title: string;
  description: string;
  category: 'maintenance' | 'plumbing' | 'electrical' | 'noise' | 'security' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: ComplaintStatus;
  images?: string[];
  videos?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  timeline: ComplaintTimelineEntry[];
}

export interface ComplaintTimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'payment_received' | 'complaint_filed' | 'tenant_moved_in' | 'tenant_moved_out' | 'kyc_submitted' | 'lease_signed' | 'rent_overdue';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Dashboard Statistics

export interface DashboardStats {
  totalOwners: number;
  totalProperties: number;
  totalTenants: number;
  vacantProperties: number;
  occupancyRate: number;
  totalMonthlyRevenue: number;
  pendingKYC: number;
  activeComplaints: number;
  overduePayments: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'owner_onboarded' | 'tenant_applied' | 'payment_received' | 'complaint_filed' | 'property_added';
  description: string;
  timestamp: string;
  relatedId?: string;
}

// Hierarchical View Models

export interface OwnerWithProperties {
  owner: PropertyOwner;
  properties: PropertyWithTenant[];
  stats: {
    totalProperties: number;
    occupiedProperties: number;
    vacantProperties: number;
    totalMonthlyRent: number;
    collectedThisMonth: number;
    overdueAmount: number;
    activeComplaints: number;
  };
}

export interface PropertyWithTenant {
  property: Property;
  units?: UnitWithTenant[]; // For multi-unit properties
  tenant?: Tenant; // For single-unit properties
  lease?: LeaseAgreement;
  recentPayments: Payment[];
  activeComplaints: Complaint[];
}

// Unit with tenant information (for multi-unit properties)
export interface UnitWithTenant {
  unit: Unit;
  tenant?: Tenant;
  lease?: LeaseAgreement;
  recentPayments: Payment[];
  activeComplaints: Complaint[];
}

// Form Types

export interface InviteOwnerForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  message?: string;
}

export interface AddPropertyForm {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  description?: string;
  amenities: string[];

  // For single-unit properties
  isMultiUnit?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  utilityCharges?: number;

  // Rental mode (for single-unit properties)
  allowLongTerm?: boolean;
  allowShortlet?: boolean;
  shortletPricing?: ShortletPricing;

  // For multi-unit properties
  units?: AddUnitForm[];

  existingTenantEmails?: string[];
}

export interface AddUnitForm {
  name: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;

  // Rental mode flags
  allowLongTerm: boolean;
  allowShortlet: boolean;

  // Long-term pricing
  monthlyRent: number;
  securityDeposit: number;
  utilityCharges?: number;

  // Shortlet pricing (optional)
  shortletPricing?: ShortletPricing;

  description?: string;
  images?: string[];
}

// Helper type for vacancy listings (can be either a single-unit property or a unit)
export interface VacancyListing {
  id: string; // propertyId or unitId
  type: 'property' | 'unit';
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitName?: string;
  name: string; // Display name: Property name or "PropertyName - UnitName"
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  monthlyRent: number;
  securityDeposit: number;
  status: PropertyStatus | UnitStatus;
  availableFrom?: string;
  amenities: string[];
  images: string[];
  ownerId: string;
}

// For tenant assignment
export interface TenantAssignment {
  tenantId: string;
  propertyId: string;
  unitId?: string; // undefined for single-unit properties
}

export interface KYCReviewForm {
  tenantId: string;
  decision: 'approve' | 'reject';
  notes?: string;
  documentsApproved: string[];
  documentsRejected: string[];
  rejectionReasons?: Record<string, string>;
}

export interface ComplaintUpdateForm {
  complaintId: string;
  status: ComplaintStatus;
  assignedTo?: string;
  notes: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
