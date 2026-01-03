"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Building2,
  Crown,
  Shield,
  Waves,
  TreePalm,
  Sparkles
} from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: typeof Home;
}

const categories: Category[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "shortlet", label: "Shortlets", icon: Calendar },
  { id: "apartment", label: "Apartments", icon: Building2 },
  { id: "house", label: "Houses", icon: Home },
  { id: "luxury", label: "Luxury", icon: Crown },
  { id: "verified", label: "Verified", icon: Shield },
  { id: "beachfront", label: "Beachfront", icon: Waves },
  { id: "tropical", label: "Tropical", icon: TreePalm },
];

interface CategoryTabsProps {
  onCategoryChange?: (categoryId: string) => void;
}

export const CategoryTabs = ({ onCategoryChange }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div
        className="flex gap-6 px-4 py-3 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center gap-1.5 min-w-[56px] pb-2 border-b-2 transition-colors ${
                isActive
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                isActive ? "text-gray-900" : "text-gray-500"
              }`}>
                {category.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
