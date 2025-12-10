"use client";

import { motion } from "framer-motion";
import { Home, Search, Calendar, Users } from "lucide-react";

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative h-screen bg-cover bg-center bg-no-repeat rounded-b-[2rem]"
      style={{
        backgroundImage: "url('/propertyhero.png')"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-primary/30 rounded-b-[2rem]"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 w-full"
        >
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left max-w-4xl mb-6"
          >
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
              Verified Properties in Lagos, Nigeria
            </h1>
            <p className="text-base md:text-lg text-white font-black">
              Find lawyer-verified properties with flexible payment plans
            </p>
          </motion.div>

          {/* Compact Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl p-2 shadow-xl max-w-5xl border border-accent"
          >
            <div className="flex flex-col lg:flex-row gap-1">
              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Where are you looking?</label>
                  <input
                    type="text"
                    placeholder="Lagos, Nigeria"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Property Type</label>
                  <input
                    type="text"
                    placeholder="Apartment, House..."
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Move-in Date */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Move-in Date</label>
                  <input
                    type="text"
                    placeholder="Select date"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Bedrooms</label>
                  <input
                    type="text"
                    placeholder="Any"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </motion.div>

          {/* Verified Only Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center text-white mt-4"
          >
            <input
              type="checkbox"
              id="verified-only"
              className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary mr-2"
            />
            <label htmlFor="verified-only" className="text-sm font-medium">
              Show only lawyer-verified properties
            </label>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}