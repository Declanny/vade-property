"use client";

import { useState, Suspense } from "react";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MobileFilterDrawer } from "@/components/mobile/MobileFilterDrawer";
import { MobilePropertyFilters } from "@/components/property/MobilePropertyFilters";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";

const MobileHeaderContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters, activeFilterCount, rentalMode, setRentalMode } =
    usePropertyFilters();

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
        <MobileSearchBar
          onFilterClick={() => setIsFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />
        <CategoryTabs />
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
      >
        <MobilePropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          rentalMode={rentalMode}
          onRentalModeChange={setRentalMode}
          onApply={handleApplyFilters}
        />
      </MobileFilterDrawer>
    </>
  );
};

export const MobileHeader = () => {
  return (
    <Suspense
      fallback={
        <div className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
          <MobileSearchBar />
          <CategoryTabs />
        </div>
      }
    >
      <MobileHeaderContent />
    </Suspense>
  );
};
