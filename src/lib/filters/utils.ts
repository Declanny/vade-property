import { PropertyFilters, PropertyType, PaymentPlan, RentalMode } from "@/lib/types";

// Filter option constants (shared with PropertyFilters component)
export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
  { value: "villa", label: "Villa" },
  { value: "duplex", label: "Duplex" },
];

export const PAYMENT_PLAN_OPTIONS: { value: PaymentPlan; label: string }[] = [
  { value: "1_month", label: "Monthly" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "12_months", label: "12 Months" },
];

export const BEDROOM_OPTIONS = [
  { value: 1, label: "1 Bedroom" },
  { value: 2, label: "2 Bedrooms" },
  { value: 3, label: "3 Bedrooms" },
  { value: 4, label: "4+ Bedrooms" },
];

export const CITY_OPTIONS = [
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "port-harcourt", label: "Port Harcourt" },
  { value: "ibadan", label: "Ibadan" },
];

/**
 * Serialize filters to URL search params
 */
export function filtersToSearchParams(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.city) {
    params.set("city", filters.city);
  }
  if (filters.type && filters.type.length > 0) {
    params.set("type", filters.type.join(","));
  }
  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.bedrooms !== undefined) {
    params.set("bedrooms", String(filters.bedrooms));
  }
  if (filters.bathrooms !== undefined) {
    params.set("bathrooms", String(filters.bathrooms));
  }
  if (filters.paymentPlans && filters.paymentPlans.length > 0) {
    params.set("paymentPlans", filters.paymentPlans.join(","));
  }
  if (filters.verifiedOnly) {
    params.set("verifiedOnly", "true");
  }
  if (filters.amenities && filters.amenities.length > 0) {
    params.set("amenities", filters.amenities.join(","));
  }
  if (filters.rentalMode && filters.rentalMode !== "all") {
    params.set("mode", filters.rentalMode);
  }

  return params;
}

/**
 * Parse URL search params to filters
 */
export function searchParamsToFilters(searchParams: URLSearchParams): PropertyFilters {
  const filters: PropertyFilters = {};

  const city = searchParams.get("city");
  if (city) {
    filters.city = city;
  }

  const type = searchParams.get("type");
  if (type) {
    filters.type = type.split(",") as PropertyType[];
  }

  const minPrice = searchParams.get("minPrice");
  if (minPrice) {
    filters.minPrice = parseInt(minPrice, 10);
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    filters.maxPrice = parseInt(maxPrice, 10);
  }

  const bedrooms = searchParams.get("bedrooms");
  if (bedrooms) {
    filters.bedrooms = parseInt(bedrooms, 10);
  }

  const bathrooms = searchParams.get("bathrooms");
  if (bathrooms) {
    filters.bathrooms = parseInt(bathrooms, 10);
  }

  const paymentPlans = searchParams.get("paymentPlans");
  if (paymentPlans) {
    filters.paymentPlans = paymentPlans.split(",") as PaymentPlan[];
  }

  const verifiedOnly = searchParams.get("verifiedOnly");
  if (verifiedOnly === "true") {
    filters.verifiedOnly = true;
  }

  const amenities = searchParams.get("amenities");
  if (amenities) {
    filters.amenities = amenities.split(",");
  }

  const mode = searchParams.get("mode");
  if (mode && (mode === "shortlet" || mode === "long_term" || mode === "all")) {
    filters.rentalMode = mode as RentalMode;
  }

  return filters;
}

/**
 * Count active filters for badge display
 */
export function countActiveFilters(filters: PropertyFilters): number {
  let count = 0;

  if (filters.city) count++;
  if (filters.type && filters.type.length > 0) count++;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
  if (filters.bedrooms !== undefined) count++;
  if (filters.bathrooms !== undefined) count++;
  if (filters.paymentPlans && filters.paymentPlans.length > 0) count++;
  if (filters.verifiedOnly) count++;
  if (filters.amenities && filters.amenities.length > 0) count++;

  return count;
}

/**
 * Get human-readable filter summary
 */
export function getFilterSummary(filters: PropertyFilters): string {
  const parts: string[] = [];

  if (filters.city) {
    const cityOption = CITY_OPTIONS.find((c) => c.value === filters.city);
    parts.push(cityOption?.label || filters.city);
  }
  if (filters.type && filters.type.length > 0) {
    if (filters.type.length === 1) {
      const typeOption = PROPERTY_TYPES.find((t) => t.value === filters.type![0]);
      parts.push(typeOption?.label || filters.type[0]);
    } else {
      parts.push(`${filters.type.length} types`);
    }
  }
  if (filters.bedrooms) {
    parts.push(`${filters.bedrooms}+ beds`);
  }
  if (filters.minPrice || filters.maxPrice) {
    if (filters.minPrice && filters.maxPrice) {
      parts.push(`₦${filters.minPrice.toLocaleString()} - ₦${filters.maxPrice.toLocaleString()}`);
    } else if (filters.minPrice) {
      parts.push(`From ₦${filters.minPrice.toLocaleString()}`);
    } else {
      parts.push(`Up to ₦${filters.maxPrice!.toLocaleString()}`);
    }
  }

  return parts.join(" · ");
}
