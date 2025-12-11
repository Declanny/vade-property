'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PropertyCard } from '@/components/property/PropertyCard';
import { mockProperties } from '@/lib/data/mock';
import type { Property } from '@/lib/types';
import { getLocationBySlug, detectLocationFromAddress } from '@/lib/data/locations';

// Dynamically import map component (no SSR)
const PropertyMap = dynamic(
  () => import('@/components/property/PropertyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center">
        Loading map...
      </div>
    ),
  }
);

interface LocationPageProps {
  params: {
    location: string;
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const { location: locationSlug } = params;
  const locationMeta = getLocationBySlug(locationSlug);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

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

  // Filter properties by location
  const locationProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const detectedLocation = detectLocationFromAddress(property.address);
      return detectedLocation?.slug === locationSlug;
    });
  }, [locationSlug]);

  const handlePropertyClick = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
    // Scroll to property card
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // If location not found
  if (!locationMeta) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Location Not Found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find properties for "{locationSlug}"
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Browse All Properties
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header - Airbnb Style */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Over {locationProperties.length} properties in {locationMeta.name}
            </h1>
            <p className="text-gray-600">{locationMeta.description}</p>
          </div>
        </Container>
      </div>

      {/* Main Content - Split Layout */}
      {locationProperties.length > 0 ? (
        <div className="relative">
          {/* Properties List - Left Side (Scrollable) - 3 COLUMNS */}
          <div className="lg:w-1/2 lg:pr-4">
            <Container>
              <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locationProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.has(property.id)}
                    />
                  ))}
                </div>
              </div>
            </Container>
          </div>

          {/* Map - Right Side (Sticky) with Border Radius */}
          <div className="hidden lg:block fixed top-[120px] right-0 w-1/2 h-[calc(100vh-120px)] p-6">
            <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
              <PropertyMap
                properties={locationProperties}
                selectedPropertyId={selectedPropertyId}
                hoveredPropertyId={hoveredPropertyId}
                onPropertyClick={handlePropertyClick}
                onPropertyHover={setHoveredPropertyId}
              />
            </div>
          </div>
        </div>
      ) : (
        <Container>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No properties in {locationMeta.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new listings in this area
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              Browse All Properties
            </Link>
          </div>
        </Container>
      )}
    </div>
  );
}
