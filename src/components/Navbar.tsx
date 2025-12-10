"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary backdrop-blur-sm rounded-b-[2rem]' : 'bg-primary/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Top Row - Header */}
        <div className={`flex justify-between items-center h-16 transition-all duration-300 ${
          isScrolled ? 'border-b border-primary-light/50' : 'border-b border-white/30'
        }`}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-serif font-bold text-2xl text-white tracking-wide"
          >
            Vade Property
          </motion.div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-white/90 text-sm font-medium">NGN</span>
              <div className="w-7 h-5 bg-white/90 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-primary text-xs font-bold">NG</span>
              </div>
            </div>

            <button className="text-white/90 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
              <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center hover:border-white/60">
                <span className="text-xs font-semibold">?</span>
              </div>
            </button>

            <button className="text-white/90 hover:text-white text-sm font-medium px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200">
              List your property
            </button>

            <button className="text-primary bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
              Register
            </button>

            <button className="text-white border border-white/40 hover:border-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200">
              Sign in
            </button>
          </div>
        </div>

        {/* Bottom Row - Navigation Tabs */}
        <div className="flex justify-center items-center h-14">
          <div className="flex space-x-2">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-6 py-3 rounded-full font-medium text-white transition-all duration-300 cursor-pointer ${
                    index === 0
                      ? 'bg-white/25 border border-white/40 shadow-lg backdrop-blur-sm'
                      : 'hover:bg-white/15 hover:border hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-center py-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-200 p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-primary-dark backdrop-blur-sm border-t border-primary-light"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block px-3 py-2 text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
