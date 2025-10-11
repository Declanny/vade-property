"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Bed, Bath, Square, Star, Calendar, Users } from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Apartment in Los Angeles",
    location: "Downtown LA",
    price: "$264",
    nights: "5 nights",
    rating: 4.95,
    reviews: 21,
    description: "Departamento Mila",
    beds: "2 bedrooms · 3 beds",
    dates: "Oct 1-6",
    image: "/api/placeholder/400/300",
    guestFavorite: true,
  },
  {
    id: 2,
    title: "Home in Beverly Hills",
    location: "Beverly Hills, CA",
    price: "$270",
    nights: "5 nights",
    rating: 4.88,
    reviews: 15,
    description: "Depa San Javier",
    beds: "1 bedroom · 2 beds",
    dates: "Oct 2-7",
    image: "/api/placeholder/400/300",
    guestFavorite: false,
  },
  {
    id: 3,
    title: "Apartment in Santa Monica",
    location: "Santa Monica, CA",
    price: "$202",
    nights: "5 nights",
    rating: 4.92,
    reviews: 8,
    description: "Modern Studio",
    beds: "1 bedroom · 1 bed",
    dates: "Oct 3-8",
    image: "/api/placeholder/400/300",
    guestFavorite: true,
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    location: "West Hollywood, CA",
    price: "$328",
    nights: "5 nights",
    rating: 4.98,
    reviews: 32,
    description: "Penthouse Suite",
    beds: "3 bedrooms · 4 beds",
    dates: "Oct 4-9",
    image: "/api/placeholder/400/300",
    guestFavorite: false,
  },
  {
    id: 5,
    title: "Cozy Studio",
    location: "Venice Beach, CA",
    price: "$172",
    nights: "5 nights",
    rating: 4.85,
    reviews: 12,
    description: "Beach Studio",
    beds: "1 bedroom · 1 bed",
    dates: "Oct 5-10",
    image: "/api/placeholder/400/300",
    guestFavorite: true,
  },
  {
    id: 6,
    title: "Family Home",
    location: "Pasadena, CA",
    price: "$211",
    nights: "5 nights",
    rating: 4.90,
    reviews: 18,
    description: "Family House",
    beds: "2 bedrooms · 3 beds",
    dates: "Oct 6-11",
    image: "/api/placeholder/400/300",
    guestFavorite: false,
  },
];

export default function Properties() {
  return (
    <section id="properties" className="min-h-screen bg-transparent">
      <div className="flex h-screen">
        {/* Left Panel - Property Listings */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Available Properties</h2>
              <p className="text-gray-600">Find the properties that appeal to you the most</p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Main Property Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-6xl">🏠</div>
                    </div>
                    
                    {/* Guest Favorite Badge */}
                    {property.guestFavorite && (
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        Guest favorite
                      </div>
                    )}
                    
                    {/* Heart Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-black mb-1 group-hover:underline text-lg">
                      {property.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-black ml-1">{property.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({property.reviews})</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-1">{property.description}</p>

                    {/* Property Details */}
                    <p className="text-sm text-gray-700 mb-1">{property.beds}</p>
                    <p className="text-sm text-gray-600 mb-2">{property.dates}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-black underline">{property.price}</span>
                        <span className="text-sm text-gray-600 ml-1">for {property.nights}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-1/3 bg-white/90 backdrop-blur-sm relative">
          {/* Map Placeholder */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
              <p className="text-gray-500">Los Angeles Properties</p>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-50">
                <span className="text-sm font-bold">+</span>
              </button>
              <button className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-50">
                <span className="text-sm font-bold">-</span>
              </button>
              <button className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-50">
                <span className="text-xs">⛶</span>
              </button>
            </div>
            
            {/* Price Bubbles on Map */}
            <div className="absolute top-20 left-20 bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold">$264</span>
            </div>
            <div className="absolute top-32 right-16 bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold">$270</span>
            </div>
            <div className="absolute bottom-32 left-16 bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold">$202</span>
            </div>
            <div className="absolute bottom-20 right-20 bg-white rounded-full px-3 py-1 shadow-sm">
              <span className="text-sm font-semibold">$328</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
