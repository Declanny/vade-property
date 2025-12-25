'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bed,
  Bath,
  Maximize,
  Edit,
  CreditCard,
  MessageSquare,
  Wrench,
  AlertCircle,
  Check,
  Clock,
  Plus,
  X,
  Trash2,
  Pencil,
} from 'lucide-react';
import {
  mockProperties,
  mockPropertyOwners,
  mockPayments,
  mockComplaints,
  mockTenants,
  mockLeaseAgreements,
  isMultiUnitProperty,
  getPropertyOccupancy,
  getPropertyTotalRent,
} from '@/lib/data/adminMock';
import type { Unit } from '@/lib/types/admin';
import { formatCurrency, formatDate, formatDateShort } from '@/lib/utils/format';
import { StatusBadge, PriorityBadge, TypeBadge } from '@/lib/utils/statusBadges';
import { ConfirmDialog } from '@/components/admin';
import { UnitModal } from '@/components/admin/UnitModal';
import type { UnitFormData } from '@/lib/types/forms';
import { getEmptyUnitForm } from '@/lib/types/forms';

type TabType = 'overview' | 'units' | 'tenant' | 'payments' | 'complaints' | 'maintenance';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Unit modal state
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [unitFormData, setUnitFormData] = useState<UnitFormData>(getEmptyUnitForm());

  // Maintenance modal state
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<{
    id: string;
    title: string;
    description: string;
    priority: string;
    scheduledDate: string;
    estimatedCost: string;
    vendor: string;
    status: string;
  }[]>([]);
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    scheduledDate: '',
    estimatedCost: '',
    vendor: '',
  });

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'property'; id: string; name: string } | null>(null);

  // Find property and related data - use state for property to allow modifications
  const [propertyData, setPropertyData] = useState(() => mockProperties.find((p) => p.id === propertyId));
  const property = propertyData;
  const owner = property ? mockPropertyOwners.find((o) => o.id === property.ownerId) : null;
  const isMultiUnit = property ? isMultiUnitProperty(property) : false;
  const occupancy = property ? getPropertyOccupancy(property) : { total: 0, occupied: 0, vacant: 0 };
  const totalRent = property ? getPropertyTotalRent(property) : 0;

  // For single-unit properties, get tenant from property.currentTenantId
  // For multi-unit properties, tenant is handled per unit in the Units tab
  const tenant = !isMultiUnit && property?.currentTenantId
    ? mockTenants.find((t) => t.id === property.currentTenantId)
    : null;
  const propertyPayments = mockPayments.filter((p) => p.propertyId === propertyId);
  const propertyComplaints = mockComplaints.filter((c) => c.propertyId === propertyId);
  const lease = tenant
    ? mockLeaseAgreements.find((l) => l.tenantId === tenant.id && l.propertyId === propertyId)
    : null;

  // Helper to get tenant for a unit
  const getTenantForUnit = (unit: Unit) => {
    return unit.currentTenantId ? mockTenants.find(t => t.id === unit.currentTenantId) : null;
  };

  // ============================================================================
  // UNIT MANAGEMENT HANDLERS
  // ============================================================================

  const openAddUnitModal = () => {
    setEditingUnitId(null);
    setUnitFormData(getEmptyUnitForm());
    setShowUnitModal(true);
  };

  const openEditUnitModal = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setUnitFormData({
      id: unit.id,
      name: unit.name,
      floor: unit.floor?.toString() || '',
      bedrooms: unit.bedrooms.toString(),
      bathrooms: unit.bathrooms.toString(),
      area: unit.area.toString(),
      monthlyRent: unit.monthlyRent.toString(),
      securityDeposit: unit.securityDeposit?.toString() || '',
      allowLongTerm: unit.allowLongTerm ?? true,
      allowShortlet: unit.allowShortlet ?? false,
      shortletDailyRate: unit.shortletPricing?.dailyRate?.toString() || '',
      shortletMinNights: unit.shortletPricing?.minimumNights?.toString() || '1',
      shortletCleaningFee: unit.shortletPricing?.cleaningFee?.toString() || '',
      status: unit.status,
    });
    setShowUnitModal(true);
  };

  const saveUnit = () => {
    if (!property || !property.units) return;

    const newUnit: Unit = {
      id: unitFormData.id,
      propertyId: property.id,
      name: unitFormData.name,
      floor: unitFormData.floor ? parseInt(unitFormData.floor) : undefined,
      bedrooms: parseInt(unitFormData.bedrooms) || 1,
      bathrooms: parseInt(unitFormData.bathrooms) || 1,
      area: parseInt(unitFormData.area) || 0,
      monthlyRent: parseInt(unitFormData.monthlyRent) || 0,
      securityDeposit: parseInt(unitFormData.securityDeposit) || 0,
      allowLongTerm: unitFormData.allowLongTerm,
      allowShortlet: unitFormData.allowShortlet,
      shortletPricing: unitFormData.allowShortlet ? {
        dailyRate: parseInt(unitFormData.shortletDailyRate) || 0,
        minimumNights: parseInt(unitFormData.shortletMinNights) || 1,
        cleaningFee: parseInt(unitFormData.shortletCleaningFee) || 0,
      } : undefined,
      status: unitFormData.status as 'vacant' | 'occupied' | 'maintenance' | 'reserved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingUnitId) {
      // Update existing unit
      setPropertyData(prev => prev ? {
        ...prev,
        units: prev.units?.map(u => u.id === editingUnitId ? newUnit : u),
      } : prev);
    } else {
      // Add new unit
      setPropertyData(prev => prev ? {
        ...prev,
        units: [...(prev.units || []), newUnit],
        totalUnits: (prev.totalUnits || 0) + 1,
      } : prev);
    }

    setShowUnitModal(false);
  };

  const confirmDeleteUnit = (unit: Unit) => {
    setDeleteTarget({ type: 'unit', id: unit.id, name: unit.name });
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget || !property) return;

    if (deleteTarget.type === 'unit') {
      setPropertyData(prev => prev ? {
        ...prev,
        units: prev.units?.filter(u => u.id !== deleteTarget.id),
        totalUnits: Math.max(0, (prev.totalUnits || 1) - 1),
      } : prev);
    }

    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  // ============================================================================
  // MAINTENANCE HANDLERS
  // ============================================================================

  const openMaintenanceModal = () => {
    setMaintenanceFormData({
      title: '',
      description: '',
      priority: 'medium',
      scheduledDate: '',
      estimatedCost: '',
      vendor: '',
    });
    setShowMaintenanceModal(true);
  };

  const saveMaintenance = () => {
    const newRecord = {
      id: `maint-${Date.now()}`,
      ...maintenanceFormData,
      status: 'scheduled',
    };
    setMaintenanceRecords(prev => [...prev, newRecord]);
    setShowMaintenanceModal(false);
  };

  const updateMaintenanceStatus = (id: string, newStatus: string) => {
    setMaintenanceRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  // Handle property not found
  if (!property) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/properties"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-block"
            style={{ backgroundColor: '#0B3D2C' }}
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Build tabs based on property type
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    // Only show Units tab for multi-unit properties
    ...(isMultiUnit ? [{ id: 'units' as TabType, label: 'Units', icon: Building2, count: property?.units?.length || 0 }] : []),
    // Only show Tenant tab for single-unit properties
    ...(!isMultiUnit ? [{ id: 'tenant' as TabType, label: 'Tenant', icon: Users }] : []),
    { id: 'payments' as TabType, label: 'Payments', icon: CreditCard, count: propertyPayments.length },
    { id: 'complaints' as TabType, label: 'Complaints', icon: MessageSquare, count: propertyComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Wrench },
  ];

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

      {/* Property Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Property Image Banner */}
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <StatusBadge status={property.status} />
            <TypeBadge type={property.type} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-start text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
              <p className="text-gray-600 text-sm">{property.description}</p>
            </div>
            <Link
              href={`/admin/properties/${property.id}/edit`}
              className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
              style={{ backgroundColor: '#B87333' }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Property
            </Link>
          </div>

          {/* Owner Info */}
          {owner && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Owner:{' '}
                <Link
                  href={`/admin/owners/${owner.id}`}
                  className="font-medium text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                >
                  {owner.firstName} {owner.lastName}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#0B3D2C' }} />
            </div>
            <div>
              <p className="text-xs text-gray-600">{isMultiUnit ? 'Total Rent' : 'Monthly Rent'}</p>
              <p className="text-lg font-bold" style={{ color: '#0B3D2C' }}>{formatCurrency(totalRent)}</p>
            </div>
          </div>
        </div>
        {isMultiUnit ? (
          // Multi-unit: show occupancy stats
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Units</p>
                  <p className="text-lg font-bold text-blue-600">{occupancy.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Occupied</p>
                  <p className="text-lg font-bold text-green-600">{occupancy.occupied}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Home className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Vacant</p>
                  <p className="text-lg font-bold text-yellow-600">{occupancy.vacant}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Single-unit: show deposit, area, bedrooms
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Security Deposit</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(property.securityDeposit || 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Maximize className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Area</p>
                  <p className="text-lg font-bold text-gray-900">{property.area || 0} sqft</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Bed className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Bedrooms / Baths</p>
                  <p className="text-lg font-bold text-gray-900">{property.bedrooms || 0} / {property.bathrooms || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 p-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive ? { backgroundColor: '#0B3D2C' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Property Type</p>
                    <p className="font-medium text-gray-900 capitalize">{property.type}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div><StatusBadge status={property.status} /></div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Listed Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {property.availableFrom && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Available From</p>
                      <p className="font-medium text-gray-900">
                        {new Date(property.availableFrom).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        <Check className="w-4 h-4 mr-1.5 text-green-600" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{propertyPayments.length}</p>
                    <p className="text-sm text-gray-600">Total Payments</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {propertyPayments.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{propertyComplaints.length}</p>
                    <p className="text-sm text-gray-600">Total Complaints</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {propertyComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}
                    </p>
                    <p className="text-sm text-gray-600">Active Issues</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Units Tab - Only for multi-unit properties */}
          {activeTab === 'units' && isMultiUnit && property.units && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Units ({property.units.length})
                </h3>
                <button
                  onClick={openAddUnitModal}
                  className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.units.map((unit) => {
                  const unitTenant = getTenantForUnit(unit);
                  return (
                    <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={unit.status} />
                          <button
                            onClick={() => openEditUnitModal(unit)}
                            className="p-1 text-gray-400 hover:text-[#0B3D2C] transition-colors"
                            title="Edit unit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteUnit(unit)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete unit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {unit.bedrooms} bed
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {unit.bathrooms} bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            {unit.area} sqft
                          </span>
                        </div>
                        {unit.floor && (
                          <p className="text-gray-500">Floor {unit.floor}</p>
                        )}
                      </div>
                      <p className="font-bold text-lg" style={{ color: '#0B3D2C' }}>
                        {formatCurrency(unit.monthlyRent)}/mo
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {unitTenant ? (
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/admin/tenants/${unitTenant.id}`}
                              className="text-sm font-medium hover:underline flex items-center gap-2"
                              style={{ color: '#0B3D2C' }}
                            >
                              <Users className="w-4 h-4" />
                              {unitTenant.firstName} {unitTenant.lastName}
                            </Link>
                            <StatusBadge status={unitTenant.rentStatus} />
                          </div>
                        ) : (
                          <Link
                            href={`/admin/tenants/add?propertyId=${property.id}&unitId=${unit.id}`}
                            className="text-sm font-medium hover:underline flex items-center gap-2"
                            style={{ color: '#0B3D2C' }}
                          >
                            <Plus className="w-4 h-4" />
                            Assign Tenant
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tenant Tab - Only for single-unit properties */}
          {activeTab === 'tenant' && !isMultiUnit && (
            <div>
              {tenant ? (
                <div className="space-y-6">
                  {/* Tenant Info Card */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: '#0B3D2C' }}
                      >
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/admin/tenants/${tenant.id}`}
                            className="text-xl font-bold text-gray-900 underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] hover:decoration-[#0B3D2C] transition-colors"
                          >
                            {tenant.firstName} {tenant.lastName}
                          </Link>
                          <StatusBadge status={tenant.rentStatus} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {tenant.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {tenant.phone}
                          </div>
                          {tenant.moveInDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Move-in: {new Date(tenant.moveInDate).toLocaleDateString('en-NG')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lease Info */}
                  {lease && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Agreement</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Start Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(lease.startDate).toLocaleDateString('en-NG')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">End Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(lease.endDate).toLocaleDateString('en-NG')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Rent</p>
                            <p className="font-medium text-gray-900">{formatCurrency(lease.monthlyRent)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <StatusBadge status={lease.status} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rent Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                        <p className="text-xl font-bold" style={{ color: '#0B3D2C' }}>
                          {formatCurrency(tenant.monthlyRent || 0)}
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
                        <p className={`text-xl font-bold ${tenant.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(tenant.outstandingBalance)}
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Last Payment</p>
                        <p className="text-xl font-bold text-gray-900">
                          {tenant.lastPaymentDate
                            ? new Date(tenant.lastPaymentDate).toLocaleDateString('en-NG')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tenant Assigned</h3>
                  <p className="text-gray-600 mb-4">This property is currently vacant.</p>
                  <Link
                    href={`/admin/tenants/add?propertyId=${property.id}`}
                    className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors inline-flex items-center"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Assign Tenant
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {propertyPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {propertyPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-900">{payment.description}</p>
                            <p className="text-sm text-gray-500 capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                          </td>
                          <td className="px-4 py-4 font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(payment.dueDate).toLocaleDateString('en-NG')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString('en-NG')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payments recorded for this property</p>
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              {propertyComplaints.length > 0 ? (
                <div className="space-y-4">
                  {propertyComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                        <div className="flex gap-2">
                          <PriorityBadge priority={complaint.priority} />
                          <StatusBadge status={complaint.status} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">Category: {complaint.category}</span>
                        <span>Filed: {new Date(complaint.createdAt).toLocaleDateString('en-NG')}</span>
                        {complaint.resolvedAt && (
                          <span>Resolved: {new Date(complaint.resolvedAt).toLocaleDateString('en-NG')}</span>
                        )}
                      </div>
                      {complaint.resolutionNotes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <strong>Resolution:</strong> {complaint.resolutionNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints for this property</p>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Maintenance Schedule ({maintenanceRecords.length})
                </h3>
                <button
                  onClick={openMaintenanceModal}
                  className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors flex items-center"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Maintenance
                </button>
              </div>

              {maintenanceRecords.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.title}</h4>
                          <p className="text-sm text-gray-600">{record.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={record.priority} />
                          <StatusBadge status={record.status} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.scheduledDate).toLocaleDateString('en-NG')}
                        </span>
                        {record.estimatedCost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatCurrency(parseInt(record.estimatedCost))}
                          </span>
                        )}
                        {record.vendor && (
                          <span>Vendor: {record.vendor}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {record.status === 'scheduled' && (
                          <button
                            onClick={() => updateMaintenanceStatus(record.id, 'in_progress')}
                            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Start Work
                          </button>
                        )}
                        {record.status === 'in_progress' && (
                          <button
                            onClick={() => updateMaintenanceStatus(record.id, 'completed')}
                            className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    No maintenance records yet. Schedule maintenance tasks to keep track of property upkeep.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="number"
                    value={unitFormData.floor}
                    onChange={e => setUnitFormData(prev => ({ ...prev, floor: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={unitFormData.status}
                  onChange={e => setUnitFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                >
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
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

      {/* Schedule Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMaintenanceModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Schedule Maintenance</h4>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={maintenanceFormData.title}
                  onChange={e => setMaintenanceFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., AC Servicing, Plumbing Repair"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={maintenanceFormData.description}
                  onChange={e => setMaintenanceFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the maintenance work..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={maintenanceFormData.priority}
                    onChange={e => setMaintenanceFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={maintenanceFormData.scheduledDate}
                    onChange={e => setMaintenanceFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (₦)</label>
                  <input
                    type="number"
                    value={maintenanceFormData.estimatedCost}
                    onChange={e => setMaintenanceFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                    min="0"
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Contractor</label>
                  <input
                    type="text"
                    value={maintenanceFormData.vendor}
                    onChange={e => setMaintenanceFormData(prev => ({ ...prev, vendor: e.target.value }))}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowMaintenanceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMaintenance}
                  disabled={!maintenanceFormData.title || !maintenanceFormData.scheduledDate}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#0B3D2C' }}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete {deleteTarget.type === 'unit' ? 'Unit' : 'Property'}?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete &quot;{deleteTarget.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
