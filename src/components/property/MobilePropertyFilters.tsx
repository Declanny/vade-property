"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyFilters, PropertyType, PaymentPlan, RentalMode } from "@/lib/types";
import { RentalModeToggle } from "../ui/RentalModeToggle";
import {
  PROPERTY_TYPES,
  PAYMENT_PLAN_OPTIONS,
  BEDROOM_OPTIONS,
  CITY_OPTIONS,
  countActiveFilters,
} from "@/lib/filters/utils";

interface MobilePropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  rentalMode?: RentalMode;
  onRentalModeChange?: (mode: RentalMode) => void;
  onApply: () => void;
}

type FilterSection = "location" | "type" | "price" | "bedrooms" | "paymentPlan";

export const MobilePropertyFilters: React.FC<MobilePropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  rentalMode = "all",
  onRentalModeChange,
  onApply,
}) => {
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>(null);

  const toggleSection = (section: FilterSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

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

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const getSectionCount = (section: FilterSection): number => {
    switch (section) {
      case "location":
        return filters.city ? 1 : 0;
      case "type":
        return filters.type?.length || 0;
      case "price":
        return filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0;
      case "bedrooms":
        return filters.bedrooms !== undefined ? 1 : 0;
      case "paymentPlan":
        return filters.paymentPlans?.length || 0;
      default:
        return 0;
    }
  };

  const FilterSectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: FilterSection;
  }) => {
    const count = getSectionCount(section);
    const isExpanded = expandedSection === section;

    return (
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="px-2 py-0.5 bg-[#B87333] text-white text-xs font-medium rounded-full">
              {count}
            </span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Rental Mode Toggle */}
      {onRentalModeChange && (
        <div className="px-4 py-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-3">Rental type</p>
          <RentalModeToggle value={rentalMode} onChange={onRentalModeChange} size="lg" />
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 divide-y divide-gray-200">
        {/* Location */}
        <div>
          <FilterSectionHeader title="Location" section="location" />
          <AnimatePresence>
            {expandedSection === "location" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  {CITY_OPTIONS.map((city) => {
                    const isSelected = filters.city === city.value;
                    return (
                      <button
                        key={city.value}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            city: isSelected ? undefined : city.value,
                          })
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        <span>{city.label}</span>
                        {isSelected && <Check className="w-5 h-5" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Property Type */}
        <div>
          <FilterSectionHeader title="Property type" section="type" />
          <AnimatePresence>
            {expandedSection === "type" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((type) => {
                    const isSelected = filters.type?.includes(type.value);
                    return (
                      <button
                        key={type.value}
                        onClick={() => handlePropertyTypeToggle(type.value)}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div>
          <FilterSectionHeader title="Price range" section="price" />
          <AnimatePresence>
            {expandedSection === "price" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Minimum price
                    </label>
                    <input
                      type="number"
                      placeholder="₦ 0"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          minPrice: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Maximum price
                    </label>
                    <input
                      type="number"
                      placeholder="₦ Any"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          maxPrice: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bedrooms */}
        <div>
          <FilterSectionHeader title="Bedrooms" section="bedrooms" />
          <AnimatePresence>
            {expandedSection === "bedrooms" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-4 gap-2">
                  {BEDROOM_OPTIONS.map((option) => {
                    const isSelected = filters.bedrooms === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            bedrooms: isSelected ? undefined : option.value,
                          })
                        }
                        className={`flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {option.value}+
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Payment Plan */}
        <div>
          <FilterSectionHeader title="Payment plan" section="paymentPlan" />
          <AnimatePresence>
            {expandedSection === "paymentPlan" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  {PAYMENT_PLAN_OPTIONS.map((plan) => {
                    const isSelected = filters.paymentPlans?.includes(plan.value);
                    return (
                      <button
                        key={plan.value}
                        onClick={() => handlePaymentPlanToggle(plan.value)}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {plan.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 px-4 py-4 bg-white border-t border-gray-200 flex items-center justify-between gap-4 safe-area-bottom">
        <button
          onClick={handleClearFilters}
          className="text-sm font-semibold underline text-gray-700 hover:text-gray-900"
        >
          Clear all
        </button>
        <button
          onClick={onApply}
          className="flex-1 py-3 px-6 rounded-xl text-white font-semibold transition-colors"
          style={{ backgroundColor: "#B87333" }}
        >
          Show results
        </button>
      </div>
    </div>
  );
};
