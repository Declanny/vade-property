'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Container } from '@/components/layout/Container';
import { PropertyCard } from '@/components/property/PropertyCard';
import { mockProperties } from '@/lib/data/mock';
import type { Property } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  // All properties
  const filteredProperties = useMemo(() => {
    return [...mockProperties];
  }, []);

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
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Main Content - Full Screen Split Layout */}
      <div className="relative h-full">
        {/* Properties List - Left Side (Scrollable) */}
        <div className="lg:w-1/2 h-full overflow-y-auto">
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

                    {/* Properties Grid - 3 COLUMNS */}
                    {!collapsedAreas.has(area) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            onFavorite={handleFavorite}
                            isFavorite={favorites.has(property.id)}
                          />
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
                  <p className="text-gray-600">
                    Check back soon for new listings
                  </p>
                </div>
              )}
            </div>
          </Container>
        </div>

        {/* Map - Right Side (Fixed Full Screen) with Border Radius */}
        <div className="hidden lg:block fixed top-0 right-0 w-1/2 h-screen">
          <div className="h-full px-4 sm:px-6 lg:px-8">
            <div className="py-6 h-full">
              <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
                <PropertyMap
                  properties={filteredProperties}
                  selectedPropertyId={selectedPropertyId}
                  hoveredPropertyId={hoveredPropertyId}
                  onPropertyClick={handlePropertyClick}
                  onPropertyHover={setHoveredPropertyId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
