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

type Step = 'owner' | 'details' | 'financial' | 'amenities' | 'review';

export default function AddPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOwnerId = searchParams.get('ownerId');

  const [currentStep, setCurrentStep] = useState<Step>('owner');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    ownerId: preselectedOwnerId || '',
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
    amenities: [] as string[],
    images: [] as { id: string; url: string; name: string }[],
  });

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'owner', label: 'Select Owner', icon: User },
    { id: 'details', label: 'Property Details', icon: Building2 },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'amenities', label: 'Amenities', icon: Check },
    { id: 'review', label: 'Review', icon: Check },
  ];

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

    const maxImages = 5;
    const currentCount = formData.images.length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newImages: { id: string; url: string; name: string }[] = [];
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

  const canProceed = () => {
    switch (currentStep) {
      case 'owner':
        return !!formData.ownerId;
      case 'details':
        return formData.name && formData.address && formData.city && formData.state && formData.bedrooms && formData.bathrooms && formData.area;
      case 'financial':
        return formData.monthlyRent && formData.securityDeposit;
      case 'amenities':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const stepOrder: Step[] = ['owner', 'details', 'financial', 'amenities', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: Step[] = ['owner', 'details', 'financial', 'amenities', 'review'];
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // Auto-select owner if preselected
  useEffect(() => {
    if (preselectedOwnerId) {
      setCurrentStep('details');
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
          <p className="text-gray-600 mb-6">
            The property has been created and assigned to {selectedOwner?.firstName} {selectedOwner?.lastName}.
          </p>
          <div className="flex items-center justify-center gap-4">
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
            const stepOrder: Step[] = ['owner', 'details', 'financial', 'amenities', 'review'];
            const currentIndex = stepOrder.indexOf(currentStep);
            const stepIndex = stepOrder.indexOf(step.id);
            const isActive = step.id === currentStep;
            const isCompleted = stepIndex < currentIndex;
            const Icon = step.icon;

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
                  <div className={`w-16 h-0.5 mx-2 ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
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

        {/* Step 2: Property Details */}
        {currentStep === 'details' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
            <p className="text-sm text-gray-600">
              Adding property for: <strong>{selectedOwner?.firstName} {selectedOwner?.lastName}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Luxury 3BR Apartment in Lekki"
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

              {/* Property Images Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Images <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">(Max. of 5-images upload) PNG, JPG (5mb max.)</p>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {/* Uploaded Images */}
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

                  {/* Upload Buttons - Show remaining slots */}
                  {Array.from({ length: Math.max(0, 5 - formData.images.length) }).map((_, index) => (
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

                {/* Property Upload Guide */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Camera className="w-5 h-5 text-[#0B3D2C]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0B3D2C] mb-1">Property Upload Guide</h4>
                      <p className="text-sm text-gray-600">
                        We recommend you upload different views of your property for better visibility
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 ml-12">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm text-[#0B3D2C] font-medium">Front View</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm text-[#0B3D2C] font-medium">Interior</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm text-[#0B3D2C] font-medium">Side View</span>
                    </div>
                  </div>
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
          </div>
        )}

        {/* Step 3: Financial */}
        {currentStep === 'financial' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Financial Details</h2>
            <p className="text-sm text-gray-600">Set the pricing for this property</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Pricing Summary</h3>
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
          </div>
        )}

        {/* Step 4: Amenities */}
        {currentStep === 'amenities' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
            <p className="text-sm text-gray-600">Select all amenities available in this property</p>

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

        {/* Step 5: Review */}
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

              {/* Property Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Property
                </h3>
                <p className="text-gray-900">{formData.name}</p>
                <p className="text-sm text-gray-500 capitalize">{formData.type}</p>
                <p className="text-sm text-gray-500">
                  {formData.bedrooms} bed, {formData.bathrooms} bath, {formData.area} sqft
                </p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h3>
                <p className="text-gray-900">{formData.address}</p>
                <p className="text-sm text-gray-500">{formData.city}, {formData.state}</p>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing
                </h3>
                <p className="text-gray-900">{formatCurrency(formData.monthlyRent)}/month</p>
                <p className="text-sm text-gray-500">Deposit: {formatCurrency(formData.securityDeposit)}</p>
              </div>
            </div>

            {/* Property Images */}
            {formData.images.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Property Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-5 gap-2">
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
    </div>
  );
}
