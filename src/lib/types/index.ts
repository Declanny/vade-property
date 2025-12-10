// User & Authentication Types
export type UserRole = "guest" | "tenant" | "owner" | "admin" | "lawyer" | "support" | "finance" | "property_manager";

export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

export type KYCStatus = "not_started" | "pending" | "verified" | "rejected";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  userId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  bvn?: string; // Bank Verification Number (Nigeria)
  nationalId?: string;
  documents: Document[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Property Types
export type PropertyType = "apartment" | "house" | "condo" | "studio" | "penthouse" | "villa" | "duplex";

export type PropertyStatus = "draft" | "pending_verification" | "verified" | "rejected" | "active" | "inactive" | "rented" | "maintenance";

export type PaymentPlan = "1_month" | "3_months" | "6_months" | "12_months";

export interface PaymentPlanOption {
  plan: PaymentPlan;
  label: string;
  discount: number; // percentage discount
  totalMonths: number;
}

export interface Property {
  id: string;
  ownerId: string;
  owner?: User;
  title: string;
  description: string;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  paymentPlans: PaymentPlan[];
  bedrooms: number;
  bathrooms: number;
  area: number; // in square feet or meters
  areaUnit: "sqft" | "sqm";
  amenities: string[];
  images: string[];
  verified: boolean;
  verifiedBy?: string; // lawyer ID
  verifiedAt?: Date;
  status: PropertyStatus;
  featured: boolean;
  rating?: number;
  reviewCount: number;
  availableFrom?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  docType: "ownership" | "title_deed" | "survey_plan" | "tax_receipt" | "building_permit" | "other";
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  uploadedAt: Date;
}

// Application & Agreement Types
export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected" | "withdrawn";

export interface Application {
  id: string;
  propertyId: string;
  property?: Property;
  tenantId: string;
  tenant?: User;
  status: ApplicationStatus;
  employmentInfo: {
    employer: string;
    position: string;
    monthlyIncome: number;
    yearsEmployed: number;
  };
  documents: Document[];
  preferredMoveInDate: Date;
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export type AgreementStatus = "draft" | "pending_signature" | "tenant_signed" | "completed" | "terminated";

export interface Agreement {
  id: string;
  applicationId: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  lawyerId?: string;
  lawyer?: User;
  pdfUrl?: string;
  status: AgreementStatus;
  tenantSignedAt?: Date;
  ownerSignedAt?: Date;
  lawyerSignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Lease Types
export type LeaseStatus = "active" | "expiring_soon" | "expired" | "terminated" | "renewed";

export interface Lease {
  id: string;
  agreementId: string;
  agreement?: Agreement;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  currency: string;
  paymentPlan: PaymentPlan;
  nextDueDate: Date;
  status: LeaseStatus;
  securityDeposit: number;
  lateFeePer Day: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "overdue";

export type PaymentMethod = "card" | "bank_transfer" | "ussd" | "wallet";

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  providerTxnId?: string;
  provider: "stripe" | "paystack" | "flutterwave";
  planDuration: PaymentPlan;
  dueDate: Date;
  paidAt?: Date;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
}

// Wallet Types
export interface Wallet {
  userId: string;
  balance: number;
  pendingBalance: number;
  currency: string;
  updatedAt: Date;
}

// Maintenance Types
export type MaintenanceStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";

export type MaintenancePriority = "low" | "medium" | "high" | "urgent";

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "pest_control" | "other";
  priority: MaintenancePriority;
  images: string[];
  status: MaintenanceStatus;
  assignedTo?: string; // technician/vendor ID
  costEstimate?: number;
  actualCost?: number;
  scheduledDate?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dispute & Legal Types
export type DisputeType = "non_payment" | "property_damage" | "lease_violation" | "noise_complaint" | "illegal_occupancy" | "other";

export type DisputeStatus = "open" | "under_review" | "mediation" | "legal_action" | "resolved" | "closed";

export interface Dispute {
  id: string;
  leaseId: string;
  propertyId: string;
  type: DisputeType;
  description: string;
  filedBy: string; // user ID (can be tenant or owner)
  status: DisputeStatus;
  lawyerId?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LegalCaseStatus = "open" | "pending" | "in_court" | "settled" | "closed";

export interface LegalCase {
  id: string;
  disputeId: string;
  dispute?: Dispute;
  status: LegalCaseStatus;
  caseNumber?: string;
  actions: LegalAction[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalAction {
  id: string;
  caseId: string;
  actionType: "notice_sent" | "demand_letter" | "mediation_scheduled" | "court_filing" | "hearing" | "judgment" | "other";
  description: string;
  performedBy: string; // lawyer ID
  documentUrl?: string;
  performedAt: Date;
}

// Notification Types
export type NotificationType =
  | "rent_reminder"
  | "payment_confirmation"
  | "application_update"
  | "agreement_ready"
  | "maintenance_update"
  | "legal_notice"
  | "property_verification"
  | "system_alert";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  payload?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

// Filter & Search Types
export interface PropertyFilters {
  city?: string;
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  paymentPlans?: PaymentPlan[];
  verifiedOnly?: boolean;
  amenities?: string[];
}

export interface SearchParams extends PropertyFilters {
  query?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  meta?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}
