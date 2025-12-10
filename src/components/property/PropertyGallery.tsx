"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface PropertyGalleryProps {
  images: string[];
  alt: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, alt }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const placeholderImage = (
    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-6xl">
      🏠
    </div>
  );

  if (images.length === 0) {
    return (
      <div className="w-full rounded-[var(--radius-button)] overflow-hidden">
        <div className="aspect-[16/9]">{placeholderImage}</div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 rounded-[var(--radius-button)] overflow-hidden">
        {/* Main Image - spans 2 columns and 2 rows */}
        <div
          className="col-span-4 md:col-span-2 md:row-span-2 aspect-square md:aspect-auto cursor-pointer overflow-hidden group"
          onClick={() => openLightbox(0)}
        >
          <div
            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-300"
            style={{
              backgroundImage: images[0] ? `url(${images[0]})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!images[0] && placeholderImage}
          </div>
        </div>

        {/* Smaller Images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="col-span-2 md:col-span-1 aspect-square cursor-pointer overflow-hidden group relative"
            onClick={() => openLightbox(index + 1)}
          >
            <div
              className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-300"
              style={{
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!image && placeholderImage}
            </div>

            {/* "View all" overlay on last image if there are more images */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold backdrop-blur-sm">
                +{images.length - 5} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div
              className="max-w-6xl max-h-full w-full h-full bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: images[selectedIndex] ? `url(${images[selectedIndex]})` : undefined,
              }}
            >
              {!images[selectedIndex] && placeholderImage}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
