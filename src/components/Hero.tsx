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
      <div className="absolute inset-0 bg-blue-900/30 rounded-b-[2rem]"></div>
      
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
              Properties in Los Angeles
            </h1>
            <p className="text-base md:text-lg text-white font-black">
              Find the properties that appeal to you the most
            </p>
          </motion.div>

          {/* Compact Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl p-2 shadow-xl max-w-5xl border border-yellow-400"
          >
            <div className="flex flex-col lg:flex-row gap-1">
              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Where are you going?</label>
                  <input
                    type="text"
                    placeholder="Los Angeles, CA"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Check-in Date */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Check-in</label>
                  <input
                    type="text"
                    placeholder="Add dates"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Check-out</label>
                  <input
                    type="text"
                    placeholder="Add dates"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Guests</label>
                  <input
                    type="text"
                    placeholder="2 adults · 1 room"
                    className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </motion.div>

          {/* Work Travel Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center text-white mt-4"
          >
            <input
              type="checkbox"
              id="work-travel"
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 mr-2"
            />
            <label htmlFor="work-travel" className="text-sm font-medium">
              I&apos;m travelling for work
            </label>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}