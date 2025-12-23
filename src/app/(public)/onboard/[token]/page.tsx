'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Building2,
  CreditCard,
  Users,
  FileCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  Home,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { mockPropertyOwners } from '@/lib/data/adminMock';

// ============================================================================
// TYPES
// ============================================================================

type Step = 'personal' | 'bank' | 'properties' | 'tenants' | 'review';

interface ImageData {
  id: string;
  url: string;
  name: string;
}

interface UnitFormData {
  id: string;
  name: string;
  description: string;
  floor: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  monthlyRent: string;
  securityDeposit: string;
  allowLongTerm: boolean;
  allowShortlet: boolean;
  shortletDailyRate: string;
  shortletMinNights: string;
  shortletCleaningFee: string;
  images: ImageData[];
}

interface PropertyFormData {
  id: string;
  isMultiUnit: boolean;
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Single-unit fields
  bedrooms: string;
  bathrooms: string;
  area: string;
  monthlyRent: string;
  securityDeposit: string;
  allowLongTerm: boolean;
  allowShortlet: boolean;
  shortletDailyRate: string;
  shortletMinNights: string;
  shortletCleaningFee: string;
  unitDescription: string;
  unitImages: ImageData[];
  // Multi-unit fields
  units: UnitFormData[];
  amenities: string[];
  images: ImageData[];
  // Tenant assignment
  existingTenantEmail?: string;
}

interface TenantInvite {
  propertyId: string;
  unitId?: string;
  email: string;
  propertyName: string;
  unitName?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PROPERTY_TYPES = ['apartment', 'house', 'duplex', 'commercial', 'studio', 'penthouse'];
const COMMON_AMENITIES = [
  'Air Conditioning',
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  '24/7 Power',
  'Water Supply',
  'Garden',
  'Balcony',
  'Elevator',
  'Internet Ready',
  'Furnished',
];

const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank',
  'Ecobank',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank',
  'Guaranty Trust Bank',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OwnerOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  // Token validation state
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null>(null);

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    profilePhoto: null as ImageData | null,
    idDocument: null as ImageData | null,
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bvn: '',
  });

  const [properties, setProperties] = useState<PropertyFormData[]>([]);
  const [tenantInvites, setTenantInvites] = useState<TenantInvite[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Property modal state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyStep, setPropertyStep] = useState<'type' | 'details' | 'units' | 'amenities'>('type');

  // Unit modal state (for multi-unit properties)
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Current property form data
  const [propertyFormData, setPropertyFormData] = useState<PropertyFormData>(getEmptyProperty());

  // Current unit form data
  const [unitFormData, setUnitFormData] = useState<UnitFormData>(getEmptyUnit());

  // ============================================================================
  // HELPERS
  // ============================================================================

  function getEmptyProperty(): PropertyFormData {
    return {
      id: `prop-${Date.now()}`,
      isMultiUnit: false,
      name: '',
      description: '',
      type: 'apartment',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: '1',
      bathrooms: '1',
      area: '',
      monthlyRent: '',
      securityDeposit: '',
      allowLongTerm: true,
      allowShortlet: false,
      shortletDailyRate: '',
      shortletMinNights: '1',
      shortletCleaningFee: '',
      unitDescription: '',
      unitImages: [],
      units: [],
      amenities: [],
      images: [],
    };
  }

  function getEmptyUnit(): UnitFormData {
    return {
      id: `unit-${Date.now()}`,
      name: '',
      description: '',
      floor: '',
      bedrooms: '1',
      bathrooms: '1',
      area: '',
      monthlyRent: '',
      securityDeposit: '',
      allowLongTerm: true,
      allowShortlet: false,
      shortletDailyRate: '',
      shortletMinNights: '1',
      shortletCleaningFee: '',
      images: [],
    };
  }

  const formatCurrency = (amount: string) => {
    if (!amount) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  // ============================================================================
  // TOKEN VALIDATION
  // ============================================================================

  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);

      // Simulate API call to validate token
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in production, this would be an API call
      const owner = mockPropertyOwners.find(o => o.inviteToken === token);

      if (!owner) {
        setTokenError('This invitation link is invalid or has already been used.');
        setIsValidating(false);
        return;
      }

      // Check if expired (mock: check inviteExpiresAt)
      if (owner.inviteExpiresAt && new Date(owner.inviteExpiresAt) < new Date()) {
        setTokenError('This invitation link has expired. Please contact the administrator for a new invite.');
        setIsValidating(false);
        return;
      }

      // Check if already onboarded
      if (owner.onboardedAt) {
        setTokenError('You have already completed the onboarding process. Please log in to access your dashboard.');
        setIsValidating(false);
        return;
      }

      // Token is valid - populate form with owner data
      setOwnerData({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phone,
      });

      setPersonalInfo(prev => ({
        ...prev,
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phone,
      }));

      setIsValidating(false);
    };

    validateToken();
  }, [token]);

  // ============================================================================
  // STEP NAVIGATION
  // ============================================================================

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Profile', icon: User },
    { id: 'bank', label: 'Bank', icon: CreditCard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'review', label: 'Review', icon: FileCheck },
  ];

  const stepOrder: Step[] = ['personal', 'bank', 'properties', 'tenants', 'review'];

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return personalInfo.firstName && personalInfo.lastName && personalInfo.phone;
      case 'bank':
        return bankDetails.bankName && bankDetails.accountNumber && bankDetails.accountName;
      case 'properties':
        return true; // Optional
      case 'tenants':
        return true; // Optional
      case 'review':
        return termsAccepted;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      // Skip tenants step if no properties added
      if (currentStep === 'properties' && properties.length === 0) {
        setCurrentStep('review');
      } else {
        setCurrentStep(stepOrder[currentIndex + 1]);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      // Skip tenants step if no properties
      if (currentStep === 'review' && properties.length === 0) {
        setCurrentStep('properties');
      } else {
        setCurrentStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  // ============================================================================
  // IMAGE UPLOAD HANDLERS
  // ============================================================================

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is larger than 5MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPersonalInfo(prev => ({
      ...prev,
      profilePhoto: {
        id: `photo-${Date.now()}`,
        url,
        name: file.name,
      },
    }));
  };

  const handleIdDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File is larger than 10MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPersonalInfo(prev => ({
      ...prev,
      idDocument: {
        id: `doc-${Date.now()}`,
        url,
        name: file.name,
      },
    }));
  };

  const handlePropertyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 2;
    const currentCount = propertyFormData.images.length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      alert('Maximum 2 exterior images allowed');
      return;
    }

    const newImages: ImageData[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return;
      }
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        name: file.name,
      });
    });

    setPropertyFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleUnitImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isModal = false) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentImages = isModal ? unitFormData.images : propertyFormData.unitImages;
    const remainingSlots = maxImages - currentImages.length;

    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed per unit');
      return;
    }

    const newImages: ImageData[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return;
      }
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        name: file.name,
      });
    });

    if (isModal) {
      setUnitFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } else {
      setPropertyFormData(prev => ({
        ...prev,
        unitImages: [...prev.unitImages, ...newImages],
      }));
    }
  };

  // ============================================================================
  // PROPERTY MANAGEMENT
  // ============================================================================

  const openAddPropertyModal = () => {
    setEditingPropertyId(null);
    setPropertyFormData(getEmptyProperty());
    setPropertyStep('type');
    setShowPropertyModal(true);
  };

  const openEditPropertyModal = (property: PropertyFormData) => {
    setEditingPropertyId(property.id);
    setPropertyFormData({ ...property });
    setPropertyStep('type');
    setShowPropertyModal(true);
  };

  const saveProperty = () => {
    if (editingPropertyId) {
      setProperties(prev => prev.map(p => p.id === editingPropertyId ? propertyFormData : p));
    } else {
      setProperties(prev => [...prev, propertyFormData]);
    }
    setShowPropertyModal(false);
  };

  const removeProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    // Also remove any tenant invites for this property
    setTenantInvites(prev => prev.filter(t => t.propertyId !== propertyId));
  };

  // ============================================================================
  // UNIT MANAGEMENT
  // ============================================================================

  const openAddUnitModal = () => {
    setEditingUnitId(null);
    setUnitFormData(getEmptyUnit());
    setShowUnitModal(true);
  };

  const openEditUnitModal = (unit: UnitFormData) => {
    setEditingUnitId(unit.id);
    setUnitFormData({ ...unit });
    setShowUnitModal(true);
  };

  const saveUnit = () => {
    if (editingUnitId) {
      setPropertyFormData(prev => ({
        ...prev,
        units: prev.units.map(u => u.id === editingUnitId ? unitFormData : u),
      }));
    } else {
      setPropertyFormData(prev => ({
        ...prev,
        units: [...prev.units, unitFormData],
      }));
    }
    setShowUnitModal(false);
  };

  const removeUnit = (unitId: string) => {
    setPropertyFormData(prev => ({
      ...prev,
      units: prev.units.filter(u => u.id !== unitId),
    }));
  };

  // ============================================================================
  // TENANT INVITE MANAGEMENT
  // ============================================================================

  const updateTenantInvite = (propertyId: string, unitId: string | undefined, email: string, propertyName: string, unitName?: string) => {
    const key = unitId || propertyId;
    setTenantInvites(prev => {
      const existing = prev.findIndex(t => (t.unitId || t.propertyId) === key);
      if (email.trim() === '') {
        // Remove if empty
        if (existing >= 0) {
          return prev.filter((_, i) => i !== existing);
        }
        return prev;
      }
      if (existing >= 0) {
        // Update existing
        return prev.map((t, i) => i === existing ? { ...t, email } : t);
      }
      // Add new
      return [...prev, { propertyId, unitId, email, propertyName, unitName }];
    });
  };

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production: POST to API with all collected data
    console.log('Submitting onboarding data:', {
      personalInfo,
      bankDetails,
      properties,
      tenantInvites,
    });

    // Redirect to success page
    router.push('/onboard/success');
  };

  // ============================================================================
  // RENDER: ERROR STATE
  // ============================================================================

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-[#0B3D2C] rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN WIZARD
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#0B3D2C' }}>TruVade</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {personalInfo.firstName}!
          </h2>
          <p className="text-gray-600 mt-1">
            Complete your profile to start managing your properties
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const currentIndex = stepOrder.indexOf(currentStep);
              const stepIndex = stepOrder.indexOf(step.id);
              const isActive = step.id === currentStep;
              const isCompleted = stepIndex < currentIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      style={isActive ? { backgroundColor: '#0B3D2C' } : {}}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 'personal' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600">Tell us about yourself</p>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {personalInfo.profilePhoto ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={personalInfo.profilePhoto.url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                    <ImagePlus className="w-4 h-4 text-gray-600" />
                  </label>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Profile Photo</p>
                  <p className="text-sm text-gray-500">Optional. Max 5MB.</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={personalInfo.address}
                  onChange={e => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={personalInfo.state}
                    onChange={e => setPersonalInfo(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* ID Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Verification Document
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload a valid ID (National ID, Passport, Driver&apos;s License). Max 10MB.
                </p>
                {personalInfo.idDocument ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium flex-1">{personalInfo.idDocument.name}</span>
                    <button
                      onClick={() => setPersonalInfo(prev => ({ ...prev, idDocument: null }))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0B3D2C] hover:bg-green-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdDocumentUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-600">Click to upload document</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Bank Details */}
          {currentStep === 'bank' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                <p className="text-sm text-gray-600">
                  Where should we send your rental payments?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  <option value="">Select your bank</option>
                  {NIGERIAN_BANKS.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={e => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="10-digit account number"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankDetails.accountName}
                  onChange={e => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Name on the account"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BVN (Optional)
                </label>
                <input
                  type="text"
                  value={bankDetails.bvn}
                  onChange={e => setBankDetails(prev => ({ ...prev, bvn: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                  placeholder="11-digit BVN"
                  maxLength={11}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your BVN helps us verify your identity securely
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your bank details are securely stored and will be used to transfer rental payments directly to your account.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Properties */}
          {currentStep === 'properties' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Properties</h3>
                  <p className="text-sm text-gray-600">
                    Add properties you want to manage (you can add more later)
                  </p>
                </div>
                <button
                  onClick={openAddPropertyModal}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No properties added yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    This step is optional. You can add properties later.
                  </p>
                  <button
                    onClick={openAddPropertyModal}
                    className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Property
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map(property => (
                    <div
                      key={property.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            {property.isMultiUnit ? (
                              <Building2 className="w-5 h-5 text-gray-600" />
                            ) : (
                              <Home className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{property.name}</p>
                            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {property.isMultiUnit
                                ? `${property.units.length} units`
                                : `${property.bedrooms} bed, ${property.bathrooms} bath`}
                              {' • '}
                              {property.allowShortlet && property.allowLongTerm
                                ? 'Long-term & Shortlet'
                                : property.allowShortlet
                                ? 'Shortlet Only'
                                : 'Long-term Only'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditPropertyModal(property)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeProperty(property.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Tenant Invites */}
          {currentStep === 'tenants' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invite Existing Tenants</h3>
                <p className="text-sm text-gray-600">
                  Do any of your properties have existing tenants? Enter their email to invite them.
                </p>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No properties added. Skip this step.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map(property => (
                    <div key={property.id}>
                      {property.isMultiUnit ? (
                        // Multi-unit: show each unit
                        property.units.map(unit => (
                          <div
                            key={unit.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Home className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{unit.name}</p>
                                <p className="text-sm text-gray-500">{property.name}</p>
                              </div>
                            </div>
                            <input
                              type="email"
                              placeholder="Tenant's email address (optional)"
                              value={tenantInvites.find(t => t.unitId === unit.id)?.email || ''}
                              onChange={e => updateTenantInvite(property.id, unit.id, e.target.value, property.name, unit.name)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                        ))
                      ) : (
                        // Single-unit property
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <Home className="w-5 h-5 text-gray-400" />
                            <p className="font-medium text-gray-900">{property.name}</p>
                          </div>
                          <input
                            type="email"
                            placeholder="Tenant's email address (optional)"
                            value={tenantInvites.find(t => t.propertyId === property.id && !t.unitId)?.email || ''}
                            onChange={e => updateTenantInvite(property.id, undefined, e.target.value, property.name)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Tenants will receive an email invitation to join TruVade and complete their profile.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
                <p className="text-sm text-gray-600">
                  Please review everything before submitting
                </p>
              </div>

              {/* Personal Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Name:</p>
                  <p className="text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</p>
                  <p className="text-gray-500">Email:</p>
                  <p className="text-gray-900">{personalInfo.email}</p>
                  <p className="text-gray-500">Phone:</p>
                  <p className="text-gray-900">{personalInfo.phone}</p>
                  {personalInfo.address && (
                    <>
                      <p className="text-gray-500">Address:</p>
                      <p className="text-gray-900">{personalInfo.address}, {personalInfo.city}, {personalInfo.state}</p>
                    </>
                  )}
                  <p className="text-gray-500">ID Document:</p>
                  <p className={personalInfo.idDocument ? 'text-green-600' : 'text-gray-400'}>
                    {personalInfo.idDocument ? 'Uploaded' : 'Not uploaded'}
                  </p>
                </div>
              </div>

              {/* Bank Details Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bank Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Bank:</p>
                  <p className="text-gray-900">{bankDetails.bankName}</p>
                  <p className="text-gray-500">Account Number:</p>
                  <p className="text-gray-900">{bankDetails.accountNumber}</p>
                  <p className="text-gray-500">Account Name:</p>
                  <p className="text-gray-900">{bankDetails.accountName}</p>
                </div>
              </div>

              {/* Properties Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Properties ({properties.length})
                </h4>
                {properties.length === 0 ? (
                  <p className="text-sm text-gray-500">No properties added</p>
                ) : (
                  <div className="space-y-2">
                    {properties.map(property => (
                      <div key={property.id} className="text-sm">
                        <p className="text-gray-900 font-medium">{property.name}</p>
                        <p className="text-gray-500">
                          {property.address}, {property.city}
                          {property.isMultiUnit && ` • ${property.units.length} units`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tenant Invites Summary */}
              {tenantInvites.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Tenant Invitations ({tenantInvites.length})
                  </h4>
                  <div className="space-y-2 text-sm">
                    {tenantInvites.map((invite, i) => (
                      <div key={i}>
                        <p className="text-gray-900">{invite.email}</p>
                        <p className="text-gray-500 text-xs">
                          {invite.unitName ? `${invite.propertyName} - ${invite.unitName}` : invite.propertyName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#0B3D2C] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#0B3D2C] hover:underline">Privacy Policy</Link>.
                  I understand that TruVade will manage rent collection for my properties.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 'personal'}
              className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            {currentStep === 'review' ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center"
                style={{ backgroundColor: '#0B3D2C' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                style={{ backgroundColor: '#0B3D2C' }}
              >
                {currentStep === 'properties' && properties.length === 0 ? 'Skip' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Skip link */}
        {currentStep === 'properties' && (
          <p className="text-center mt-4 text-sm text-gray-500">
            You can add properties later from your dashboard
          </p>
        )}
      </div>

      {/* Add/Edit Property Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPropertyModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPropertyId ? 'Edit Property' : 'Add Property'}
              </h3>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Property Type Selection */}
              {propertyStep === 'type' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">What type of property is this?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPropertyFormData(prev => ({ ...prev, isMultiUnit: false, units: [] }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        !propertyFormData.isMultiUnit
                          ? 'border-[#0B3D2C] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Home className={`w-8 h-8 mb-2 ${!propertyFormData.isMultiUnit ? 'text-green-700' : 'text-gray-400'}`} />
                      <h4 className="font-semibold text-gray-900">Single Unit</h4>
                      <p className="text-sm text-gray-500">House, apartment, or standalone unit</p>
                    </button>

                    <button
                      onClick={() => setPropertyFormData(prev => ({ ...prev, isMultiUnit: true }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        propertyFormData.isMultiUnit
                          ? 'border-[#0B3D2C] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 mb-2 ${propertyFormData.isMultiUnit ? 'text-green-700' : 'text-gray-400'}`} />
                      <h4 className="font-semibold text-gray-900">Multi-Unit Building</h4>
                      <p className="text-sm text-gray-500">Apartment complex with multiple units</p>
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setPropertyStep('details')}
                      className="px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Property Details */}
              {propertyStep === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyFormData.name}
                      onChange={e => setPropertyFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={propertyFormData.isMultiUnit ? 'e.g., Skyline Apartments' : 'e.g., 3BR House in Lekki'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      value={propertyFormData.type}
                      onChange={e => setPropertyFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    >
                      {PROPERTY_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={propertyFormData.address}
                      onChange={e => setPropertyFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={propertyFormData.city}
                        onChange={e => setPropertyFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={propertyFormData.state}
                        onChange={e => setPropertyFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Exterior Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exterior Images (Max 2)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {propertyFormData.images.map(image => (
                        <div
                          key={image.id}
                          className="relative aspect-video rounded-lg border border-gray-200 overflow-hidden group"
                        >
                          <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPropertyFormData(prev => ({
                              ...prev,
                              images: prev.images.filter(i => i.id !== image.id),
                            }))}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {propertyFormData.images.length < 2 && (
                        <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0B3D2C] cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-green-50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePropertyImageUpload}
                            className="hidden"
                          />
                          <ImagePlus className="w-8 h-8 text-gray-400" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setPropertyStep('type')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setPropertyStep('units')}
                      disabled={!propertyFormData.name || !propertyFormData.address || !propertyFormData.city || !propertyFormData.state}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Units Step */}
              {propertyStep === 'units' && (
                <div className="space-y-4">
                  {propertyFormData.isMultiUnit ? (
                    // Multi-unit: Add units
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Add units to this property</p>
                        <button
                          onClick={openAddUnitModal}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                          style={{ backgroundColor: '#0B3D2C' }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Unit
                        </button>
                      </div>

                      {propertyFormData.units.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4">Add at least one unit</p>
                          <button
                            onClick={openAddUnitModal}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                            style={{ backgroundColor: '#0B3D2C' }}
                          >
                            <Plus className="w-4 h-4" />
                            Add First Unit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {propertyFormData.units.map(unit => (
                            <div
                              key={unit.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{unit.name}</p>
                                <p className="text-sm text-gray-500">
                                  {unit.bedrooms} bed, {unit.bathrooms} bath • {formatCurrency(unit.monthlyRent)}/mo
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditUnitModal(unit)}
                                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeUnit(unit.id)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Single-unit: Inline specs
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                          <input
                            type="number"
                            value={propertyFormData.bedrooms}
                            onChange={e => setPropertyFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                          <input
                            type="number"
                            value={propertyFormData.bathrooms}
                            onChange={e => setPropertyFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                          <input
                            type="number"
                            value={propertyFormData.area}
                            onChange={e => setPropertyFormData(prev => ({ ...prev, area: e.target.value }))}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Rental Mode */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Rental Mode</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={propertyFormData.allowLongTerm}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, allowLongTerm: e.target.checked }))}
                              className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                            />
                            <span className="text-sm text-gray-700">Long-term rental (monthly)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={propertyFormData.allowShortlet}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, allowShortlet: e.target.checked }))}
                              className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                            />
                            <span className="text-sm text-gray-700">Shortlet (daily/nightly)</span>
                          </label>
                        </div>
                      </div>

                      {/* Long-term Pricing */}
                      {propertyFormData.allowLongTerm && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₦)</label>
                            <input
                              type="number"
                              value={propertyFormData.monthlyRent}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₦)</label>
                            <input
                              type="number"
                              value={propertyFormData.securityDeposit}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}

                      {/* Shortlet Pricing */}
                      {propertyFormData.allowShortlet && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₦)</label>
                            <input
                              type="number"
                              value={propertyFormData.shortletDailyRate}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, shortletDailyRate: e.target.value }))}
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Nights</label>
                            <input
                              type="number"
                              value={propertyFormData.shortletMinNights}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, shortletMinNights: e.target.value }))}
                              min="1"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee (₦)</label>
                            <input
                              type="number"
                              value={propertyFormData.shortletCleaningFee}
                              onChange={e => setPropertyFormData(prev => ({ ...prev, shortletCleaningFee: e.target.value }))}
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setPropertyStep('details')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setPropertyStep('amenities')}
                      disabled={propertyFormData.isMultiUnit && propertyFormData.units.length === 0}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Amenities Step */}
              {propertyStep === 'amenities' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Select available amenities</p>

                  <div className="flex flex-wrap gap-2">
                    {COMMON_AMENITIES.map(amenity => {
                      const isSelected = propertyFormData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => setPropertyFormData(prev => ({
                            ...prev,
                            amenities: isSelected
                              ? prev.amenities.filter(a => a !== amenity)
                              : [...prev.amenities, amenity],
                          }))}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={isSelected ? { backgroundColor: '#0B3D2C' } : {}}
                        >
                          {isSelected && <span className="mr-1">✓</span>}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setPropertyStep('units')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={saveProperty}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      {editingPropertyId ? 'Update Property' : 'Add Property'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto py-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUnitModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingUnitId ? 'Edit Unit' : 'Add Unit'}
              </h4>
              <button
                onClick={() => setShowUnitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unitFormData.name}
                  onChange={e => setUnitFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Unit 2A, Flat 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={unitFormData.bedrooms}
                    onChange={e => setUnitFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={unitFormData.bathrooms}
                    onChange={e => setUnitFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                  <input
                    type="number"
                    value={unitFormData.area}
                    onChange={e => setUnitFormData(prev => ({ ...prev, area: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rental Mode */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Rental Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unitFormData.allowLongTerm}
                      onChange={e => setUnitFormData(prev => ({ ...prev, allowLongTerm: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                    />
                    <span className="text-sm text-gray-700">Long-term rental</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unitFormData.allowShortlet}
                      onChange={e => setUnitFormData(prev => ({ ...prev, allowShortlet: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                    />
                    <span className="text-sm text-gray-700">Shortlet</span>
                  </label>
                </div>
              </div>

              {/* Long-term Pricing */}
              {unitFormData.allowLongTerm && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₦)</label>
                    <input
                      type="number"
                      value={unitFormData.monthlyRent}
                      onChange={e => setUnitFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₦)</label>
                    <input
                      type="number"
                      value={unitFormData.securityDeposit}
                      onChange={e => setUnitFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Shortlet Pricing */}
              {unitFormData.allowShortlet && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₦)</label>
                    <input
                      type="number"
                      value={unitFormData.shortletDailyRate}
                      onChange={e => setUnitFormData(prev => ({ ...prev, shortletDailyRate: e.target.value }))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Nights</label>
                    <input
                      type="number"
                      value={unitFormData.shortletMinNights}
                      onChange={e => setUnitFormData(prev => ({ ...prev, shortletMinNights: e.target.value }))}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee</label>
                    <input
                      type="number"
                      value={unitFormData.shortletCleaningFee}
                      onChange={e => setUnitFormData(prev => ({ ...prev, shortletCleaningFee: e.target.value }))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUnitModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUnit}
                  disabled={!unitFormData.name || (!unitFormData.allowLongTerm && !unitFormData.allowShortlet)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  {editingUnitId ? 'Update Unit' : 'Add Unit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
