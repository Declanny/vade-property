"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface MobileSearchBarProps {
  onFilterClick?: () => void;
  activeFilterCount?: number;
}

export const MobileSearchBar = ({
  onFilterClick,
  activeFilterCount = 0,
}: MobileSearchBarProps) => {
  return (
    <div className="px-4 py-3 bg-white">
      {/* Search Bar */}
      <motion.div
        className="flex items-center gap-3 w-full bg-gray-100 rounded-full px-4 py-3 shadow-sm border border-gray-200"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {/* Search area - links to properties page */}
        <Link href="/properties" className="flex items-center gap-3 flex-1">
          <Search className="w-5 h-5 text-[#0B3D2C]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Where to?</p>
            <p className="text-xs text-gray-500">Anywhere · Any week · Add guests</p>
          </div>
        </Link>

        {/* Filter button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFilterClick?.();
          }}
          className="relative w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
          aria-label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""}`}
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#B87333] text-white text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </motion.div>
    </div>
  );
};
