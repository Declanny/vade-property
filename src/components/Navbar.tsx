"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, Globe, User } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
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

          {/* Center Search - Hidden on mobile, shown on larger screens */}
          <Link href="/properties" className="hidden lg:block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 px-6 py-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-sm font-semibold text-gray-800">Anywhere</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-800">Any week</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">Add guests</span>
              <div className="bg-accent text-white p-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          </Link>

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
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
