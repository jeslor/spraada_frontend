"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Tool } from "@/store";

interface ImageGalleryProps {
  photos: Tool["toolPhotos"];
  toolName?: string;
}

/**
 * Modern high-performance image gallery component
 * Features:
 * - Smooth transitions with CSS transforms
 * - Keyboard navigation (arrow keys)
 * - Touch/swipe support
 * - Lightbox modal for fullscreen view
 * - Thumbnail strip with smooth scrolling
 * - Lazy loading for performance
 */
export default function ImageGallery({
  photos,
  toolName = "Tool",
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const hasPhotos = photos && photos.length > 0;
  const hasMultiplePhotos = photos && photos.length > 1;

  // Navigate to next/previous image
  const goToNext = useCallback(() => {
    if (!hasMultiplePhotos) return;
    setIsImageLoaded(false);
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  }, [hasMultiplePhotos, photos?.length]);

  const goToPrevious = useCallback(() => {
    if (!hasMultiplePhotos) return;
    setIsImageLoaded(false);
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [hasMultiplePhotos, photos?.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "Escape") setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToNext, goToPrevious]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrevious();
    }
    setTouchStart(null);
  };

  // Empty state
  if (!hasPhotos) {
    return (
      <div className="relative">
        <div className="aspect-4/3 lg:aspect-4/3 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Icon
              icon="solar:gallery-wide-linear"
              className="text-gray-400 dark:text-gray-500"
              width={40}
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            No photos available
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-primary-200/30 dark:border-primary-700">
        {/* Main Image Container */}
        <div
          className="relative group "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image */}
          <div
            className="relative aspect-4/3 lg:aspect-4/3 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Loading skeleton */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}

            {/* Image */}
            <img
              src={photos[selectedIndex]?.photoUrl}
              alt={`${toolName} - Photo ${selectedIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              loading="eager"
            />

            {/* Gradient overlay for better button visibility */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Zoom hint */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon icon="solar:magnifer-zoom-in-linear" width={12} />
              Click to zoom
            </div>

            {/* Photo counter */}
            {hasMultiplePhotos && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-[11px] font-medium">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {hasMultiplePhotos && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white dark:hover:bg-gray-800"
                aria-label="Previous image"
              >
                <Icon
                  icon="solar:alt-arrow-left-bold"
                  width={20}
                  className="text-gray-800 dark:text-gray-200"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white dark:hover:bg-gray-800"
                aria-label="Next image"
              >
                <Icon
                  icon="solar:alt-arrow-right-bold"
                  width={20}
                  className="text-gray-800 dark:text-gray-200"
                />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {hasMultiplePhotos && (
          <div className="flex gap-3 overflow-x-auto py-3 px-2 scrollbar-hide snap-x snap-mandatory bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsImageLoaded(false);
                  setSelectedIndex(idx);
                }}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden snap-start transition-all duration-200 border-2 bg-white dark:bg-gray-800 ${
                  idx === selectedIndex
                    ? "border-primary-500 ring-2 ring-primary-500/30 scale-105 shadow-md"
                    : "border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={photo.photoUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators for mobile (when few photos) */}
        {hasMultiplePhotos && photos.length <= 5 && (
          <div className="flex justify-center gap-1.5 sm:hidden">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "bg-primary-500 w-4"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <Icon
              icon="solar:close-circle-bold"
              className="text-white"
              width={28}
            />
          </button>

          {/* Counter */}
          {hasMultiplePhotos && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {selectedIndex + 1} / {photos.length}
            </div>
          )}

          {/* Main lightbox image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedIndex]?.photoUrl}
              alt={`${toolName} - Photo ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Navigation arrows */}
          {hasMultiplePhotos && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <Icon
                  icon="solar:alt-arrow-left-bold"
                  className="text-white"
                  width={28}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <Icon
                  icon="solar:alt-arrow-right-bold"
                  className="text-white"
                  width={28}
                />
              </button>
            </>
          )}

          {/* Thumbnail strip in lightbox */}
          {hasMultiplePhotos && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full max-w-[90vw] overflow-x-auto">
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className={`shrink-0 w-10 h-10 rounded-md overflow-hidden transition-all border ${
                    idx === selectedIndex
                      ? "border-white ring-1 ring-white/50 scale-110"
                      : "border-white/30 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.photoUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
