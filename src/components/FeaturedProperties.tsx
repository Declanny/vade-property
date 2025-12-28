"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "./property/PropertyCard";
import { getFeaturedProperties } from "@/lib/data/mock";

export default function FeaturedProperties() {
  const featuredProperties = getFeaturedProperties();

  return (
    <section id="properties" className="py-20 bg-white/80 backdrop-blur-sm">
      <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-20">
        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
          {featuredProperties.slice(0, 25).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
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
