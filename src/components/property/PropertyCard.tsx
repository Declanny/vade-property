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
    <Link href={`/properties/${property.id}`} className="block">
      <div className="group cursor-pointer">
        {/* Image Section - Airbnb Style */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
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

          {/* Verified Badge - Top Left (subtle) */}
          {property.verified && (
            <div className="absolute top-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-primary flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Verified
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Airbnb Style */}
        <div className="space-y-1">
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-[15px] text-gray-900 line-clamp-1 group-hover:underline">
            {property.title}
          </h3>

          {/* Rating and Price Row */}
          <div className="flex items-center justify-between">
            {/* Rating */}
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

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-semibold text-gray-900">
                {formatCurrency(property.price, property.currency)}
              </span>
              <span className="text-sm text-gray-600">/month</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
