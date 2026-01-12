"use client";

import React from "react";

interface ToolCardSkeletonProps {
  variant?: "default" | "compact";
  fullWidth?: boolean;
}

const ToolCardSkeleton = ({
  variant = "default",
  fullWidth = false,
}: ToolCardSkeletonProps) => {
  if (variant === "compact") {
    return (
      <div className="bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden animate-pulse">
        {/* Image skeleton */}
        <div className="aspect-4/3 bg-primary-100 dark:bg-primary-800" />

        {/* Content skeleton */}
        <div className="p-3 space-y-2">
          <div className="h-5 bg-primary-100 dark:bg-primary-800 rounded w-3/4" />
          <div className="h-4 bg-primary-100 dark:bg-primary-800 rounded w-1/2" />
          <div className="h-6 bg-primary-100 dark:bg-primary-800 rounded w-1/3 mt-2" />
        </div>
      </div>
    );
  }

  if (fullWidth) {
    // Skeleton for full-width rental/borrowed cards
    return (
      <div className="w-full bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden animate-pulse flex flex-wrap gap-5 p-5 min-h-[180px]">
        {/* Image section */}
        <div className="w-full sm:w-48 h-48 shrink-0 rounded-lg bg-primary-100 dark:bg-primary-800" />
        {/* Content section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="h-6 bg-primary-100 dark:bg-primary-800 rounded w-1/3 mb-2" />
          <div className="h-5 bg-primary-100 dark:bg-primary-800 rounded w-1/2 mb-2" />
          <div className="h-4 bg-primary-100 dark:bg-primary-800 rounded w-1/4 mb-2" />
          <div className="h-4 bg-primary-100 dark:bg-primary-800 rounded w-1/3 mb-2" />
          <div className="h-8 bg-primary-100 dark:bg-primary-800 rounded w-1/2 mt-4" />
        </div>
      </div>
    );
  }

  // Default variant skeleton
  return (
    <div className="bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-4/3 bg-primary-100 dark:bg-primary-800 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category tag */}
        <div className="h-5 bg-primary-100 dark:bg-primary-800 rounded w-20" />

        {/* Title */}
        <div className="h-6 bg-primary-100 dark:bg-primary-800 rounded w-4/5" />

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-4 bg-primary-100 dark:bg-primary-800 rounded w-full" />
          <div className="h-4 bg-primary-100 dark:bg-primary-800 rounded w-2/3" />
        </div>

        {/* Price section */}
        <div className="pt-4 border-t border-primary-100 dark:border-primary-800">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="h-7 bg-primary-100 dark:bg-primary-800 rounded w-24" />
              <div className="h-3 bg-primary-100 dark:bg-primary-800 rounded w-16" />
            </div>
            <div className="h-9 bg-primary-100 dark:bg-primary-800 rounded w-24" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4">
          <div className="h-3 bg-primary-100 dark:bg-primary-800 rounded w-28" />
        </div>
      </div>
    </div>
  );
};

interface ToolsSkeletonGridProps {
  count?: number;
  variant?: "default" | "compact";
  fullWidth?: boolean;
}

export default function ToolsSkeletonGrid({
  count = 6,
  variant = "default",
  fullWidth = false,
}: ToolsSkeletonGridProps) {
  if (fullWidth) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ToolCardSkeleton key={index} variant={variant} fullWidth />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-3 gap-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <ToolCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}

export { ToolCardSkeleton };
