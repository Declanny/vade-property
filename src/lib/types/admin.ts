// Admin System Type Definitions

export type UserRole = 'admin' | 'property_owner' | 'tenant';

export type PropertyStatus = 'vacant' | 'occupied' | 'under_review' | 'maintenance';

export type RentStatus = 'current' | 'overdue' | 'delinquent' | 'paid' | 'partial';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'documents_required';

export type LeaseStatus = 'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type PropertyType = 'apartment' | 'house' | 'duplex' | 'commercial' | 'studio' | 'penthouse';

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
  inviteToken?: string;
  inviteSentAt?: string;
  onboardedAt?: string;
  createdAt: string;
  totalProperties: number;
  totalTenants: number;
  monthlyRevenue: number;
  propertiesCount?: number;
  bankAccountDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  monthlyRent: number;
  securityDeposit: number;
  utilityCharges?: number;
  description?: string;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  currentTenantId?: string;
  availableFrom?: string;
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
  bedrooms: number;
  bathrooms: number;
  area: number;
  monthlyRent: number;
  securityDeposit: number;
  utilityCharges?: number;
  description?: string;
  amenities: string[];
  existingTenantEmails?: string[];
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
