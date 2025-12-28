"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Home, MapPin, DollarSign, Bed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyFilters as IPropertyFilters, PropertyType, PaymentPlan } from "@/lib/types";
import { Button } from "../ui/Button";

export interface PropertyFiltersProps {
  filters: IPropertyFilters;
  onFiltersChange: (filters: IPropertyFilters) => void;
  onSearch?: (query: string) => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "studio", label: "Studio" },
    { value: "penthouse", label: "Penthouse" },
    { value: "villa", label: "Villa" },
    { value: "duplex", label: "Duplex" },
  ];

  const paymentPlanOptions: { value: PaymentPlan; label: string }[] = [
    { value: "1_month", label: "Monthly" },
    { value: "3_months", label: "3 Months" },
    { value: "6_months", label: "6 Months" },
    { value: "12_months", label: "12 Months" },
  ];

  const bedroomOptions = [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4+ Bedrooms" },
  ];

  const cityOptions = [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "port-harcourt", label: "Port Harcourt" },
    { value: "ibadan", label: "Ibadan" },
  ];

  const handlePropertyTypeToggle = (type: PropertyType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFiltersChange({ ...filters, type: newTypes.length > 0 ? newTypes : undefined });
  };

  const handlePaymentPlanToggle = (plan: PaymentPlan) => {
    const currentPlans = filters.paymentPlans || [];
    const newPlans = currentPlans.includes(plan)
      ? currentPlans.filter((p) => p !== plan)
      : [...currentPlans, plan];
    onFiltersChange({ ...filters, paymentPlans: newPlans.length > 0 ? newPlans : undefined });
  };

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    onFiltersChange({});
  };

  const getFilterLabel = (key: string) => {
    switch (key) {
      case 'location':
        return filters.city || 'Location';
      case 'type':
        return filters.type?.length ? `${filters.type.length} type${filters.type.length > 1 ? 's' : ''}` : 'Property type';
      case 'price':
        return filters.minPrice || filters.maxPrice ? 'Price set' : 'Price range';
      case 'rooms':
        return filters.bedrooms ? `${filters.bedrooms}+ beds` : 'Beds & baths';
      default:
        return '';
    }
  };

  const hasActiveFilters = filters.city || filters.type?.length || filters.bedrooms || filters.minPrice || filters.maxPrice;

  const FilterButton = ({ label, filterKey, icon: Icon }: { label: string; filterKey: string; icon: any }) => {
    const isActive = activeDropdown === filterKey;
    const hasValue = getFilterLabel(filterKey) !== label;
    
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveDropdown(isActive ? null : filterKey)}
        className={`px-4 py-3 rounded-full border flex items-center gap-2 text-sm font-medium transition-all ${
          hasValue
            ? 'border-gray-900 bg-gray-900 text-white'
            : isActive
            ? 'border-gray-900 bg-white text-gray-900'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{getFilterLabel(filterKey)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </motion.button>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Airbnb-Style Filter Bar */}
      <div className="bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2">
          {/* Location Filter */}
          <FilterButton label="Location" filterKey="location" icon={MapPin} />
          
          {/* Property Type Filter */}
          <FilterButton label="Property type" filterKey="type" icon={Home} />
          
          {/* Price Range Filter */}
          <FilterButton label="Price range" filterKey="price" icon={DollarSign} />
          
          {/* Rooms Filter */}
          <FilterButton label="Beds & baths" filterKey="rooms" icon={Bed} />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 transition-all ml-auto"
            style={{ backgroundColor: '#B87333' }}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Dropdown Modals */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 z-50 min-w-[320px]"
          >
            {/* Location Dropdown */}
            {activeDropdown === 'location' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Search by location</h3>
                <div className="space-y-2">
                  {cityOptions.map((city) => (
                    <button
                      key={city.value}
                      onClick={() => {
                        onFiltersChange({ ...filters, city: city.value });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors ${
                        filters.city === city.value ? 'bg-gray-100 font-semibold' : ''
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Property Type Dropdown */}
            {activeDropdown === 'type' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Property type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map((type) => {
                    const isSelected = filters.type?.includes(type.value);
                    return (
                      <button
                        key={type.value}
                        onClick={() => handlePropertyTypeToggle(type.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gray-900 text-white'
                            : 'bg-white border border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Range Dropdown */}
            {activeDropdown === 'price' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Price range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                    <input
                      type="number"
                      placeholder="₦ Min"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
                    <input
                      type="number"
                      placeholder="₦ Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rooms Dropdown */}
            {activeDropdown === 'rooms' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Bedrooms</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        onFiltersChange({ ...filters, bedrooms: num });
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        filters.bedrooms === num
                          ? 'bg-gray-900 text-white'
                          : 'bg-white border border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => {
                  handleClearFilters();
                  setActiveDropdown(null);
                }}
                className="text-sm font-semibold underline text-gray-700 hover:text-gray-900"
              >
                Clear all
              </button>
              <button
                onClick={() => setActiveDropdown(null)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.city && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
              {filters.city}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-600"
                onClick={() => onFiltersChange({ ...filters, city: undefined })}
              />
            </span>
          )}
          {filters.type?.map((type) => (
            <span key={type} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
              {type}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-600"
                onClick={() => onFiltersChange({ ...filters, type: filters.type?.filter(t => t !== type) })}
              />
            </span>
          ))}
          <button
            onClick={handleClearFilters}
            className="text-sm font-semibold underline hover:text-red-600"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
