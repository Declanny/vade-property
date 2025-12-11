import type {
  PropertyOwner,
  Property,
  Tenant,
  Payment,
  Complaint,
  LeaseAgreement,
  KYCDocument,
  DashboardStats,
  OwnerWithProperties,
  PropertyWithTenant,
  Notification,
  ActivityItem,
} from '../types/admin';

// Mock Property Owners
export const mockPropertyOwners: PropertyOwner[] = [
  {
    id: 'owner-1',
    email: 'john.adewale@example.com',
    firstName: 'John',
    lastName: 'Adewale',
    phone: '+234 803 456 7890',
    address: '45 Victoria Island, Lagos',
    role: 'property_owner',
    status: 'active',
    onboardedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    totalProperties: 4,
    totalTenants: 3,
    monthlyRevenue: 2850000,
  },
  {
    id: 'owner-2',
    email: 'sarah.okonkwo@example.com',
    firstName: 'Sarah',
    lastName: 'Okonkwo',
    phone: '+234 805 123 4567',
    address: '12 GRA, Port Harcourt',
    role: 'property_owner',
    status: 'active',
    onboardedAt: '2024-02-20T14:00:00Z',
    createdAt: '2024-02-20T14:00:00Z',
    totalProperties: 2,
    totalTenants: 2,
    monthlyRevenue: 1200000,
  },
  {
    id: 'owner-3',
    email: 'michael.eze@example.com',
    firstName: 'Michael',
    lastName: 'Eze',
    phone: '+234 807 890 1234',
    role: 'property_owner',
    status: 'pending',
    inviteToken: 'inv-xyz123',
    inviteSentAt: '2024-12-10T09:00:00Z',
    createdAt: '2024-12-10T09:00:00Z',
    totalProperties: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
  },
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    name: 'Skyline Apartments - Unit 2A',
    address: '123 Ahmadu Bello Way',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '101001',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    monthlyRent: 850000,
    securityDeposit: 1700000,
    utilityCharges: 50000,
    description: 'Modern 3-bedroom apartment with ocean views',
    amenities: ['Swimming Pool', '24/7 Security', 'Gym', 'Parking', 'Generator'],
    images: ['/properties/apt-1.jpg', '/properties/apt-2.jpg'],
    status: 'occupied',
    currentTenantId: 'tenant-1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'prop-2',
    ownerId: 'owner-1',
    name: 'Skyline Apartments - Unit 2B',
    address: '123 Ahmadu Bello Way',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '101001',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    monthlyRent: 650000,
    securityDeposit: 1300000,
    amenities: ['Swimming Pool', '24/7 Security', 'Gym', 'Parking'],
    images: ['/properties/apt-3.jpg'],
    status: 'vacant',
    availableFrom: '2024-12-01T00:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-11-28T09:00:00Z',
  },
  {
    id: 'prop-3',
    ownerId: 'owner-1',
    name: 'Lekki Gardens House',
    address: '56 Admiralty Way',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '101001',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    monthlyRent: 1200000,
    securityDeposit: 2400000,
    utilityCharges: 100000,
    amenities: ['Garden', 'Parking', 'Security', 'Boys Quarter'],
    images: ['/properties/house-1.jpg'],
    status: 'occupied',
    currentTenantId: 'tenant-2',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    id: 'prop-4',
    ownerId: 'owner-1',
    name: 'Victoria Island Duplex',
    address: '89 Ozumba Mbadiwe Avenue',
    city: 'Lagos',
    state: 'Lagos',
    zipCode: '101001',
    type: 'duplex',
    bedrooms: 5,
    bathrooms: 4,
    area: 2800,
    monthlyRent: 1800000,
    securityDeposit: 3600000,
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Smart Home'],
    images: ['/properties/duplex-1.jpg'],
    status: 'under_review',
    createdAt: '2024-11-25T15:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
  },
  {
    id: 'prop-5',
    ownerId: 'owner-2',
    name: 'GRA Executive Flat',
    address: '34 Trans Amadi',
    city: 'Port Harcourt',
    state: 'Rivers',
    zipCode: '500001',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1100,
    monthlyRent: 600000,
    securityDeposit: 1200000,
    amenities: ['Security', 'Parking', 'Generator'],
    images: ['/properties/ph-1.jpg'],
    status: 'occupied',
    currentTenantId: 'tenant-3',
    createdAt: '2024-02-25T12:00:00Z',
    updatedAt: '2024-02-25T12:00:00Z',
  },
  {
    id: 'prop-6',
    ownerId: 'owner-2',
    name: 'Old GRA Bungalow',
    address: '78 Aba Road',
    city: 'Port Harcourt',
    state: 'Rivers',
    zipCode: '500001',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 1800,
    monthlyRent: 750000,
    securityDeposit: 1500000,
    amenities: ['Garden', 'Parking', 'Security'],
    images: ['/properties/ph-2.jpg'],
    status: 'occupied',
    currentTenantId: 'tenant-4',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
];

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    email: 'jane.okoro@example.com',
    firstName: 'Jane',
    lastName: 'Okoro',
    phone: '+234 802 345 6789',
    dateOfBirth: '1990-05-15',
    role: 'tenant',
    propertyId: 'prop-1',
    kycStatus: 'approved',
    leaseStatus: 'active',
    moveInDate: '2024-03-15T00:00:00Z',
    rentAmount: 850000,
    rentStatus: 'current',
    lastPaymentDate: '2024-12-01T10:30:00Z',
    nextPaymentDue: '2025-01-01T00:00:00Z',
    outstandingBalance: 0,
    createdAt: '2024-03-01T10:00:00Z',
    documents: [],
  },
  {
    id: 'tenant-2',
    email: 'david.nwosu@example.com',
    firstName: 'David',
    lastName: 'Nwosu',
    phone: '+234 806 789 0123',
    dateOfBirth: '1985-08-22',
    role: 'tenant',
    propertyId: 'prop-3',
    kycStatus: 'approved',
    leaseStatus: 'active',
    moveInDate: '2024-04-01T00:00:00Z',
    rentAmount: 1200000,
    rentStatus: 'overdue',
    lastPaymentDate: '2024-11-01T09:15:00Z',
    nextPaymentDue: '2024-12-01T00:00:00Z',
    outstandingBalance: 1200000,
    createdAt: '2024-03-20T14:00:00Z',
    documents: [],
  },
  {
    id: 'tenant-3',
    email: 'grace.ibe@example.com',
    firstName: 'Grace',
    lastName: 'Ibe',
    phone: '+234 803 234 5678',
    role: 'tenant',
    propertyId: 'prop-5',
    kycStatus: 'approved',
    leaseStatus: 'active',
    moveInDate: '2024-05-01T00:00:00Z',
    rentAmount: 600000,
    rentStatus: 'current',
    lastPaymentDate: '2024-12-02T11:00:00Z',
    nextPaymentDue: '2025-01-01T00:00:00Z',
    outstandingBalance: 0,
    createdAt: '2024-04-15T10:00:00Z',
    documents: [],
  },
  {
    id: 'tenant-4',
    email: 'peter.okafor@example.com',
    firstName: 'Peter',
    lastName: 'Okafor',
    phone: '+234 807 456 7890',
    role: 'tenant',
    propertyId: 'prop-6',
    kycStatus: 'approved',
    leaseStatus: 'active',
    moveInDate: '2024-06-01T00:00:00Z',
    rentAmount: 750000,
    rentStatus: 'current',
    lastPaymentDate: '2024-12-03T08:30:00Z',
    nextPaymentDue: '2025-01-01T00:00:00Z',
    outstandingBalance: 0,
    createdAt: '2024-05-20T09:00:00Z',
    documents: [],
  },
  {
    id: 'tenant-5',
    email: 'chioma.uzor@example.com',
    firstName: 'Chioma',
    lastName: 'Uzor',
    phone: '+234 805 678 9012',
    role: 'tenant',
    kycStatus: 'under_review',
    leaseStatus: 'draft',
    rentAmount: 0,
    rentStatus: 'current',
    outstandingBalance: 0,
    createdAt: '2024-12-08T15:30:00Z',
    documents: [
      {
        id: 'doc-1',
        tenantId: 'tenant-5',
        type: 'id_card',
        fileName: 'national_id.pdf',
        fileUrl: '/documents/national_id.pdf',
        uploadedAt: '2024-12-08T15:35:00Z',
        status: 'pending',
      },
      {
        id: 'doc-2',
        tenantId: 'tenant-5',
        type: 'employment_proof',
        fileName: 'employment_letter.pdf',
        fileUrl: '/documents/employment_letter.pdf',
        uploadedAt: '2024-12-08T15:37:00Z',
        status: 'pending',
      },
    ],
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    tenantId: 'tenant-1',
    propertyId: 'prop-1',
    ownerId: 'owner-1',
    amount: 850000,
    type: 'rent',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    transactionReference: 'TRX-2024120112345',
    dueDate: '2024-12-01T00:00:00Z',
    paidAt: '2024-12-01T10:30:00Z',
    description: 'December 2024 Rent',
    createdAt: '2024-11-25T00:00:00Z',
  },
  {
    id: 'pay-2',
    tenantId: 'tenant-3',
    propertyId: 'prop-5',
    ownerId: 'owner-2',
    amount: 600000,
    type: 'rent',
    status: 'completed',
    paymentMethod: 'card',
    transactionReference: 'TRX-2024120213456',
    dueDate: '2024-12-01T00:00:00Z',
    paidAt: '2024-12-02T11:00:00Z',
    description: 'December 2024 Rent',
    createdAt: '2024-11-25T00:00:00Z',
  },
  {
    id: 'pay-3',
    tenantId: 'tenant-4',
    propertyId: 'prop-6',
    ownerId: 'owner-2',
    amount: 750000,
    type: 'rent',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    transactionReference: 'TRX-2024120314567',
    dueDate: '2024-12-01T00:00:00Z',
    paidAt: '2024-12-03T08:30:00Z',
    description: 'December 2024 Rent',
    createdAt: '2024-11-25T00:00:00Z',
  },
  {
    id: 'pay-4',
    tenantId: 'tenant-2',
    propertyId: 'prop-3',
    ownerId: 'owner-1',
    amount: 1200000,
    type: 'rent',
    status: 'pending',
    paymentMethod: 'bank_transfer',
    dueDate: '2024-12-01T00:00:00Z',
    description: 'December 2024 Rent - OVERDUE',
    createdAt: '2024-11-25T00:00:00Z',
  },
];

// Mock Complaints
export const mockComplaints: Complaint[] = [
  {
    id: 'comp-1',
    tenantId: 'tenant-2',
    propertyId: 'prop-3',
    ownerId: 'owner-1',
    title: 'Water Heater Not Working',
    description: 'The water heater in the master bathroom has stopped working. No hot water for 3 days.',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    images: ['/complaints/heater-1.jpg'],
    assignedTo: 'admin-1',
    createdAt: '2024-12-08T09:00:00Z',
    updatedAt: '2024-12-09T14:00:00Z',
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2024-12-08T09:00:00Z',
        action: 'Complaint filed',
        performedBy: 'tenant-2',
      },
      {
        id: 'tl-2',
        timestamp: '2024-12-08T11:30:00Z',
        action: 'Assigned to admin',
        performedBy: 'system',
        notes: 'Auto-assigned based on priority',
      },
      {
        id: 'tl-3',
        timestamp: '2024-12-09T14:00:00Z',
        action: 'Plumber contacted',
        performedBy: 'admin-1',
        notes: 'Scheduled for tomorrow morning',
      },
    ],
  },
  {
    id: 'comp-2',
    tenantId: 'tenant-1',
    propertyId: 'prop-1',
    ownerId: 'owner-1',
    title: 'AC Making Strange Noise',
    description: 'The air conditioning unit has been making a loud grinding noise for the past week.',
    category: 'maintenance',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-12-10T16:00:00Z',
    updatedAt: '2024-12-10T16:00:00Z',
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2024-12-10T16:00:00Z',
        action: 'Complaint filed',
        performedBy: 'tenant-1',
      },
    ],
  },
  {
    id: 'comp-3',
    tenantId: 'tenant-3',
    propertyId: 'prop-5',
    ownerId: 'owner-2',
    title: 'Security Gate Malfunction',
    description: 'The automatic security gate is not closing properly.',
    category: 'security',
    priority: 'urgent',
    status: 'resolved',
    createdAt: '2024-11-28T10:00:00Z',
    updatedAt: '2024-11-29T15:30:00Z',
    resolvedAt: '2024-11-29T15:30:00Z',
    resolutionNotes: 'Gate motor replaced and tested successfully.',
    timeline: [
      {
        id: 'tl-5',
        timestamp: '2024-11-28T10:00:00Z',
        action: 'Complaint filed',
        performedBy: 'tenant-3',
      },
      {
        id: 'tl-6',
        timestamp: '2024-11-28T12:00:00Z',
        action: 'Marked as urgent',
        performedBy: 'admin-1',
      },
      {
        id: 'tl-7',
        timestamp: '2024-11-29T15:30:00Z',
        action: 'Resolved',
        performedBy: 'admin-1',
        notes: 'Gate motor replaced',
      },
    ],
  },
];

// Mock Lease Agreements
export const mockLeaseAgreements: LeaseAgreement[] = [
  {
    id: 'lease-1',
    tenantId: 'tenant-1',
    propertyId: 'prop-1',
    ownerId: 'owner-1',
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2025-03-14T00:00:00Z',
    monthlyRent: 850000,
    securityDeposit: 1700000,
    status: 'active',
    documentUrl: '/leases/lease-tenant-1.pdf',
    signedByTenant: true,
    signedByOwner: true,
    tenantSignedAt: '2024-03-10T14:00:00Z',
    ownerSignedAt: '2024-03-11T09:00:00Z',
    createdAt: '2024-03-08T10:00:00Z',
    terms: 'Standard 12-month residential lease agreement...',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalOwners: 3,
  totalProperties: 6,
  totalTenants: 4,
  vacantProperties: 1,
  occupancyRate: 83.3,
  totalMonthlyRevenue: 4050000,
  pendingKYC: 1,
  activeComplaints: 2,
  overduePayments: 1,
  recentActivity: [
    {
      id: 'act-1',
      type: 'complaint_filed',
      description: 'New complaint filed by Jane Okoro - AC Making Strange Noise',
      timestamp: '2024-12-10T16:00:00Z',
      relatedId: 'comp-2',
    },
    {
      id: 'act-2',
      type: 'payment_received',
      description: 'Payment received from Peter Okafor - ₦750,000',
      timestamp: '2024-12-03T08:30:00Z',
      relatedId: 'pay-3',
    },
    {
      id: 'act-3',
      type: 'payment_received',
      description: 'Payment received from Grace Ibe - ₦600,000',
      timestamp: '2024-12-02T11:00:00Z',
      relatedId: 'pay-2',
    },
    {
      id: 'act-4',
      type: 'payment_received',
      description: 'Payment received from Jane Okoro - ₦850,000',
      timestamp: '2024-12-01T10:30:00Z',
      relatedId: 'pay-1',
    },
    {
      id: 'act-5',
      type: 'tenant_applied',
      description: 'New KYC application from Chioma Uzor',
      timestamp: '2024-12-08T15:30:00Z',
      relatedId: 'tenant-5',
    },
  ],
};

// Hierarchical Data Helper
export function getOwnersWithProperties(): OwnerWithProperties[] {
  return mockPropertyOwners
    .filter(owner => owner.status === 'active')
    .map(owner => {
      const properties = mockProperties.filter(p => p.ownerId === owner.id);
      const propertiesWithTenants: PropertyWithTenant[] = properties.map(property => {
        const tenant = mockTenants.find(t => t.id === property.currentTenantId);
        const lease = mockLeaseAgreements.find(l => l.propertyId === property.id);
        const recentPayments = mockPayments.filter(p => p.propertyId === property.id).slice(0, 3);
        const activeComplaints = mockComplaints.filter(
          c => c.propertyId === property.id && c.status !== 'resolved' && c.status !== 'closed'
        );

        return {
          property,
          tenant,
          lease,
          recentPayments,
          activeComplaints,
        };
      });

      const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
      const vacantProperties = properties.filter(p => p.status === 'vacant').length;
      const totalMonthlyRent = properties.reduce((sum, p) => sum + p.monthlyRent, 0);
      const collectedThisMonth = mockPayments
        .filter(
          p =>
            p.ownerId === owner.id &&
            p.status === 'completed' &&
            new Date(p.paidAt || '').getMonth() === new Date().getMonth()
        )
        .reduce((sum, p) => sum + p.amount, 0);
      const overdueAmount = mockPayments
        .filter(p => p.ownerId === owner.id && p.status === 'pending' && new Date(p.dueDate) < new Date())
        .reduce((sum, p) => sum + p.amount, 0);
      const activeComplaints = mockComplaints.filter(
        c => c.ownerId === owner.id && c.status !== 'resolved' && c.status !== 'closed'
      ).length;

      return {
        owner,
        properties: propertiesWithTenants,
        stats: {
          totalProperties: properties.length,
          occupiedProperties,
          vacantProperties,
          totalMonthlyRent,
          collectedThisMonth,
          overdueAmount,
          activeComplaints,
        },
      };
    });
}

// Get pending KYC applications
export function getPendingKYCApplications(): Tenant[] {
  return mockTenants.filter(t => t.kycStatus === 'under_review' || t.kycStatus === 'pending');
}

// Get active complaints
export function getActiveComplaints(): Complaint[] {
  return mockComplaints.filter(c => c.status === 'open' || c.status === 'in_progress');
}

// Get overdue payments
export function getOverduePayments(): Payment[] {
  return mockPayments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date());
}
