"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export const MobileSearchBar = () => {
  return (
    <div className="px-4 py-3 bg-white">
      {/* Search Bar */}
      <Link href="/properties">
        <motion.div
          className="flex items-center gap-3 w-full bg-gray-100 rounded-full px-4 py-3 shadow-sm border border-gray-200"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          <Search className="w-5 h-5 text-[#0B3D2C]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Where to?</p>
            <p className="text-xs text-gray-500">Anywhere · Any week · Add guests</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </div>
        </motion.div>
      </Link>
    </div>
  );
};
