"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PropertyFilters, RentalMode } from "@/lib/types";
import {
  filtersToSearchParams,
  searchParamsToFilters,
  countActiveFilters,
} from "@/lib/filters/utils";

interface UsePropertyFiltersOptions {
  /** Sync filters to URL. Default: true */
  syncToUrl?: boolean;
  /** Debounce delay for URL updates in ms. Default: 300 */
  debounceMs?: number;
}

interface UsePropertyFiltersReturn {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  updateFilter: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  rentalMode: RentalMode;
  setRentalMode: (mode: RentalMode) => void;
}

export function usePropertyFilters(
  options: UsePropertyFiltersOptions = {}
): UsePropertyFiltersReturn {
  const { syncToUrl = true, debounceMs = 300 } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from URL params
  const [filters, setFiltersInternal] = useState<PropertyFilters>(() =>
    searchParamsToFilters(searchParams)
  );

  // Sync filters from URL when it changes (e.g., back/forward navigation)
  useEffect(() => {
    const urlFilters = searchParamsToFilters(searchParams);
    setFiltersInternal(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters: PropertyFilters) => {
      if (!syncToUrl) return;

      const params = filtersToSearchParams(newFilters);
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, pathname, syncToUrl]
  );

  // Debounced URL update
  useEffect(() => {
    if (!syncToUrl) return;

    const timeoutId = setTimeout(() => {
      updateUrl(filters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [filters, updateUrl, syncToUrl, debounceMs]);

  // Set all filters at once
  const setFilters = useCallback((newFilters: PropertyFilters) => {
    setFiltersInternal(newFilters);
  }, []);

  // Update a single filter key
  const updateFilter = useCallback(
    <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
      setFiltersInternal((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersInternal({});
  }, []);

  // Rental mode convenience accessor
  const rentalMode = filters.rentalMode || "all";

  const setRentalMode = useCallback((mode: RentalMode) => {
    setFiltersInternal((prev) => ({
      ...prev,
      rentalMode: mode,
    }));
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    activeFilterCount: countActiveFilters(filters),
    rentalMode,
    setRentalMode,
  };
}
