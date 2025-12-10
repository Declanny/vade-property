"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Star, Shield, Heart } from "lucide-react";
import { Property } from "@/lib/types";
import { Badge } from "../ui/Badge";
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
    <Link href={`/properties/${property.id}`}>
      <div className="group cursor-pointer">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden rounded-[var(--radius-button)] mb-3">
          <div
            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-300"
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

          {/* Verified Badge */}
          {property.verified && (
            <div className="absolute top-3 left-3">
              <Badge variant="success" size="sm" icon={<Shield className="w-3 h-3" />}>
                Verified
              </Badge>
            </div>
          )}

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 left-3" style={{ marginTop: property.verified ? "36px" : "0" }}>
              <Badge variant="accent" size="sm" icon={<Star className="w-3 h-3 fill-current" />}>
                Featured
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:scale-110"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-error text-error" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content Section - No container, just text */}
        <div className="space-y-2">
          {/* Type & Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="capitalize font-medium">{property.type}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{property.city}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Property Details */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area} {property.areaUnit}</span>
            </div>
          </div>

          {/* Rating */}
          {property.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-current" />
              <span className="text-sm font-semibold text-gray-900">{property.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({property.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(property.price, property.currency)}
              </span>
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </div>

            {/* Payment Plans Badge */}
            {property.paymentPlans.length > 1 && (
              <Badge variant="info" size="sm">
                {property.paymentPlans.length} plans
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
