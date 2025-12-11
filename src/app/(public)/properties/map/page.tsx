'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Container } from '@/components/layout/Container';
import { PropertyMapCard } from '@/components/property/PropertyMapCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { Badge } from '@/components/ui/Badge';
import { mockProperties } from '@/lib/data/mock';
import type { PropertyFilters as IPropertyFilters, Property } from '@/lib/types';
import { MapIcon, Grid3x3, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Dynamically import map component (no SSR)
const PropertyMap = dynamic(
  () => import('@/components/property/PropertyMap'),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center">Loading map...</div> }
);

// Group properties by neighborhood/area
function groupPropertiesByArea(properties: Property[]) {
  const groups: Record<string, Property[]> = {};

  properties.forEach((property) => {
    // Extract neighborhood from address or use city
    let area = property.city;

    // Try to extract area from address (e.g., "Lekki Phase 1", "Ikoyi", etc.)
    const addressParts = property.address.toLowerCase();
    if (addressParts.includes('ikoyi')) area = 'Ikoyi';
    else if (addressParts.includes('lekki phase 1')) area = 'Lekki Phase 1';
    else if (addressParts.includes('lekki phase 2')) area = 'Lekki Phase 2';
    else if (addressParts.includes('lekki')) area = 'Lekki';
    else if (addressParts.includes('victoria island') || addressParts.includes('v.i') || addressParts.includes('vi')) area = 'Victoria Island';
    else if (addressParts.includes('banana island')) area = 'Banana Island';
    else if (addressParts.includes('yaba')) area = 'Yaba';
    else if (addressParts.includes('surulere')) area = 'Surulere';
    else if (addressParts.includes('ikeja')) area = 'Ikeja GRA';
    else if (addressParts.includes('magodo')) area = 'Magodo';
    else if (addressParts.includes('ajah')) area = 'Ajah';
    else if (addressParts.includes('gbagada')) area = 'Gbagada';
    else if (addressParts.includes('maryland')) area = 'Maryland';
    else if (addressParts.includes('festac')) area = 'Festac';
    else if (addressParts.includes('eko atlantic')) area = 'Eko Atlantic';
    else if (addressParts.includes('oniru')) area = 'Oniru';
    else if (addressParts.includes('parkview')) area = 'Parkview';
    else if (addressParts.includes('allen')) area = 'Allen Avenue';
    else if (addressParts.includes('sangotedo')) area = 'Sangotedo';
    else if (addressParts.includes('chevron')) area = 'Chevron';
    else if (addressParts.includes('ikotun')) area = 'Ikotun';
    else if (addressParts.includes('osapa')) area = 'Osapa London';
    else if (addressParts.includes('ogba')) area = 'Ogba';
    else if (addressParts.includes('ilupeju')) area = 'Ilupeju';

    if (!groups[area]) {
      groups[area] = [];
    }
    groups[area].push(property);
  });

  return groups;
}

export default function PropertiesMapPage() {
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [collapsedAreas, setCollapsedAreas] = useState<Set<string>>(new Set());

  const handleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  }, []);

  // Filter properties
  const filteredProperties = useMemo(() => {
    let result = [...mockProperties];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.city) {
      result = result.filter(
        (property) => property.city.toLowerCase() === filters.city?.toLowerCase()
      );
    }

    if (filters.type && filters.type.length > 0) {
      result = result.filter((property) => filters.type!.includes(property.type));
    }

    if (filters.bedrooms) {
      result = result.filter((property) => property.bedrooms >= filters.bedrooms!);
    }

    if (filters.bathrooms) {
      result = result.filter((property) => property.bathrooms >= filters.bathrooms!);
    }

    if (filters.minPrice) {
      result = result.filter((property) => property.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      result = result.filter((property) => property.price <= filters.maxPrice!);
    }

    if (filters.verifiedOnly) {
      result = result.filter((property) => property.verified);
    }

    return result;
  }, [filters, searchQuery]);

  // Group filtered properties by area
  const propertiesByArea = useMemo(() => {
    const grouped = groupPropertiesByArea(filteredProperties);
    // Sort areas by number of properties (descending)
    return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  }, [filteredProperties]);

  const toggleAreaCollapse = (area: string) => {
    setCollapsedAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(area)) {
        newSet.delete(area);
      } else {
        newSet.add(area);
      }
      return newSet;
    });
  };

  const handlePropertyClick = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
    // Scroll to property card
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <Container>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#0B3D2C' }}>
                  Properties in Lagos
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredProperties.length} properties available
                </p>
              </div>
              <Link
                href="/properties"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-sm font-medium">Grid View</span>
              </Link>
            </div>

            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={setSearchQuery}
            />
          </div>
        </Container>
      </div>

      {/* Main Content - Split Layout */}
      <div className="relative">
        {/* Properties List - Left Side (Scrollable) */}
        <div className="lg:w-1/2 lg:pr-4">
          <Container>
            <div className="py-6 space-y-6">
              {propertiesByArea.length > 0 ? (
                propertiesByArea.map(([area, properties]) => (
                  <div key={area} id={`area-${area}`}>
                    {/* Area Header */}
                    <div className="mb-4">
                      <button
                        onClick={() => toggleAreaCollapse(area)}
                        className="flex items-center justify-between w-full group"
                      >
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 group-hover:underline">
                            {area}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                          </p>
                        </div>
                        <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          {collapsedAreas.has(area) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Properties Grid */}
                    {!collapsedAreas.has(area) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {properties.map((property) => (
                          <div key={property.id} id={`property-${property.id}`}>
                            <PropertyMapCard
                              property={property}
                              onFavorite={() => handleFavorite(property.id)}
                              isFavorite={favorites.has(property.id)}
                              isHovered={hoveredPropertyId === property.id || selectedPropertyId === property.id}
                              onMouseEnter={() => setHoveredPropertyId(property.id)}
                              onMouseLeave={() => setHoveredPropertyId(null)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={() => {
                      setFilters({});
                      setSearchQuery('');
                    }}
                    className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#0B3D2C' }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </Container>
        </div>

        {/* Map - Right Side (Sticky) */}
        <div className="hidden lg:block fixed top-[180px] right-0 w-1/2 h-[calc(100vh-180px)] p-4">
          <PropertyMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredPropertyId}
            onPropertyClick={handlePropertyClick}
            onPropertyHover={setHoveredPropertyId}
          />
        </div>
      </div>

      {/* Mobile Map Toggle */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Link
          href="#map"
          className="flex items-center gap-2 px-6 py-3 text-white rounded-full shadow-lg hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#0B3D2C' }}
        >
          <MapIcon className="w-5 h-5" />
          <span className="font-semibold">Show Map</span>
        </Link>
      </div>
    </div>
  );
}
