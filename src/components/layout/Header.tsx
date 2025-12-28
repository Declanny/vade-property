"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Globe, User } from "lucide-react";
import Logo from "../ui/Logo";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Logo variant="dark" size="lg" />
            </motion.div>
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/properties">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Browse Properties
              </motion.span>
            </Link>
            <Link href="/about">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                About
              </motion.span>
            </Link>
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Contact
              </motion.span>
            </Link>
          </div>

          {/* Right side menu */}
          <div className="flex items-center gap-2">
            {/* List Property - Hidden on mobile */}
            <Link href="/properties" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-sm font-semibold text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                List your property
              </motion.button>
            </Link>

            {/* Globe Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-5 h-5 text-gray-700" />
            </motion.button>

            {/* User Menu */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4 text-gray-700" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0B3D2C' }}>
                <User className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
