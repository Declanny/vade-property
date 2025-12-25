'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  DollarSign,
  Check,
  Search,
  User,
  ImagePlus,
  X,
  Home,
  Eye,
  Camera,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { mockPropertyOwners } from '@/lib/data/adminMock';

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
  'Laundry Room',
  'Storage',
  'CCTV',
];

type Step = 'owner' | 'type' | 'building' | 'units' | 'amenities' | 'review';

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
  images: ImageData[];
  // Rental mode
  allowLongTerm: boolean;
  allowShortlet: boolean;
  // Shortlet pricing
  shortletDailyRate: string;
  shortletMinNights: string;
  shortletCleaningFee: string;
}

interface ImageData {
  id: string;
  url: string;
  name: string;
}

export default function AddPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOwnerId = searchParams.get('ownerId');

  const [currentStep, setCurrentStep] = useState<Step>('owner');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Bulk unit creation state
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(2);
  const [namePrefix, setNamePrefix] = useState('Unit');
  const [startingNumber, setStartingNumber] = useState(1);
  const [useSamePrice, setUseSamePrice] = useState(true);
  const [bulkPricing, setBulkPricing] = useState<{
    unitName: string;
    monthlyRent: string;
    securityDeposit: string;
  }[]>([]);

  const [unitFormData, setUnitFormData] = useState<UnitFormData>({
    id: '',
    name: '',
    description: '',
    floor: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    monthlyRent: '',
    securityDeposit: '',
    images: [],
    allowLongTerm: true,
    allowShortlet: false,
    shortletDailyRate: '',
    shortletMinNights: '1',
    shortletCleaningFee: '',
  });

  const [formData, setFormData] = useState({
    ownerId: preselectedOwnerId || '',
    isMultiUnit: false,
    name: '',
    description: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // Single-unit fields
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    monthlyRent: '',
    securityDeposit: '',
    unitDescription: '', // Description for the unit (public listing)
    unitImages: [] as ImageData[], // Images for single-unit (public listing)
    // Rental mode (for single-unit)
    allowLongTerm: true,
    allowShortlet: false,
    // Shortlet pricing (for single-unit)
    shortletDailyRate: '',
    shortletMinNights: '1',
    shortletCleaningFee: '',
    // Multi-unit fields
    units: [] as UnitFormData[],
    amenities: [] as string[],
    images: [] as ImageData[], // Building exterior images (1-2)
  });

  const getSteps = (): { id: Step; label: string; icon: React.ElementType }[] => [
    { id: 'owner', label: 'Select Owner', icon: User },
    { id: 'type', label: 'Property Type', icon: Building2 },
    { id: 'building', label: 'Building Details', icon: MapPin },
    { id: 'units', label: formData.isMultiUnit ? 'Add Units' : 'Unit Details', icon: Home },
    { id: 'amenities', label: 'Amenities', icon: Check },
    { id: 'review', label: 'Review', icon: Eye },
  ];

  const steps = getSteps();
  const stepOrder: Step[] = ['owner', 'type', 'building', 'units', 'amenities', 'review'];

  const activeOwners = mockPropertyOwners.filter((o) => o.status === 'active');

  const filteredOwners = activeOwners.filter((owner) => {
    if (!ownerSearch.trim()) return true;
    const searchLower = ownerSearch.toLowerCase();
    return (
      owner.firstName.toLowerCase().includes(searchLower) ||
      owner.lastName.toLowerCase().includes(searchLower) ||
      owner.email.toLowerCase().includes(searchLower)
    );
  });

  const selectedOwner = mockPropertyOwners.find((o) => o.id === formData.ownerId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 2; // Building exterior images limited to 2
    const currentCount = formData.images.length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      alert('Maximum 2 exterior images allowed');
      return;
    }

    const newImages: ImageData[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        alert(`${file.name} is not a PNG or JPG file`);
        return;
      }
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        name: file.name,
      });
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  // Single-unit image upload (for unit listing)
  const handleUnitImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isModal = false) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentImages = isModal ? unitFormData.images : formData.unitImages;
    const currentCount = currentImages.length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed per unit');
      return;
    }

    const newImages: ImageData[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        alert(`${file.name} is not a PNG or JPG file`);
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
      setUnitFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        unitImages: [...prev.unitImages, ...newImages],
      }));
    }
  };

  const removeUnitImage = (imageId: string, isModal = false) => {
    if (isModal) {
      setUnitFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        unitImages: prev.unitImages.filter((img) => img.id !== imageId),
      }));
    }
  };

  // Unit management
  const openAddUnitModal = () => {
    setEditingUnitId(null);
    setUnitFormData({
      id: `unit-${Date.now()}`,
      name: '',
      description: '',
      floor: '',
      bedrooms: '1',
      bathrooms: '1',
      area: '',
      monthlyRent: '',
      securityDeposit: '',
      images: [],
      allowLongTerm: true,
      allowShortlet: false,
      shortletDailyRate: '',
      shortletMinNights: '1',
      shortletCleaningFee: '',
    });
    // Reset bulk mode state
    setBulkMode(false);
    setBulkCount(2);
    setNamePrefix('Unit');
    setStartingNumber(1);
    setUseSamePrice(true);
    setBulkPricing([]);
    setShowUnitModal(true);
  };

  const openEditUnitModal = (unit: UnitFormData) => {
    setEditingUnitId(unit.id);
    setUnitFormData({ ...unit });
    setShowUnitModal(true);
  };

  const saveUnit = () => {
    if (editingUnitId) {
      // Update existing unit
      setFormData((prev) => ({
        ...prev,
        units: prev.units.map((u) => (u.id === editingUnitId ? unitFormData : u)),
      }));
    } else {
      // Add new unit
      setFormData((prev) => ({
        ...prev,
        units: [...prev.units, unitFormData],
      }));
    }
    setShowUnitModal(false);
  };

  const removeUnit = (unitId: string) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.filter((u) => u.id !== unitId),
    }));
  };

  // Bulk unit helpers
  const generateUnitNames = (count: number, prefix: string, start: number) => {
    return Array.from({ length: count }, (_, i) => `${prefix} ${start + i}`);
  };

  const initBulkPricing = (count: number, prefix: string, start: number) => {
    const names = generateUnitNames(count, prefix, start);
    setBulkPricing(names.map(name => ({
      unitName: name,
      monthlyRent: unitFormData.monthlyRent || '',
      securityDeposit: unitFormData.securityDeposit || '',
    })));
  };

  const saveBulkUnits = () => {
    const names = generateUnitNames(bulkCount, namePrefix || 'Unit', startingNumber);
    const newUnits: UnitFormData[] = names.map((name, i) => ({
      id: `unit-${Date.now()}-${i}`,
      name,
      description: '',
      floor: '',
      bedrooms: unitFormData.bedrooms,
      bathrooms: unitFormData.bathrooms,
      area: unitFormData.area,
      monthlyRent: useSamePrice
        ? unitFormData.monthlyRent
        : bulkPricing[i]?.monthlyRent || unitFormData.monthlyRent,
      securityDeposit: useSamePrice
        ? unitFormData.securityDeposit
        : bulkPricing[i]?.securityDeposit || unitFormData.securityDeposit,
      images: [],
      allowLongTerm: unitFormData.allowLongTerm,
      allowShortlet: unitFormData.allowShortlet,
      shortletDailyRate: unitFormData.shortletDailyRate,
      shortletMinNights: unitFormData.shortletMinNights,
      shortletCleaningFee: unitFormData.shortletCleaningFee,
    }));

    setFormData((prev) => ({
      ...prev,
      units: [...prev.units, ...newUnits],
    }));

    // Reset and close
    setBulkMode(false);
    setShowUnitModal(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'owner':
        return !!formData.ownerId;
      case 'type':
        return true; // Always can proceed, default is single unit
      case 'building':
        return formData.name && formData.address && formData.city && formData.state;
      case 'units':
        if (formData.isMultiUnit) {
          // Multi-unit needs at least 1 unit with valid data
          return formData.units.length >= 1 && formData.units.every(
            (u) =>
              u.name &&
              u.bedrooms &&
              u.bathrooms &&
              u.area &&
              (u.allowLongTerm || u.allowShortlet) &&
              (!u.allowLongTerm || (u.monthlyRent && u.securityDeposit)) &&
              (!u.allowShortlet || u.shortletDailyRate)
          );
        } else {
          // Single unit needs specs and at least one rental mode
          const hasRentalMode = formData.allowLongTerm || formData.allowShortlet;
          const longTermValid = !formData.allowLongTerm || (formData.monthlyRent && formData.securityDeposit);
          const shortletValid = !formData.allowShortlet || formData.shortletDailyRate;
          return formData.bedrooms && formData.bathrooms && formData.area && hasRentalMode && longTermValid && shortletValid;
        }
      case 'amenities':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  const getTotalMonthlyRent = () => {
    if (formData.isMultiUnit) {
      return formData.units.reduce((sum, u) => sum + parseInt(u.monthlyRent || '0'), 0);
    }
    return parseInt(formData.monthlyRent || '0');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // Auto-select owner if preselected
  useEffect(() => {
    if (preselectedOwnerId) {
      setCurrentStep('type');
    }
  }, [preselectedOwnerId]);

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Added Successfully!</h2>
          <p className="text-gray-600 mb-2">
            {formData.name} has been created and assigned to {selectedOwner?.firstName} {selectedOwner?.lastName}.
          </p>
          {formData.isMultiUnit && (
            <p className="text-sm text-gray-500 mb-6">
              {formData.units.length} units added with total monthly rent of {formatCurrency(getTotalMonthlyRent().toString())}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="/admin/properties"
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              View All Properties
            </Link>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  ownerId: '',
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
                  unitDescription: '',
                  unitImages: [],
                  allowLongTerm: true,
                  allowShortlet: false,
                  shortletDailyRate: '',
                  shortletMinNights: '1',
                  shortletCleaningFee: '',
                  units: [],
                  amenities: [],
                  images: [],
                });
                setCurrentStep('owner');
              }}
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Add Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/properties"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">Create a new property listing</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Select Owner */}
        {currentStep === 'owner' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Property Owner</h2>
            <p className="text-sm text-gray-600">Choose which owner this property belongs to</p>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                placeholder="Search owners by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>

            {/* Owner List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredOwners.map((owner) => (
                <button
                  key={owner.id}
                  onClick={() => setFormData((prev) => ({ ...prev, ownerId: owner.id }))}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    formData.ownerId === owner.id
                      ? 'border-[#0B3D2C] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      {owner.firstName[0]}{owner.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {owner.firstName} {owner.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{owner.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {owner.propertiesCount} properties
                    </div>
                    {formData.ownerId === owner.id && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
              {filteredOwners.length === 0 && (
                <p className="text-center text-gray-500 py-8">No owners found matching your search</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Property Type */}
        {currentStep === 'type' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Property Type</h2>
              <p className="text-sm text-gray-600">
                Adding property for: <strong>{selectedOwner?.firstName} {selectedOwner?.lastName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Unit Card */}
              <button
                onClick={() => setFormData((prev) => ({ ...prev, isMultiUnit: false, units: [] }))}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  !formData.isMultiUnit
                    ? 'border-[#0B3D2C] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-xl ${!formData.isMultiUnit ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <Home className={`w-8 h-8 ${!formData.isMultiUnit ? 'text-green-700' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Single Unit Property</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      A standalone house or apartment with one rentable unit
                    </p>
                    <p className="text-xs text-gray-500">
                      Examples: House, Villa, Studio, Single Apartment
                    </p>
                  </div>
                  {!formData.isMultiUnit && (
                    <Check className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>

              {/* Multi Unit Card */}
              <button
                onClick={() => setFormData((prev) => ({ ...prev, isMultiUnit: true }))}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  formData.isMultiUnit
                    ? 'border-[#0B3D2C] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-xl ${formData.isMultiUnit ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <Building2 className={`w-8 h-8 ${formData.isMultiUnit ? 'text-green-700' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Multi-Unit Building</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      A building with multiple rentable units
                    </p>
                    <p className="text-xs text-gray-500">
                      Examples: Apartment Complex, Duplex, Office Building
                    </p>
                  </div>
                  {formData.isMultiUnit && (
                    <Check className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Building Details */}
        {currentStep === 'building' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {formData.isMultiUnit ? 'Building Details' : 'Property Details'}
            </h2>
            <p className="text-sm text-gray-600">
              {formData.isMultiUnit
                ? 'Enter information about the building (shared by all units)'
                : 'Enter basic property information'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.isMultiUnit ? 'Building Name' : 'Property Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={formData.isMultiUnit ? 'e.g., Skyline Apartments' : 'e.g., Luxury 3BR House in Lekki'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the property..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              {/* Building Exterior Images Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.isMultiUnit ? 'Building Exterior Images' : 'Property Exterior Images'}
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  (Max. 2 images) PNG, JPG (5mb max.)
                  {formData.isMultiUnit
                    ? ' - Exterior/entrance photos for the building. Each unit will have its own interior images.'
                    : ' - Add exterior photos here. You\'ll add unit interior images in the next step.'}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {formData.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {Array.from({ length: Math.max(0, 2 - formData.images.length) }).map((_, index) => (
                    <label
                      key={`upload-${index}`}
                      className="aspect-square rounded-lg border border-dashed border-gray-300 hover:border-[#0B3D2C] cursor-pointer flex items-center justify-center transition-colors bg-gray-50 hover:bg-green-50"
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <ImagePlus className="w-8 h-8 text-[#0B3D2C]" />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Units */}
        {currentStep === 'units' && (
          <div className="space-y-4">
            {formData.isMultiUnit ? (
              // Multi-unit: Add units
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Add Units</h2>
                    <p className="text-sm text-gray-600">
                      Add the individual units for {formData.name}
                    </p>
                  </div>
                  <button
                    onClick={openAddUnitModal}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </button>
                </div>

                {formData.units.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No units added yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Add at least one unit to this property
                    </p>
                    <button
                      onClick={openAddUnitModal}
                      className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#0B3D2C' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add First Unit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.units.map((unit, index) => (
                      <div
                        key={unit.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{unit.name || `Unit ${index + 1}`}</p>
                            <p className="text-sm text-gray-500">
                              {unit.bedrooms} bed, {unit.bathrooms} bath, {unit.area} sqft
                              {unit.floor && ` • Floor ${unit.floor}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(unit.monthlyRent)}/mo</p>
                            <p className="text-xs text-gray-500">Deposit: {formatCurrency(unit.securityDeposit)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditUnitModal(unit)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeUnit(unit.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Units: {formData.units.length}</span>
                        <span className="font-bold text-lg" style={{ color: '#0B3D2C' }}>
                          Total: {formatCurrency(getTotalMonthlyRent().toString())}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Single-unit: Unit details inline
              <>
                <h2 className="text-lg font-semibold text-gray-900">Unit Details</h2>
                <p className="text-sm text-gray-600">Enter the specifications and pricing for this property</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sqft) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rental Mode Toggle */}
                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Rental Mode</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowLongTerm}
                        onChange={(e) => setFormData((prev) => ({ ...prev, allowLongTerm: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Long-term Rental</span>
                        <p className="text-xs text-gray-500">Monthly rent with lease agreement</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowShortlet}
                        onChange={(e) => setFormData((prev) => ({ ...prev, allowShortlet: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Shortlet</span>
                        <p className="text-xs text-gray-500">Daily/nightly bookings for short stays</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Long-term Pricing */}
                {formData.allowLongTerm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="monthlyRent"
                        value={formData.monthlyRent}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 500000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                      {formData.monthlyRent && (
                        <p className="text-sm text-gray-500 mt-1">{formatCurrency(formData.monthlyRent)} per month</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security Deposit (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 500000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                      {formData.securityDeposit && (
                        <p className="text-sm text-gray-500 mt-1">{formatCurrency(formData.securityDeposit)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Shortlet Pricing */}
                {formData.allowShortlet && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <h3 className="font-medium text-amber-900 mb-3">Shortlet Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Daily Rate (₦) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.shortletDailyRate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, shortletDailyRate: e.target.value }))}
                          min="0"
                          placeholder="e.g., 35000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min. Nights
                        </label>
                        <input
                          type="number"
                          value={formData.shortletMinNights}
                          onChange={(e) => setFormData((prev) => ({ ...prev, shortletMinNights: e.target.value }))}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cleaning Fee (₦)
                        </label>
                        <input
                          type="number"
                          value={formData.shortletCleaningFee}
                          onChange={(e) => setFormData((prev) => ({ ...prev, shortletCleaningFee: e.target.value }))}
                          min="0"
                          placeholder="e.g., 15000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Summary */}
                {formData.allowLongTerm && (formData.monthlyRent || formData.securityDeposit) && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Long-term Pricing Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-medium">{formatCurrency(formData.monthlyRent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium">{formatCurrency(formData.securityDeposit)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-gray-900 font-medium">Total Move-in Cost</span>
                        <span className="font-bold" style={{ color: '#0B3D2C' }}>
                          {formatCurrency(
                            (parseInt(formData.monthlyRent || '0') + parseInt(formData.securityDeposit || '0')).toString()
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Unit Description (for public listing) */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Description (for listing)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    This description will appear on the public listing page
                  </p>
                  <textarea
                    name="unitDescription"
                    value={formData.unitDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe this unit for potential tenants..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>

                {/* Unit Interior Images */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Interior Images
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    (Max. 5 images) Interior photos that will appear on the public listing
                  </p>

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {formData.unitImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUnitImage(image.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {Array.from({ length: Math.max(0, 5 - formData.unitImages.length) }).map((_, index) => (
                      <label
                        key={`unit-upload-${index}`}
                        className="aspect-square rounded-lg border border-dashed border-gray-300 hover:border-[#0B3D2C] cursor-pointer flex items-center justify-center transition-colors bg-gray-50 hover:bg-green-50"
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handleUnitImageUpload(e)}
                          className="hidden"
                        />
                        <ImagePlus className="w-8 h-8 text-[#0B3D2C]" />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 5: Amenities */}
        {currentStep === 'amenities' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
            <p className="text-sm text-gray-600">
              Select all amenities available
              {formData.isMultiUnit && ' (shared by all units)'}
            </p>

            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
            {formData.amenities.length > 0 && (
              <p className="text-sm text-gray-500">
                {formData.amenities.length} amenities selected
              </p>
            )}
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review Property Details</h2>
            <p className="text-sm text-gray-600">Please review the information before creating the property</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Owner
                </h3>
                <p className="text-gray-900">{selectedOwner?.firstName} {selectedOwner?.lastName}</p>
                <p className="text-sm text-gray-500">{selectedOwner?.email}</p>
              </div>

              {/* Property Type */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  {formData.isMultiUnit ? <Building2 className="w-4 h-4 mr-2" /> : <Home className="w-4 h-4 mr-2" />}
                  Property Type
                </h3>
                <p className="text-gray-900">
                  {formData.isMultiUnit ? 'Multi-Unit Building' : 'Single Unit Property'}
                </p>
                <p className="text-sm text-gray-500 capitalize">{formData.type}</p>
              </div>

              {/* Building Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h3>
                <p className="text-gray-900">{formData.name}</p>
                <p className="text-sm text-gray-500">{formData.address}</p>
                <p className="text-sm text-gray-500">{formData.city}, {formData.state}</p>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing
                </h3>
                {formData.isMultiUnit ? (
                  <>
                    <p className="text-gray-900">{formData.units.length} units</p>
                    <p className="text-sm text-gray-500">
                      Total: {formatCurrency(getTotalMonthlyRent().toString())}/month
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-900">{formatCurrency(formData.monthlyRent)}/month</p>
                    <p className="text-sm text-gray-500">Deposit: {formatCurrency(formData.securityDeposit)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.bedrooms} bed, {formData.bathrooms} bath, {formData.area} sqft
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Units List (for multi-unit) */}
            {formData.isMultiUnit && formData.units.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Units ({formData.units.length})
                </h3>
                <div className="space-y-4">
                  {formData.units.map((unit) => (
                    <div key={unit.id} className="py-3 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{unit.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {unit.bedrooms} bed, {unit.bathrooms} bath, {unit.area} sqft
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{formatCurrency(unit.monthlyRent)}/mo</span>
                      </div>
                      {unit.description && (
                        <p className="text-sm text-gray-500 mb-2">{unit.description}</p>
                      )}
                      {unit.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                          {unit.images.map((image) => (
                            <div
                              key={image.id}
                              className="aspect-square rounded border border-gray-200 overflow-hidden"
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Building Exterior Images */}
            {formData.images.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  {formData.isMultiUnit ? 'Building Exterior' : 'Property Exterior'} ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image) => (
                    <div
                      key={image.id}
                      className="aspect-square rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single-Unit Images */}
            {!formData.isMultiUnit && formData.unitImages.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Unit Interior Images ({formData.unitImages.length})
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {formData.unitImages.map((image) => (
                    <div
                      key={image.id}
                      className="aspect-square rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single-Unit Description */}
            {!formData.isMultiUnit && formData.unitDescription && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Unit Description</h3>
                <p className="text-sm text-gray-600">{formData.unitDescription}</p>
              </div>
            )}

            {/* Amenities */}
            {formData.amenities.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Amenities ({formData.amenities.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 'owner'}
            className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Property
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
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUnitModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUnitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {editingUnitId ? 'Edit Unit' : (bulkMode ? `Add ${bulkCount} Units` : 'Add Unit(s)')}
            </h3>

            <div className="space-y-4">
              {/* Mode Toggle - Only show when adding, not editing */}
              {!editingUnitId && (
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setBulkMode(false)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      !bulkMode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Single Unit
                  </button>
                  <button
                    onClick={() => {
                      setBulkMode(true);
                      initBulkPricing(bulkCount, namePrefix, startingNumber);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      bulkMode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Multiple Units
                  </button>
                </div>
              )}

              {/* Single Unit Name & Description - Only show in single mode or when editing */}
              {(!bulkMode || editingUnitId) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unitFormData.name}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Unit 2A, Flat 3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Description (for listing)
                    </label>
                    <textarea
                      value={unitFormData.description}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      placeholder="Describe this unit for potential tenants..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Bulk Mode Configuration */}
              {bulkMode && !editingUnitId && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How many?
                      </label>
                      <select
                        value={bulkCount}
                        onChange={(e) => {
                          const count = parseInt(e.target.value);
                          setBulkCount(count);
                          initBulkPricing(count, namePrefix, startingNumber);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      >
                        {Array.from({ length: 19 }, (_, i) => i + 2).map((n) => (
                          <option key={n} value={n}>{n} units</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name prefix
                      </label>
                      <input
                        type="text"
                        value={namePrefix}
                        onChange={(e) => {
                          setNamePrefix(e.target.value);
                          initBulkPricing(bulkCount, e.target.value, startingNumber);
                        }}
                        placeholder="Unit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start #
                      </label>
                      <input
                        type="number"
                        value={startingNumber}
                        onChange={(e) => {
                          const start = parseInt(e.target.value) || 1;
                          setStartingNumber(start);
                          initBulkPricing(bulkCount, namePrefix, start);
                        }}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Preview: </span>
                    <span className="text-gray-900">
                      {generateUnitNames(Math.min(bulkCount, 4), namePrefix || 'Unit', startingNumber).join(', ')}
                      {bulkCount > 4 && `, ... (${bulkCount} total)`}
                    </span>
                  </div>
                </div>
              )}

              {/* Specs Row - Shared for all modes */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="number"
                    value={unitFormData.floor}
                    onChange={(e) => setUnitFormData((prev) => ({ ...prev, floor: e.target.value }))}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    disabled={bulkMode && !editingUnitId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={unitFormData.bedrooms}
                    onChange={(e) => setUnitFormData((prev) => ({ ...prev, bedrooms: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={unitFormData.bathrooms}
                    onChange={(e) => setUnitFormData((prev) => ({ ...prev, bathrooms: e.target.value }))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Area Row */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sqft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={unitFormData.area}
                  onChange={(e) => setUnitFormData((prev) => ({ ...prev, area: e.target.value }))}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              {/* Rental Mode Toggle */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Rental Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unitFormData.allowLongTerm}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, allowLongTerm: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                    />
                    <span className="text-sm text-gray-700">Long-term Rental (monthly)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unitFormData.allowShortlet}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, allowShortlet: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                    />
                    <span className="text-sm text-gray-700">Shortlet (daily/nightly)</span>
                  </label>
                </div>
              </div>

              {/* Pricing Mode Toggle - Only in bulk mode with long-term */}
              {bulkMode && !editingUnitId && unitFormData.allowLongTerm && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Pricing</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={useSamePrice}
                        onChange={() => setUseSamePrice(true)}
                        className="w-4 h-4 border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                      />
                      <span className="text-sm text-gray-700">Same price for all units</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!useSamePrice}
                        onChange={() => {
                          setUseSamePrice(false);
                          initBulkPricing(bulkCount, namePrefix, startingNumber);
                        }}
                        className="w-4 h-4 border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                      />
                      <span className="text-sm text-gray-700">Different prices per unit</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Long-term Pricing - Same price mode or single unit */}
              {unitFormData.allowLongTerm && (useSamePrice || !bulkMode || editingUnitId) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent (₦){bulkMode && !editingUnitId && ' - All Units'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={unitFormData.monthlyRent}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, monthlyRent: e.target.value }))}
                      min="0"
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Deposit (₦){bulkMode && !editingUnitId && ' - All Units'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={unitFormData.securityDeposit}
                      onChange={(e) => setUnitFormData((prev) => ({ ...prev, securityDeposit: e.target.value }))}
                      min="0"
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Different Prices Per Unit Table */}
              {bulkMode && !editingUnitId && unitFormData.allowLongTerm && !useSamePrice && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Set price for each unit</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Unit</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Monthly Rent (₦)</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Deposit (₦)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bulkPricing.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-gray-900 font-medium">{item.unitName}</td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.monthlyRent}
                                onChange={(e) => {
                                  const newPricing = [...bulkPricing];
                                  newPricing[index] = { ...newPricing[index], monthlyRent: e.target.value };
                                  setBulkPricing(newPricing);
                                }}
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#0B3D2C] focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={item.securityDeposit}
                                onChange={(e) => {
                                  const newPricing = [...bulkPricing];
                                  newPricing[index] = { ...newPricing[index], securityDeposit: e.target.value };
                                  setBulkPricing(newPricing);
                                }}
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#0B3D2C] focus:border-transparent"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Shortlet Pricing */}
              {unitFormData.allowShortlet && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-3 text-sm">Shortlet Pricing</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Daily Rate (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={unitFormData.shortletDailyRate}
                        onChange={(e) => setUnitFormData((prev) => ({ ...prev, shortletDailyRate: e.target.value }))}
                        min="0"
                        placeholder="35000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Min. Nights</label>
                      <input
                        type="number"
                        value={unitFormData.shortletMinNights}
                        onChange={(e) => setUnitFormData((prev) => ({ ...prev, shortletMinNights: e.target.value }))}
                        min="1"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cleaning Fee</label>
                      <input
                        type="number"
                        value={unitFormData.shortletCleaningFee}
                        onChange={(e) => setUnitFormData((prev) => ({ ...prev, shortletCleaningFee: e.target.value }))}
                        min="0"
                        placeholder="15000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Unit Images - Only for single unit or editing */}
              {(!bulkMode || editingUnitId) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Interior Images
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    (Max. 5 images) Interior photos for the public listing
                  </p>

                  <div className="grid grid-cols-5 gap-3">
                    {unitFormData.images.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUnitImage(image.id, true)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {Array.from({ length: Math.max(0, 5 - unitFormData.images.length) }).map((_, index) => (
                      <label
                        key={`modal-upload-${index}`}
                        className="aspect-square rounded-lg border border-dashed border-gray-300 hover:border-[#0B3D2C] cursor-pointer flex items-center justify-center transition-colors bg-gray-50 hover:bg-green-50"
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handleUnitImageUpload(e, true)}
                          className="hidden"
                        />
                        <ImagePlus className="w-6 h-6 text-[#0B3D2C]" />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Bulk mode note about images */}
              {bulkMode && !editingUnitId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    You can add images to each unit individually after creating them.
                  </p>
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
                  onClick={bulkMode && !editingUnitId ? saveBulkUnits : saveUnit}
                  disabled={
                    bulkMode && !editingUnitId
                      ? (
                          !unitFormData.bedrooms ||
                          !unitFormData.bathrooms ||
                          !unitFormData.area ||
                          (!unitFormData.allowLongTerm && !unitFormData.allowShortlet) ||
                          (unitFormData.allowLongTerm && useSamePrice && (!unitFormData.monthlyRent || !unitFormData.securityDeposit)) ||
                          (unitFormData.allowShortlet && !unitFormData.shortletDailyRate)
                        )
                      : (
                          !unitFormData.name ||
                          !unitFormData.bedrooms ||
                          !unitFormData.bathrooms ||
                          !unitFormData.area ||
                          (!unitFormData.allowLongTerm && !unitFormData.allowShortlet) ||
                          (unitFormData.allowLongTerm && (!unitFormData.monthlyRent || !unitFormData.securityDeposit)) ||
                          (unitFormData.allowShortlet && !unitFormData.shortletDailyRate)
                        )
                  }
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  {editingUnitId ? 'Update Unit' : (bulkMode ? `Add ${bulkCount} Units` : 'Add Unit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
