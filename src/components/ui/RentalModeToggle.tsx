"use client";

import React from "react";
import { motion } from "framer-motion";
import { RentalMode } from "@/lib/types";

export interface RentalModeToggleProps {
  value: RentalMode;
  onChange: (mode: RentalMode) => void;
  size?: "sm" | "lg";
  className?: string;
}

const options: { value: RentalMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "shortlet", label: "Shortlets" },
  { value: "long_term", label: "Long-term" },
];

export const RentalModeToggle: React.FC<RentalModeToggleProps> = ({
  value,
  onChange,
  size = "sm",
  className = "",
}) => {
  const sizeStyles = {
    sm: {
      container: "p-1",
      button: "px-3 py-1.5 text-xs",
    },
    lg: {
      container: "p-1.5",
      button: "px-5 py-2.5 text-sm",
    },
  };

  return (
    <div
      className={`inline-flex items-center bg-gray-100 rounded-full ${sizeStyles[size].container} ${className}`}
      role="radiogroup"
      aria-label="Rental mode filter"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`relative ${sizeStyles[size].button} font-medium rounded-full transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="rental-mode-indicator"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "#B87333" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
