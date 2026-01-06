"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Tool } from "@/store";
import { getAllTools } from "@/lib/actions/tools.actions";

// Format cents to dollars
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

// Compact Tool Card for the grid
const ToolGridCard = ({ tool }: { tool: Tool }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const photos = tool.toolPhotos || [];
  const hasMultiplePhotos = photos.length > 1;

  return (
    <Link href={`/toolbox/view/${tool.id}`} className="group block">
      <div
        className="space-y-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
          {photos.length > 0 ? (
            <img
              src={photos[imageIndex]?.photoUrl || "/placeholder-tool.png"}
              alt={tool.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100">
              <Icon
                icon="solar:box-bold-duotone"
                className="text-primary-300"
                width={48}
              />
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-1.5 hover:scale-110 transition-transform"
          >
            <Icon
              icon="solar:heart-linear"
              className="text-white drop-shadow-md"
              width={24}
            />
          </button>

          {/* Availability Badge */}
          {!tool.available && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
              Unavailable
            </div>
          )}

          {/* Image Navigation Dots */}
          {hasMultiplePhotos && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === imageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultiplePhotos && isHovered && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageIndex(
                    (prev) => (prev - 1 + photos.length) % photos.length
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
              >
                <Icon
                  icon="solar:alt-arrow-left-linear"
                  width={16}
                  className="text-gray-800"
                />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageIndex((prev) => (prev + 1) % photos.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
              >
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width={16}
                  className="text-gray-800"
                />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">{tool.name}</h3>
            <div className="flex items-center gap-1 text-gray-900">
              <Icon
                icon="solar:star-bold"
                className="text-amber-500"
                width={14}
              />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 truncate">{tool.category}</p>
          <p className="text-sm text-gray-900">
            <span className="font-semibold">
              {formatPrice(tool.dailyPriceCents)}
            </span>
            <span className="text-gray-500"> / day</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton
const ToolCardSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="aspect-square rounded-xl bg-gray-200" />
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-8" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

interface FeaturedToolsProps {
  initialTools?: Tool[];
}

export const FeaturedTools = ({ initialTools }: FeaturedToolsProps) => {
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [isLoading, setIsLoading] = useState(!initialTools);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTools) {
      fetchTools();
    }
  }, [initialTools]);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllTools(12);
      // Shuffle and take random tools
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setTools(shuffled.slice(0, 12));
    } catch (err) {
      setError("Failed to load tools");
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-8 w-full max-w-[1400px] mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Discover Tools Near You
          </h2>
          <p className="text-gray-500 mt-1">
            Browse tools available in your community
          </p>
        </div>
        <Link
          href="/browse"
          className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          View All
          <Icon icon="solar:arrow-right-linear" width={18} />
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Icon
            icon="solar:danger-triangle-bold-duotone"
            className="text-amber-500 mx-auto mb-4"
            width={48}
          />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTools}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Tools Grid */}
      {!isLoading && !error && tools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolGridCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && tools.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Icon
              icon="solar:box-bold-duotone"
              className="text-primary-500"
              width={40}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Tools Available Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Be the first to share your tools with the community!
          </p>
          <Link
            href="/toolbox/add"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Icon icon="solar:add-circle-bold" width={20} />
            List Your First Tool
          </Link>
        </div>
      )}

      {/* Mobile View All Link */}
      {!isLoading && !error && tools.length > 0 && (
        <div className="flex sm:hidden justify-center mt-6">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View All Tools
            <Icon icon="solar:arrow-right-linear" width={18} />
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedTools;
