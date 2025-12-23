'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockPropertyOwners, getVacancyListings } from '@/lib/data/adminMock';
import { Home, Eye, EyeOff, Building2, Plus, MapPin } from 'lucide-react';

export default function VacanciesPage() {
  const vacancies = getVacancyListings();
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());

  const togglePublish = (vacancyId: string) => {
    const newSet = new Set(publishedIds);
    if (newSet.has(vacancyId)) {
      newSet.delete(vacancyId);
    } else {
      newSet.add(vacancyId);
    }
    setPublishedIds(newSet);
  };

  const getOwnerName = (ownerId: string) => {
    const owner = mockPropertyOwners.find(o => o.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      vacant: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Vacant' },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' },
      maintenance: { bg: 'bg-red-100', text: 'text-red-700', label: 'Maintenance' },
      reserved: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Reserved' },
    };
    const badge = badges[status] || badges.vacant;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Count by type
  const unitVacancies = vacancies.filter(v => v.type === 'unit');
  const propertyVacancies = vacancies.filter(v => v.type === 'property');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vacancy Management</h1>
        <p className="text-gray-600 mt-1">Publish and manage vacant properties and units</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Vacant</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{vacancies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Vacant Units</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{unitVacancies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Vacant Properties</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{propertyVacancies.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Published</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{publishedIds.size}</p>
        </div>
      </div>

      {/* Vacancies List */}
      {vacancies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Properties Occupied!</h3>
          <p className="text-gray-600">There are no vacant properties or units at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property / Unit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vacancies.map((vacancy) => {
                  const isPublished = publishedIds.has(vacancy.id);

                  return (
                    <tr key={vacancy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {vacancy.type === 'unit' ? (
                              <Home className="w-5 h-5 text-gray-500" />
                            ) : (
                              <Building2 className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{vacancy.name}</p>
                            {vacancy.type === 'unit' && (
                              <p className="text-xs text-gray-500">
                                Building: {vacancy.propertyName}
                              </p>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              vacancy.type === 'unit'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {vacancy.type === 'unit' ? 'Unit' : 'Property'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{vacancy.address}</p>
                            <p className="text-gray-500">{vacancy.city}, {vacancy.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {vacancy.bedrooms} bed, {vacancy.bathrooms} bath
                        </p>
                        <p className="text-xs text-gray-500">{vacancy.area} sqft</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/owners/${vacancy.ownerId}`}
                          className="text-sm font-medium underline decoration-1 underline-offset-2 hover:text-[#0B3D2C] transition-colors"
                        >
                          {getOwnerName(vacancy.ownerId)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(vacancy.monthlyRent)}
                        </p>
                        <p className="text-xs text-gray-500">/month</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(vacancy.status)}
                          {isPublished ? (
                            <span className="flex items-center text-xs text-green-600">
                              <Eye className="w-3 h-3 mr-1" />
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center text-xs text-gray-400">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Not published
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublish(vacancy.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
                              isPublished ? 'bg-red-500 hover:bg-red-600' : 'hover:opacity-90'
                            }`}
                            style={!isPublished ? { backgroundColor: '#0B3D2C' } : {}}
                          >
                            {isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <Link
                            href={`/admin/tenants/add?ownerId=${vacancy.ownerId}&propertyId=${vacancy.propertyId}${vacancy.unitId ? `&unitId=${vacancy.unitId}` : ''}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors flex items-center"
                            style={{ backgroundColor: '#B87333' }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Assign
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Publishing Vacancies</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Published properties and units appear on the public website with full details</li>
          <li>✓ Prospective tenants can apply and start the KYC process</li>
          <li>✓ You&apos;ll receive notifications when applications are submitted</li>
          <li>✓ Properties under review won&apos;t be visible to the public until approved</li>
        </ul>
      </div>
    </div>
  );
}
