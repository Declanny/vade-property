'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Save, Search, Check, FileText, Calendar, DollarSign } from 'lucide-react';
import { mockProperties, mockTenants, mockPropertyOwners, getPropertyTotalRent } from '@/lib/data/adminMock';

type Step = 'property' | 'terms' | 'clauses' | 'review';

const LEASE_CLAUSES = [
  { id: 'pets', label: 'No Pets Allowed', description: 'Tenant agrees not to keep any pets on the premises' },
  { id: 'smoking', label: 'No Smoking', description: 'Smoking is prohibited inside the property' },
  { id: 'subletting', label: 'No Subletting', description: 'Tenant cannot sublet the property without written consent' },
  { id: 'alterations', label: 'No Alterations', description: 'No structural changes without landlord approval' },
  { id: 'quiet_hours', label: 'Quiet Hours', description: 'Quiet hours from 10 PM to 7 AM' },
  { id: 'maintenance', label: 'Tenant Maintenance', description: 'Tenant responsible for minor repairs under ₦20,000' },
  { id: 'inspection', label: 'Inspection Rights', description: 'Landlord may inspect with 24-hour notice' },
  { id: 'utilities', label: 'Utilities', description: 'Tenant pays for all utilities unless specified' },
];

export default function CreateLeasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPropertyId = searchParams.get('propertyId');

  const [currentStep, setCurrentStep] = useState<Step>(preselectedPropertyId ? 'terms' : 'property');
  const [propertySearch, setPropertySearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: preselectedPropertyId || '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    paymentDueDay: '1',
    lateFeePercentage: '5',
    gracePeriodDays: '5',
    clauses: ['pets', 'smoking', 'subletting', 'inspection', 'utilities'],
  });

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'property', label: 'Select Property', icon: FileText },
    { id: 'terms', label: 'Lease Terms', icon: Calendar },
    { id: 'clauses', label: 'Clauses', icon: FileText },
    { id: 'review', label: 'Review', icon: Check },
  ];

  // Get occupied properties (have tenants assigned)
  const occupiedProperties = mockProperties.filter((p) => p.status === 'occupied' && p.currentTenantId);

  const filteredProperties = occupiedProperties.filter((property) => {
    if (!propertySearch.trim()) return true;
    const searchLower = propertySearch.toLowerCase();
    const tenant = mockTenants.find((t) => t.id === property.currentTenantId);
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      tenant?.firstName.toLowerCase().includes(searchLower) ||
      tenant?.lastName.toLowerCase().includes(searchLower)
    );
  });

  const selectedProperty = mockProperties.find((p) => p.id === formData.propertyId);
  const selectedTenant = selectedProperty?.currentTenantId
    ? mockTenants.find((t) => t.id === selectedProperty.currentTenantId)
    : null;
  const selectedOwner = selectedProperty
    ? mockPropertyOwners.find((o) => o.id === selectedProperty.ownerId)
    : null;

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseInt(amount || '0') : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleClause = (clauseId: string) => {
    setFormData((prev) => ({
      ...prev,
      clauses: prev.clauses.includes(clauseId)
        ? prev.clauses.filter((c) => c !== clauseId)
        : [...prev.clauses, clauseId],
    }));
  };

  const selectProperty = (propertyId: string) => {
    const property = mockProperties.find((p) => p.id === propertyId);
    setFormData((prev) => ({
      ...prev,
      propertyId,
      monthlyRent: property ? getPropertyTotalRent(property).toString() : '',
      securityDeposit: (property?.securityDeposit ?? 0).toString() || '',
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'property':
        return !!formData.propertyId;
      case 'terms':
        return formData.startDate && formData.endDate && formData.monthlyRent && formData.securityDeposit;
      case 'clauses':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const stepOrder: Step[] = ['property', 'terms', 'clauses', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: Step[] = ['property', 'terms', 'clauses', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const calculateLeaseDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months === 12) return '1 year';
    if (months > 12) return `${Math.floor(months / 12)} years ${months % 12} months`;
    return `${months} months`;
  };

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lease Agreement Created!</h2>
          <p className="text-gray-600 mb-2">
            A new lease has been generated for {selectedTenant?.firstName} {selectedTenant?.lastName} at{' '}
            {selectedProperty?.name}.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The lease document is ready to be sent for signing.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/admin/tenants"
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              View Tenants
            </Link>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  propertyId: '',
                  startDate: '',
                  endDate: '',
                  monthlyRent: '',
                  securityDeposit: '',
                  paymentDueDay: '1',
                  lateFeePercentage: '5',
                  gracePeriodDays: '5',
                  clauses: ['pets', 'smoking', 'subletting', 'inspection', 'utilities'],
                });
                setCurrentStep('property');
              }}
              className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Create Another Lease
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
        href="/admin/tenants"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tenants
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Lease Agreement</h1>
        <p className="text-gray-600 mt-1">Generate a new lease document for a tenant</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepOrder: Step[] = ['property', 'terms', 'clauses', 'review'];
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
                  <div className={`w-20 h-0.5 mx-2 ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Select Property */}
        {currentStep === 'property' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Property</h2>
            <p className="text-sm text-gray-600">Choose an occupied property to create a lease for</p>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                placeholder="Search by property name, address, or tenant..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>

            {/* Property List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProperties.map((property) => {
                const tenant = mockTenants.find((t) => t.id === property.currentTenantId);
                const owner = mockPropertyOwners.find((o) => o.id === property.ownerId);
                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => selectProperty(property.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      formData.propertyId === property.id
                        ? 'border-[#0B3D2C] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{property.name}</p>
                        <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs">
                          <span className="text-gray-500">Owner: {owner?.firstName} {owner?.lastName}</span>
                          <span className="font-medium" style={{ color: '#0B3D2C' }}>
                            Tenant: {tenant?.firstName} {tenant?.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(getPropertyTotalRent(property))}/mo</p>
                        {formData.propertyId === property.id && (
                          <Check className="w-5 h-5 text-green-600 ml-auto mt-2" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredProperties.length === 0 && (
                <p className="text-center text-gray-500 py-8">No occupied properties found. Assign a tenant first.</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Lease Terms */}
        {currentStep === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Lease Terms</h2>
            <p className="text-sm text-gray-600">
              Creating lease for: <strong>{selectedProperty?.name}</strong> •
              Tenant: <strong>{selectedTenant?.firstName} {selectedTenant?.lastName}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
                {calculateLeaseDuration() && (
                  <p className="text-sm text-gray-500 mt-1">Duration: {calculateLeaseDuration()}</p>
                )}
              </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Due Day</label>
                <select
                  name="paymentDueDay"
                  value={formData.paymentDueDay}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  {[1, 5, 10, 15, 20, 25].map((day) => (
                    <option key={day} value={day}>
                      {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each month
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (Days)</label>
                <input
                  type="number"
                  name="gracePeriodDays"
                  value={formData.gracePeriodDays}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee (%)</label>
                <input
                  type="number"
                  name="lateFeePercentage"
                  value={formData.lateFeePercentage}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
                {formData.monthlyRent && formData.lateFeePercentage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Late fee: {formatCurrency((parseInt(formData.monthlyRent) * parseInt(formData.lateFeePercentage) / 100).toString())}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Clauses */}
        {currentStep === 'clauses' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Lease Clauses</h2>
            <p className="text-sm text-gray-600">Select the clauses to include in the lease agreement</p>

            <div className="space-y-3">
              {LEASE_CLAUSES.map((clause) => {
                const isSelected = formData.clauses.includes(clause.id);
                return (
                  <button
                    key={clause.id}
                    type="button"
                    onClick={() => toggleClause(clause.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-[#0B3D2C] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{clause.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{clause.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#0B3D2C] bg-[#0B3D2C]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">{formData.clauses.length} clauses selected</p>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review Lease Agreement</h2>

            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Landlord (Owner)</h3>
                <p className="text-gray-900">{selectedOwner?.firstName} {selectedOwner?.lastName}</p>
                <p className="text-sm text-gray-500">{selectedOwner?.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Tenant</h3>
                <p className="text-gray-900">{selectedTenant?.firstName} {selectedTenant?.lastName}</p>
                <p className="text-sm text-gray-500">{selectedTenant?.email}</p>
              </div>
            </div>

            {/* Property */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Property</h3>
              <p className="text-gray-900">{selectedProperty?.name}</p>
              <p className="text-sm text-gray-500">{selectedProperty?.address}, {selectedProperty?.city}, {selectedProperty?.state}</p>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Lease Terms</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-NG') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium text-gray-900">
                    {formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-NG') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{calculateLeaseDuration() || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Due</p>
                  <p className="font-medium text-gray-900">{formData.paymentDueDay}th of month</p>
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Financial Terms</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Monthly Rent</p>
                  <p className="font-medium" style={{ color: '#0B3D2C' }}>{formatCurrency(formData.monthlyRent)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Deposit</p>
                  <p className="font-medium text-gray-900">{formatCurrency(formData.securityDeposit)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Grace Period</p>
                  <p className="font-medium text-gray-900">{formData.gracePeriodDays} days</p>
                </div>
                <div>
                  <p className="text-gray-500">Late Fee</p>
                  <p className="font-medium text-gray-900">{formData.lateFeePercentage}%</p>
                </div>
              </div>
            </div>

            {/* Clauses */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Included Clauses ({formData.clauses.length})</h3>
              <div className="flex flex-wrap gap-2">
                {formData.clauses.map((clauseId) => {
                  const clause = LEASE_CLAUSES.find((c) => c.id === clauseId);
                  return (
                    <span
                      key={clauseId}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {clause?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 'property'}
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
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Lease
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
