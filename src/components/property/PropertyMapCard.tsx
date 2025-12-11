'use client';

import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Badge } from '../ui/Badge';

interface PropertyMapCardProps {
  property: Property;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function PropertyMapCard({
  property,
  onFavorite,
  isFavorite = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
}: PropertyMapCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${
        isHovered ? 'border-[#0B3D2C] shadow-xl scale-[1.02]' : 'border-transparent'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link href={`/property/${property.id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />

          {/* Verified Badge */}
          {property.verified && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm">
                ✓ Verified
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.();
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 text-xs font-semibold text-white rounded" style={{ backgroundColor: '#B87333' }}>
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{property.address}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {property.title}
          </h3>

          {/* Property Details */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms}
            </div>
            <div className="flex items-center">
              <Maximize className="w-4 h-4 mr-1" />
              {property.area} sqft
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold" style={{ color: '#0B3D2C' }}>
                {formatCurrency(property.price)}
              </span>
              <span className="text-sm text-gray-600">/month</span>
            </div>
            {property.rating && (
              <div className="flex items-center text-sm">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold">{property.rating}</span>
                <span className="text-gray-500 ml-1">({property.reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
