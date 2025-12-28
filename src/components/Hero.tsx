"use client";

import { motion } from "framer-motion";
import { Home, Search, Calendar, Users } from "lucide-react";

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative h-[40vh] bg-cover bg-center bg-no-repeat rounded-b-[2rem]"
      style={{
        backgroundImage: "url('/propertyhero.png')"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-primary/30 rounded-b-[2rem]"></div>
      
      <div className="relative max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-20 z-10 h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 w-full max-w-4xl"
        >
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              Find Your Perfect Home
            </h1>
            <p className="text-sm md:text-base text-white/90">
              Lawyer-verified properties with flexible payment plans
            </p>
          </motion.div>

          {/* Compact Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-full p-2 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-2">
              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search locations, neighborhoods..."
                  className="w-full text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                />
              </div>

              {/* Search Button */}
              <button className="px-8 py-3 bg-accent hover:bg-accent-light text-white rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}