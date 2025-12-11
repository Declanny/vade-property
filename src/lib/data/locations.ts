export interface LocationMetadata {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  propertyCount?: number;
  avgPrice?: number;
}

// Major locations in Lagos
export const lagosLocations: LocationMetadata[] = [
  {
    slug: 'ikoyi',
    name: 'Ikoyi',
    description: 'Upscale neighborhood with luxury apartments and waterfront views',
    keywords: ['ikoyi', 'parkview', 'old ikoyi', 'banana island'],
  },
  {
    slug: 'lekki',
    name: 'Lekki',
    description: 'Modern residential area with gated estates and beach access',
    keywords: ['lekki', 'lekki phase 1', 'lekki phase 2', 'lekki-epe', 'osapa', 'chevron'],
  },
  {
    slug: 'victoria-island',
    name: 'Victoria Island',
    description: 'Premier business district with executive apartments',
    keywords: ['victoria island', 'v.i', 'vi', 'ahmadu bello', 'oniru', 'eko atlantic'],
  },
  {
    slug: 'yaba',
    name: 'Yaba',
    description: 'Tech hub with affordable options for young professionals',
    keywords: ['yaba', 'sabo', 'akoka'],
  },
  {
    slug: 'ikeja',
    name: 'Ikeja',
    description: 'Capital city with mix of residential and commercial properties',
    keywords: ['ikeja', 'ikeja gra', 'allen', 'opebi', 'ogba'],
  },
  {
    slug: 'ajah',
    name: 'Ajah',
    description: 'Rapidly developing area with modern estates',
    keywords: ['ajah', 'badore', 'sangotedo', 'langbasa'],
  },
  {
    slug: 'surulere',
    name: 'Surulere',
    description: 'Established neighborhood with family-friendly communities',
    keywords: ['surulere', 'adeniran ogunsanya', 'ojuelegba'],
  },
  {
    slug: 'magodo',
    name: 'Magodo',
    description: 'Serene residential estate with luxury homes',
    keywords: ['magodo', 'magodo phase 1', 'magodo phase 2', 'cmd'],
  },
  {
    slug: 'gbagada',
    name: 'Gbagada',
    description: 'Strategic location with easy access to major roads',
    keywords: ['gbagada', 'gbagada expressway'],
  },
  {
    slug: 'maryland',
    name: 'Maryland',
    description: 'Central location near shopping and entertainment',
    keywords: ['maryland', 'ikorodu road'],
  },
  {
    slug: 'festac',
    name: 'Festac Town',
    description: 'Large residential estate with family homes',
    keywords: ['festac', 'festac town', 'amuwo odofin'],
  },
];

// Get location by slug
export function getLocationBySlug(slug: string): LocationMetadata | undefined {
  return lagosLocations.find(loc => loc.slug === slug);
}

// Get location from address
export function detectLocationFromAddress(address: string): LocationMetadata | undefined {
  const addressLower = address.toLowerCase();

  return lagosLocations.find(location =>
    location.keywords.some(keyword => addressLower.includes(keyword))
  );
}

// Create URL-friendly slug from location name
export function createLocationSlug(locationName: string): string {
  return locationName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Get all location slugs (for static generation)
export function getAllLocationSlugs(): string[] {
  return lagosLocations.map(loc => loc.slug);
}
