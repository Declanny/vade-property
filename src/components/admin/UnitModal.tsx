'use client';

import React, { useState, useEffect } from 'react';
import { X, ImagePlus } from 'lucide-react';
import type { UnitFormData, BulkPricing, ImageData } from '@/lib/types/forms';
import { getEmptyUnitForm, generateUnitNames, initializeBulkPricing } from '@/lib/types/forms';

export interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: UnitFormData) => void;
  onSaveBulk?: (units: UnitFormData[]) => void;
  editingUnit?: UnitFormData | null;
  allowBulkMode?: boolean;
  showImages?: boolean;
  showStatus?: boolean;
}

export function UnitModal({
  isOpen,
  onClose,
  onSave,
  onSaveBulk,
  editingUnit,
  allowBulkMode = true,
  showImages = false,
  showStatus = false,
}: UnitModalProps) {
  // Form state
  const [formData, setFormData] = useState<UnitFormData>(getEmptyUnitForm());

  // Bulk mode state
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(2);
  const [namePrefix, setNamePrefix] = useState('Unit');
  const [startingNumber, setStartingNumber] = useState(1);
  const [useSamePrice, setUseSamePrice] = useState(true);
  const [bulkPricing, setBulkPricing] = useState<BulkPricing[]>([]);

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (isOpen) {
      if (editingUnit) {
        setFormData({ ...editingUnit });
        setBulkMode(false);
      } else {
        setFormData(getEmptyUnitForm());
        setBulkMode(false);
        setBulkCount(2);
        setNamePrefix('Unit');
        setStartingNumber(1);
        setUseSamePrice(true);
        setBulkPricing([]);
      }
    }
  }, [isOpen, editingUnit]);

  // Initialize bulk pricing when bulk mode params change
  const initBulkPricing = (count: number, prefix: string, start: number) => {
    setBulkPricing(initializeBulkPricing(
      count,
      prefix,
      start,
      formData.monthlyRent,
      formData.securityDeposit
    ));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentCount = formData.images?.length || 0;
    const remainingSlots = maxImages - currentCount;

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

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  };

  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId) || [],
    }));
  };

  // Save handlers
  const handleSingleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleBulkSave = () => {
    if (!onSaveBulk) return;

    const names = generateUnitNames(bulkCount, namePrefix || 'Unit', startingNumber);
    const newUnits: UnitFormData[] = names.map((name, i) => ({
      ...getEmptyUnitForm(),
      id: `unit-${Date.now()}-${i}`,
      name,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area,
      allowLongTerm: formData.allowLongTerm,
      allowShortlet: formData.allowShortlet,
      monthlyRent: useSamePrice
        ? formData.monthlyRent
        : bulkPricing[i]?.monthlyRent || formData.monthlyRent,
      securityDeposit: useSamePrice
        ? formData.securityDeposit
        : bulkPricing[i]?.securityDeposit || formData.securityDeposit,
      shortletDailyRate: formData.shortletDailyRate,
      shortletMinNights: formData.shortletMinNights,
      shortletCleaningFee: formData.shortletCleaningFee,
      images: [],
    }));

    onSaveBulk(newUnits);
    onClose();
  };

  // Validation
  const isValid = bulkMode && !editingUnit
    ? (
        formData.bedrooms &&
        formData.bathrooms &&
        formData.area &&
        (formData.allowLongTerm || formData.allowShortlet) &&
        (!formData.allowLongTerm || (useSamePrice ? (formData.monthlyRent && formData.securityDeposit) : true)) &&
        (!formData.allowShortlet || formData.shortletDailyRate)
      )
    : (
        formData.name &&
        formData.bedrooms &&
        formData.bathrooms &&
        formData.area &&
        (formData.allowLongTerm || formData.allowShortlet) &&
        (!formData.allowLongTerm || (formData.monthlyRent && formData.securityDeposit)) &&
        (!formData.allowShortlet || formData.shortletDailyRate)
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">
            {editingUnit ? 'Edit Unit' : (bulkMode ? `Add ${bulkCount} Units` : 'Add Unit(s)')}
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Toggle - Only show when adding, not editing */}
          {!editingUnit && allowBulkMode && onSaveBulk && (
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

          {/* Single Unit Name - Only in single mode or editing */}
          {(!bulkMode || editingUnit) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Unit 2A, Flat 3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>
          )}

          {/* Bulk Mode Configuration */}
          {bulkMode && !editingUnit && (
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

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                value={formData.floor}
                onChange={e => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                disabled={bulkMode && !editingUnit}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
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
                value={formData.bathrooms}
                onChange={e => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (sqft) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.area}
              onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
            />
          </div>

          {/* Status - Only for property detail page */}
          {showStatus && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status || 'vacant'}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          )}

          {/* Rental Mode Toggle */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Rental Mode</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowLongTerm}
                  onChange={e => setFormData(prev => ({ ...prev, allowLongTerm: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                />
                <span className="text-sm text-gray-700">Long-term rental (monthly)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowShortlet}
                  onChange={e => setFormData(prev => ({ ...prev, allowShortlet: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#0B3D2C] focus:ring-[#0B3D2C]"
                />
                <span className="text-sm text-gray-700">Shortlet (daily/nightly)</span>
              </label>
            </div>
          </div>

          {/* Pricing Mode Toggle - Only in bulk mode with long-term */}
          {bulkMode && !editingUnit && formData.allowLongTerm && (
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
          {formData.allowLongTerm && (useSamePrice || !bulkMode || editingUnit) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent (₦){bulkMode && !editingUnit && ' - All Units'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={e => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                  min="0"
                  placeholder="e.g., 500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Deposit (₦){bulkMode && !editingUnit && ' - All Units'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={e => setFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                  min="0"
                  placeholder="e.g., 500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Different Prices Per Unit Table */}
          {bulkMode && !editingUnit && formData.allowLongTerm && !useSamePrice && (
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
          {formData.allowShortlet && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-3 text-sm">Shortlet Pricing</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Daily Rate (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.shortletDailyRate}
                    onChange={e => setFormData(prev => ({ ...prev, shortletDailyRate: e.target.value }))}
                    min="0"
                    placeholder="35000"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min. Nights</label>
                  <input
                    type="number"
                    value={formData.shortletMinNights}
                    onChange={e => setFormData(prev => ({ ...prev, shortletMinNights: e.target.value }))}
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cleaning Fee</label>
                  <input
                    type="number"
                    value={formData.shortletCleaningFee}
                    onChange={e => setFormData(prev => ({ ...prev, shortletCleaningFee: e.target.value }))}
                    min="0"
                    placeholder="15000"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B3D2C] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Unit Images - Only for single unit or editing */}
          {showImages && (!bulkMode || editingUnit) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Interior Images
              </label>
              <p className="text-xs text-gray-500 mb-3">
                (Max. 5 images) Interior photos for the public listing
              </p>

              <div className="grid grid-cols-5 gap-3">
                {formData.images?.map((image) => (
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

                {Array.from({ length: Math.max(0, 5 - (formData.images?.length || 0)) }).map((_, index) => (
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
                    <ImagePlus className="w-6 h-6 text-[#0B3D2C]" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Bulk mode note about images */}
          {bulkMode && !editingUnit && showImages && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                You can add images to each unit individually after creating them.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={bulkMode && !editingUnit ? handleBulkSave : handleSingleSave}
              disabled={!isValid}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              {editingUnit ? 'Update Unit' : (bulkMode ? `Add ${bulkCount} Units` : 'Add Unit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
