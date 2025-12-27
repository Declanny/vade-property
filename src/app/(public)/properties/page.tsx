"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/layout/Container";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { mockProperties } from "@/lib/data/mock";
import { PropertyFilters as IPropertyFilters } from "@/lib/types";
import { LayoutGrid, LayoutList, MapIcon } from "lucide-react";
import Link from "next/link";
import LocationSection from "@/components/property/LocationSection";
import { detectLocationFromAddress } from "@/lib/data/locations";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<IPropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "rating" | "newest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  // Filter and sort properties
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

    if (filters.paymentPlans && filters.paymentPlans.length > 0) {
      result = result.filter((property) =>
        filters.paymentPlans!.some((plan) => property.paymentPlans.includes(plan))
      );
    }

    if (filters.verifiedOnly) {
      result = result.filter((property) => property.verified);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return result;
  }, [filters, searchQuery, sortBy]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Curated location sections (only show when no filters applied)
  const showLocationSections = !searchQuery && Object.keys(filters).length === 0;

  const locationSections = useMemo(() => {
    if (!showLocationSections) return [];

    return [
      {
        title: "Popular homes in Ikoyi",
        description: "Luxury apartments with waterfront views",
        slug: "ikoyi",
        properties: mockProperties
          .filter(p => detectLocationFromAddress(p.address)?.slug === 'ikoyi')
          .filter(p => p.featured || (p.rating && p.rating >= 4.7))
          .slice(0, 6),
      },
      {
        title: "Affordable in Lekki",
        description: "Modern living without breaking the bank",
        slug: "lekki",
        properties: mockProperties
          .filter(p => detectLocationFromAddress(p.address)?.slug === 'lekki')
          .filter(p => p.price < 2000000)
          .slice(0, 6),
      },
      {
        title: "Luxury in Victoria Island",
        description: "Executive apartments in the heart of Lagos",
        slug: "victoria-island",
        properties: mockProperties
          .filter(p => detectLocationFromAddress(p.address)?.slug === 'victoria-island')
          .filter(p => p.price > 3000000)
          .slice(0, 6),
      },
      {
        title: "Student-friendly in Yaba",
        description: "Perfect for young professionals and students",
        slug: "yaba",
        properties: mockProperties
          .filter(p => detectLocationFromAddress(p.address)?.slug === 'yaba')
          .slice(0, 6),
      },
      {
        title: "Family homes in Ikeja",
        description: "Spacious properties for growing families",
        slug: "ikeja",
        properties: mockProperties
          .filter(p => detectLocationFromAddress(p.address)?.slug === 'ikeja')
          .filter(p => p.bedrooms >= 3)
          .slice(0, 6),
      },
      {
        title: "Available Next Month",
        description: "Move in soon",
        properties: mockProperties
          .filter(p => {
            if (!p.availableFrom) return false;
            const availDate = p.availableFrom instanceof Date ? p.availableFrom : new Date(p.availableFrom);
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return availDate <= nextMonth;
          })
          .sort((a, b) => {
            const dateA = a.availableFrom instanceof Date ? a.availableFrom : new Date(a.availableFrom || 0);
            const dateB = b.availableFrom instanceof Date ? b.availableFrom : new Date(b.availableFrom || 0);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 6),
      },
      {
        title: "Newly Added",
        description: "Latest properties on the market",
        properties: mockProperties
          .sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 6),
      },
    ].filter(section => section.properties.length > 0);
  }, [showLocationSections]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect home from our collection of verified properties
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={setSearchQuery}
          />
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[var(--radius-button)] shadow-sm">
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="lg">
              {filteredProperties.length} {filteredProperties.length === 1 ? "Property" : "Properties"}
            </Badge>
            {searchQuery && (
              <span className="text-sm text-gray-600">
                for &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Map View Link */}
            <Link
              href="/properties/map"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0B3D2C' }}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
            </Link>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-primary"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-primary"
                }`}
                aria-label="List view"
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <div className="w-full sm:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                options={sortOptions}
              />
            </div>
          </div>
        </div>

        {/* Location Sections (only when no filters) */}
        {showLocationSections && (
          <div className="space-y-8 mb-12">
            {locationSections.map((section) => (
              <LocationSection
                key={section.slug || section.title}
                title={section.title}
                description={section.description}
                properties={section.properties}
                locationSlug={section.slug}
                favorites={favorites}
                onFavorite={handleFavorite}
              />
            ))}

            {/* Divider */}
            <div className="border-t border-gray-300 pt-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">All Properties</h2>
              <p className="text-gray-600">Browse our complete collection</p>
            </div>
          </div>
        )}

        {/* Properties Grid/List */}
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleFavorite}
                isFavorite={favorites.has(property.id)}
              />
            ))}
          </div>
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
                setSearchQuery("");
              }}
              className="text-primary hover:text-primary-light font-medium underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
