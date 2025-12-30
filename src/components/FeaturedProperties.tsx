"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LocationSection from "./property/LocationSection";
import { mockProperties } from "@/lib/data/mock";
import { detectLocationFromAddress } from "@/lib/data/locations";

export default function FeaturedProperties() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  // Curated property sections
  const propertySections = useMemo(() => {
    const ikoyiProperties = mockProperties.filter(p => {
      const loc = detectLocationFromAddress(p.address);
      return loc?.slug === 'ikoyi';
    });

    const lekkiProperties = mockProperties.filter(p => {
      const loc = detectLocationFromAddress(p.address);
      return loc?.slug === 'lekki';
    });

    const viProperties = mockProperties.filter(p => {
      const loc = detectLocationFromAddress(p.address);
      return loc?.slug === 'victoria-island';
    });

    const yabaProperties = mockProperties.filter(p => {
      const loc = detectLocationFromAddress(p.address);
      return loc?.slug === 'yaba';
    });

    const shortletProperties = mockProperties.filter(p => p.allowShortlet);

    return {
      ikoyi: ikoyiProperties,
      lekki: lekkiProperties,
      vi: viProperties,
      yaba: yabaProperties,
      shortlets: shortletProperties,
    };
  }, []);

  return (
    <section id="properties" className="py-12 bg-white/80 backdrop-blur-sm">
      <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-20">
        {/* Popular in Ikoyi */}
        <LocationSection
          title="Popular in Ikoyi"
          properties={propertySections.ikoyi}
          locationSlug="ikoyi"
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* Stay in Lekki */}
        <LocationSection
          title="Stay in Lekki"
          properties={propertySections.lekki}
          locationSlug="lekki"
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* Luxury in Victoria Island */}
        <LocationSection
          title="Luxury in Victoria Island"
          properties={propertySections.vi}
          locationSlug="victoria-island"
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* Popular Shortlets */}
        <LocationSection
          title="Popular shortlets"
          properties={propertySections.shortlets}
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* Affordable in Yaba */}
        <LocationSection
          title="Affordable in Yaba"
          properties={propertySections.yaba}
          locationSlug="yaba"
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-accent text-white rounded-[var(--radius-button)] font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-accent-light transition-all duration-300 inline-flex items-center gap-2"
            >
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
