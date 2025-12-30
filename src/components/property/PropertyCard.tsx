"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Star, Heart } from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/data/mock";

export interface PropertyCardProps {
  property: Property;
  onFavorite?: (propertyId: string) => void;
  isFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavorite,
  isFavorite = false,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  return (
    <Link href={`/property/${property.id}`} className="block">
      <div className="group cursor-pointer">
        {/* Image Section - Airbnb Style */}
        <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl mb-2 md:mb-3">
          <div
            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500 ease-out"
            style={{
              backgroundImage: property.images[0] ? `url(${property.images[0]})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!property.images[0] && (
              <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
                🏠
              </div>
            )}
          </div>

          {/* Favorite Button - Top Right */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all hover:scale-110"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite 
                  ? "fill-red-500 text-red-500" 
                  : "fill-white/70 text-white/70 hover:fill-red-500/50 hover:text-red-500/50"
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Verified Badge - Top Left (icon only on mobile, full badge on md+) */}
          {property.verified && (
            <div className="absolute top-3 left-3">
              {/* Mobile: Just icon */}
              <div className="md:hidden w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Desktop: Full badge */}
              <div className="hidden md:flex bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-primary items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Verified
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Airbnb Style */}
        <div className="space-y-0.5 md:space-y-1">
          {/* Location - hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm md:text-[15px] text-gray-900 line-clamp-1 group-hover:underline">
            {property.title}
          </h3>

          {/* Rating and Price Row */}
          <div className="flex items-center justify-between">
            {/* Rating - hidden on mobile */}
            <div className="hidden md:block">
              {property.rating ? (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.rating.toFixed(1)}
                  </span>
                  {property.reviewCount > 0 && (
                    <span className="text-sm text-gray-500">
                      ({property.reviewCount})
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">New listing</div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-0.5 md:gap-1">
              <span className="text-sm md:text-[15px] font-semibold text-gray-900">
                {formatCurrency(property.price, property.currency)}
              </span>
              <span className="text-xs md:text-sm text-gray-600">/mo</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
