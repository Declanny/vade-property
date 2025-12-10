"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyFilters as IPropertyFilters, PropertyType, PaymentPlan } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Badge } from "../ui/Badge";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const activeFilterCount = [
    filters.city,
    filters.type?.length,
    filters.bedrooms,
    filters.minPrice || filters.maxPrice,
    filters.paymentPlans?.length,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search properties by location, title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          leftIcon={<Search className="w-5 h-5" />}
          fullWidth
        />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Filter Toggle & Quick Filters */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          rightIcon={
            activeFilterCount > 0 ? (
              <Badge variant="primary" size="sm">
                {activeFilterCount}
              </Badge>
            ) : undefined
          }
        >
          {showAdvanced ? "Hide Filters" : "Show Filters"}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} leftIcon={<X className="w-4 h-4" />}>
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 p-6 rounded-[var(--radius-button)] space-y-6">
          {/* Row 1: City & Bedrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="City"
              placeholder="Select city"
              options={cityOptions}
              value={filters.city || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, city: e.target.value || undefined })
              }
              fullWidth
            />
            <Select
              label="Bedrooms"
              placeholder="Any"
              options={bedroomOptions}
              value={filters.bedrooms?.toString() || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  bedrooms: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
            />
          </div>

          {/* Row 2: Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min Price (₦)"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
            />
            <Input
              type="number"
              label="Max Price (₦)"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
            />
          </div>

          {/* Property Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => {
                const isSelected = filters.type?.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => handlePropertyTypeToggle(type.value)}
                    className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Plans</label>
            <div className="flex flex-wrap gap-2">
              {paymentPlanOptions.map((plan) => {
                const isSelected = filters.paymentPlans?.includes(plan.value);
                return (
                  <button
                    key={plan.value}
                    onClick={() => handlePaymentPlanToggle(plan.value)}
                    className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {plan.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verified Only Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verified-only"
              checked={filters.verifiedOnly || false}
              onChange={(e) =>
                onFiltersChange({ ...filters, verifiedOnly: e.target.checked || undefined })
              }
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="verified-only" className="ml-3 text-sm font-medium text-gray-700">
              Show only lawyer-verified properties
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
