/**
 * Shared form data types used across admin and public pages
 */

export interface ImageData {
  id: string;
  url: string;
  name: string;
}

export interface UnitFormData {
  id: string;
  name: string;
  description?: string;
  floor: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  monthlyRent: string;
  securityDeposit: string;
  allowLongTerm: boolean;
  allowShortlet: boolean;
  shortletDailyRate: string;
  shortletMinNights: string;
  shortletCleaningFee: string;
  images?: ImageData[];
  status?: string;
}

export interface BulkPricing {
  unitName: string;
  monthlyRent: string;
  securityDeposit: string;
}

export interface PropertyFormData {
  id: string;
  isMultiUnit: boolean;
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Single-unit fields
  bedrooms: string;
  bathrooms: string;
  area: string;
  monthlyRent: string;
  securityDeposit: string;
  allowLongTerm: boolean;
  allowShortlet: boolean;
  shortletDailyRate: string;
  shortletMinNights: string;
  shortletCleaningFee: string;
  unitDescription: string;
  unitImages: ImageData[];
  // Multi-unit fields
  units: UnitFormData[];
  amenities: string[];
  images: ImageData[];
}

/**
 * Get an empty unit form data object
 */
export function getEmptyUnitForm(): UnitFormData {
  return {
    id: `unit-${Date.now()}`,
    name: '',
    description: '',
    floor: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    monthlyRent: '',
    securityDeposit: '',
    allowLongTerm: true,
    allowShortlet: false,
    shortletDailyRate: '',
    shortletMinNights: '1',
    shortletCleaningFee: '',
    images: [],
    status: 'vacant',
  };
}

/**
 * Get an empty property form data object
 */
export function getEmptyPropertyForm(): PropertyFormData {
  return {
    id: `prop-${Date.now()}`,
    isMultiUnit: false,
    name: '',
    description: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    monthlyRent: '',
    securityDeposit: '',
    allowLongTerm: true,
    allowShortlet: false,
    shortletDailyRate: '',
    shortletMinNights: '1',
    shortletCleaningFee: '',
    unitDescription: '',
    unitImages: [],
    units: [],
    amenities: [],
    images: [],
  };
}

/**
 * Generate unit names for bulk creation
 */
export function generateUnitNames(count: number, prefix: string, start: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix} ${start + i}`);
}

/**
 * Initialize bulk pricing array
 */
export function initializeBulkPricing(
  count: number,
  prefix: string,
  start: number,
  defaultRent: string = '',
  defaultDeposit: string = ''
): BulkPricing[] {
  const names = generateUnitNames(count, prefix, start);
  return names.map(name => ({
    unitName: name,
    monthlyRent: defaultRent,
    securityDeposit: defaultDeposit,
  }));
}
