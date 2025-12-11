'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { PropertyCard } from './PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '@/lib/types';

interface LocationSectionProps {
  title: string;
  description?: string;
  properties: Property[];
  locationSlug?: string;
  favorites: Set<string>;
  onFavorite: (propertyId: string) => void;
}

export default function LocationSection({
  title,
  description,
  properties,
  locationSlug,
  favorites,
  onFavorite,
}: LocationSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (properties.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4">
        <div className="flex-1">
          {locationSlug ? (
            <Link href={`/properties/${locationSlug}`} className="group">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:underline">
                {title}
              </h2>
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </Link>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </>
          )}
        </div>

        {/* Show All Link */}
        {locationSlug && (
          <Link
            href={`/properties/${locationSlug}`}
            className="text-sm font-semibold hover:underline flex-shrink-0 ml-4"
            style={{ color: '#0B3D2C' }}
          >
            Show all ({properties.length})
          </Link>
        )}
      </div>

      {/* Horizontal Scrollable Container with Navigation */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:scale-110 transform"
          style={{ border: '1px solid #0B3D2C' }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#0B3D2C' }} />
        </button>

        {/* Property Cards - Horizontal Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex-none w-[calc(20%-1.2rem)] min-w-[240px]"
            >
              <PropertyCard
                property={property}
                onFavorite={onFavorite}
                isFavorite={favorites.has(property.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:scale-110 transform"
          style={{ border: '1px solid #0B3D2C' }}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" style={{ color: '#0B3D2C' }} />
        </button>
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
