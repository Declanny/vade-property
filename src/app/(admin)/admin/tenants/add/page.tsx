'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Building2,
  FileText,
  Home,
  Search,
  X,
  CheckCircle,
} from 'lucide-react';
import { mockPropertyOwners, mockProperties, getPropertyTotalRent, isMultiUnitProperty, getUnitById } from '@/lib/data/adminMock';
import type { Unit } from '@/lib/types/admin';

type Step = 1 | 2 | 3;

interface TenantFormData {
  ownerId: string;
  propertyId: string;
  unitId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  moveInDate: string;
  rentAmount: number;
  leaseStartDate: string;
  leaseEndDate: string;
  securityDeposit: number;
  skipKyc: boolean;
  notes: string;
}

export default function AddTenantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOwnerId = searchParams.get('ownerId');
  const preselectedPropertyId = searchParams.get('propertyId');
  const preselectedUnitId = searchParams.get('unitId');

  // Determine initial step based on preselected values
  const getInitialStep = (): Step => {
    if (preselectedPropertyId) return 3; // Go straight to tenant details
    if (preselectedOwnerId) return 2; // Go to property selection
    return 1; // Start from owner selection
  };

  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep());
  const [ownerSearch, setOwnerSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>({
    ownerId: preselectedOwnerId || '',
    propertyId: preselectedPropertyId || '',
    unitId: preselectedUnitId || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    moveInDate: '',
    rentAmount: 0,
    leaseStartDate: '',
    leaseEndDate: '',
    securityDeposit: 0,
    skipKyc: false,
    notes: '',
  });

  const activeOwners = mockPropertyOwners.filter((o) => o.status === 'active');

  // Filter owners by search term
  const filteredOwners = activeOwners.filter((owner) => {
    if (!ownerSearch.trim()) return true;
    const searchLower = ownerSearch.toLowerCase();
    return (
      owner.firstName.toLowerCase().includes(searchLower) ||
      owner.lastName.toLowerCase().includes(searchLower) ||
      owner.email.toLowerCase().includes(searchLower) ||
      owner.phone.includes(ownerSearch)
    );
  });

  const ownerProperties = formData.ownerId
    ? mockProperties.filter((p) => p.ownerId === formData.ownerId)
    : [];

  // Filter properties by search term
  const filteredProperties = ownerProperties.filter((property) => {
    if (!propertySearch.trim()) return true;
    const searchLower = propertySearch.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.city.toLowerCase().includes(searchLower)
    );
  });

  const availableProperties = filteredProperties.filter(
    (p) => p.status === 'vacant' || p.status === 'under_review'
  );
  const selectedOwner = mockPropertyOwners.find((o) => o.id === formData.ownerId);
  const selectedProperty = mockProperties.find((p) => p.id === formData.propertyId);
  const selectedUnit = formData.unitId ? getUnitById(formData.unitId) : undefined;

  // Check if property needs unit selection
  const propertyNeedsUnit = selectedProperty && isMultiUnitProperty(selectedProperty);

  // Get available units for the selected property
  const availableUnits: Unit[] = propertyNeedsUnit && selectedProperty?.units
    ? selectedProperty.units.filter((u) => u.status === 'vacant' || u.status === 'reserved')
    : [];

  // Auto-fill rent amount when property or unit is selected
  useEffect(() => {
    if (selectedUnit) {
      // Use unit's rent for multi-unit properties
      setFormData((prev) => ({
        ...prev,
        rentAmount: selectedUnit.monthlyRent,
        securityDeposit: selectedUnit.securityDeposit ?? 0,
      }));
    } else if (selectedProperty && !propertyNeedsUnit) {
      // Use property's rent for single-unit properties
      setFormData((prev) => ({
        ...prev,
        rentAmount: getPropertyTotalRent(selectedProperty),
        securityDeposit: selectedProperty.securityDeposit ?? 0,
      }));
    }
  }, [selectedProperty, selectedUnit, propertyNeedsUnit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const canProceedToStep2 = formData.ownerId !== '';
  // For multi-unit properties, require unit selection; for single-unit, just property
  const canProceedToStep3 = formData.propertyId !== '' &&
    (!propertyNeedsUnit || formData.unitId !== '');
  const canSubmit =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.moveInDate !== '' &&
    formData.rentAmount > 0;

  const handleSubmit = () => {
    // In a real app, this would make an API call to create the tenant
    console.log('Creating tenant:', formData);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push('/admin/tenants');
  };

  const steps = [
    { number: 1, label: 'Select Owner', icon: User },
    { number: 2, label: 'Select Property', icon: Building2 },
    { number: 3, label: 'Tenant Details', icon: FileText },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/tenants"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tenants
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Tenant</h1>
        <p className="text-gray-600 mt-1">Add an existing tenant to a property</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={isActive && !isCompleted ? { backgroundColor: '#0B3D2C' } : {}}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`ml-3 font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Select Owner */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Select Property Owner</h2>
            <p className="text-gray-600">Choose the owner whose property the tenant will occupy.</p>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>

            {filteredOwners.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No owners found matching &quot;{ownerSearch}&quot;</p>
                <button
                  onClick={() => setOwnerSearch('')}
                  className="text-sm text-[#0B3D2C] hover:underline mt-2"
                >
                  Clear search
                </button>
              </div>
            ) : (
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {filteredOwners.map((owner) => {
                const isSelected = formData.ownerId === owner.id;
                const ownerPropertyCount = mockProperties.filter((p) => p.ownerId === owner.id).length;
                const vacantCount = mockProperties.filter(
                  (p) => p.ownerId === owner.id && (p.status === 'vacant' || p.status === 'under_review')
                ).length;

                return (
                  <div
                    key={owner.id}
                    onClick={() => setFormData((prev) => ({ ...prev, ownerId: owner.id, propertyId: '' }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0B3D2C] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: '#0B3D2C' }}
                        >
                          {owner.firstName[0]}
                          {owner.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {owner.firstName} {owner.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{owner.email}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-gray-900 font-medium">{ownerPropertyCount} properties</p>
                        <p className={vacantCount > 0 ? 'text-green-600' : 'text-gray-500'}>
                          {vacantCount} available
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* Step 2: Select Property & Unit */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {propertyNeedsUnit && formData.propertyId ? 'Select Unit' : 'Select Property'}
                </h2>
                <p className="text-gray-600">
                  {propertyNeedsUnit && formData.propertyId
                    ? `Choose a unit from ${selectedProperty?.name}`
                    : `Choose from ${selectedOwner?.firstName} ${selectedOwner?.lastName}'s properties.`}
                </p>
              </div>
              <button
                onClick={() => {
                  if (propertyNeedsUnit && formData.propertyId) {
                    // Go back to property selection
                    setFormData((prev) => ({ ...prev, propertyId: '', unitId: '' }));
                  } else {
                    setCurrentStep(1);
                  }
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {propertyNeedsUnit && formData.propertyId ? 'Change property' : 'Change owner'}
              </button>
            </div>

            {/* Unit Selection (for multi-unit properties) */}
            {propertyNeedsUnit && formData.propertyId ? (
              <div className="space-y-4">
                {/* Selected Property Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedProperty?.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedProperty?.address}, {selectedProperty?.city}
                      </p>
                    </div>
                  </div>
                </div>

                {availableUnits.length > 0 ? (
                  <div className="grid gap-4 max-h-80 overflow-y-auto">
                    {availableUnits.map((unit) => {
                      const isSelected = formData.unitId === unit.id;

                      return (
                        <div
                          key={unit.id}
                          onClick={() => setFormData((prev) => ({ ...prev, unitId: unit.id }))}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#0B3D2C] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gray-100 rounded-lg">
                                <Home className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{unit.name}</p>
                                {unit.floor && (
                                  <p className="text-sm text-gray-500">Floor {unit.floor}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                  {unit.bedrooms} bed, {unit.bathrooms} bath, {unit.area} sqft
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                unit.status === 'vacant'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {unit.status === 'vacant' ? 'Vacant' : 'Reserved'}
                              </span>
                              <p className="text-lg font-semibold text-gray-900 mt-2">
                                {formatCurrency(unit.monthlyRent)}/mo
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No vacant units available in this property.</p>
                    <p className="text-sm text-gray-500 mt-1">All units are currently occupied.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Search Input for Properties */}
                {ownerProperties.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      placeholder="Search by property name, address, or city..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                )}

                {filteredProperties.length === 0 && propertySearch ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No properties found matching &quot;{propertySearch}&quot;</p>
                    <button
                      onClick={() => setPropertySearch('')}
                      className="text-sm text-[#0B3D2C] hover:underline mt-2"
                    >
                      Clear search
                    </button>
                  </div>
                ) : availableProperties.length > 0 || filteredProperties.some((p) => isMultiUnitProperty(p)) ? (
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {filteredProperties.map((property) => {
                      const isMultiUnit = isMultiUnitProperty(property);
                      const hasVacantUnits = isMultiUnit && property.units?.some(
                        (u) => u.status === 'vacant' || u.status === 'reserved'
                      );
                      const isAvailable = property.status === 'vacant' || property.status === 'under_review' || hasVacantUnits;
                      const isSelected = formData.propertyId === property.id;

                      return (
                        <div
                          key={property.id}
                          onClick={() => isAvailable && setFormData((prev) => ({
                            ...prev,
                            propertyId: property.id,
                            unitId: '', // Clear unit selection
                          }))}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            isAvailable
                              ? isSelected
                                ? 'border-[#0B3D2C] bg-green-50 cursor-pointer'
                                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                              : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gray-100 rounded-lg">
                                {isMultiUnit ? (
                                  <Building2 className="w-6 h-6 text-gray-600" />
                                ) : (
                                  <Home className="w-6 h-6 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">{property.name}</p>
                                  {isMultiUnit && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      {property.units?.length} units
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {property.address}, {property.city}
                                </p>
                                {!isMultiUnit && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {property.bedrooms} bed, {property.bathrooms} bath, {property.area} sqft
                                  </p>
                                )}
                                {isMultiUnit && hasVacantUnits && (
                                  <p className="text-sm text-green-600 mt-1">
                                    {property.units?.filter((u) => u.status === 'vacant').length} vacant units
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isAvailable
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {isAvailable ? 'Available' : 'Occupied'}
                              </span>
                              <p className="text-lg font-semibold text-gray-900 mt-2">
                                {formatCurrency(getPropertyTotalRent(property))}/mo
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">This owner has no available properties.</p>
                    <p className="text-sm text-gray-500 mt-1">
                      All properties are currently occupied or you need to add properties first.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Tenant Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tenant Details</h2>
                <p className="text-gray-600">
                  Adding tenant to: <strong>
                    {selectedUnit
                      ? `${selectedProperty?.name} - ${selectedUnit.name}`
                      : selectedProperty?.name}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Change {selectedUnit ? 'unit' : 'property'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="tenant@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              {/* Lease Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Lease Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Move-in Date *
                  </label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, moveInDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (NGN) *
                  </label>
                  <input
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rentAmount: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="850000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit (NGN)
                  </label>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityDeposit: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    placeholder="1700000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, leaseEndDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* KYC Option */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Skip KYC Verification</h4>
                  <p className="text-sm text-gray-600">
                    Enable this for existing tenants who are already verified by the property owner.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skipKyc}
                    onChange={(e) => setFormData((prev) => ({ ...prev, skipKyc: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                placeholder="Any additional notes about this tenant..."
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev))}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev < 3 ? (prev + 1) as Step : prev))}
              disabled={
                (currentStep === 1 && !canProceedToStep2) ||
                (currentStep === 2 && !canProceedToStep3)
              }
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                (currentStep === 1 && !canProceedToStep2) ||
                (currentStep === 2 && !canProceedToStep3)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
              style={
                !((currentStep === 1 && !canProceedToStep2) || (currentStep === 2 && !canProceedToStep3))
                  ? { backgroundColor: '#0B3D2C' }
                  : {}
              }
            >
              Next
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                !canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={canSubmit ? { backgroundColor: '#0B3D2C' } : {}}
            >
              <Check className="w-4 h-4 inline mr-2" />
              Add Tenant
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Tenant Added Successfully!
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              <strong>{formData.firstName} {formData.lastName}</strong> has been added to{' '}
              <strong>
                {selectedUnit
                  ? `${selectedProperty?.name} - ${selectedUnit.name}`
                  : selectedProperty?.name}
              </strong>.
            </p>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Owner</span>
                <span className="font-medium text-gray-900">
                  {selectedOwner?.firstName} {selectedOwner?.lastName}
                </span>
              </div>
              {selectedUnit && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit</span>
                  <span className="font-medium text-gray-900">{selectedUnit.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-medium text-gray-900">{formatCurrency(formData.rentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Move-in Date</span>
                <span className="font-medium text-gray-900">
                  {formData.moveInDate ? new Date(formData.moveInDate).toLocaleDateString('en-NG') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KYC Status</span>
                <span className={`font-medium ${formData.skipKyc ? 'text-green-600' : 'text-yellow-600'}`}>
                  {formData.skipKyc ? 'Pre-verified' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/admin/tenants/${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}`);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Tenant
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0B3D2C' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
