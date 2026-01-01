"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tool, RentalInfo } from "@/types/tool.types";
import { SpraadaButton } from "@/components/ui/SpraadaButton";

export type ToolCardVariant = "default" | "compact" | "rental" | "borrowed";

interface ToolCardProps {
  tool: Tool;
  variant?: ToolCardVariant;
  rentalInfo?: RentalInfo;
  onEdit?: (tool: Tool) => void;
  onDelete?: (tool: Tool) => void;
  onRent?: (tool: Tool) => void;
  showOwner?: boolean;
  className?: string;
}

// Format cents to dollars
const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

// Get status badge styles
const getStatusStyles = (status: RentalInfo["status"]) => {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed:
      "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return styles[status];
};

// Get status icon
const getStatusIcon = (status: RentalInfo["status"]) => {
  const icons = {
    pending: "solar:clock-circle-bold",
    confirmed: "solar:check-circle-bold",
    active: "solar:play-circle-bold",
    completed: "solar:verified-check-bold",
    cancelled: "solar:close-circle-bold",
  };
  return icons[status];
};

export default function ToolCard({
  tool,
  variant = "default",
  rentalInfo,
  onEdit,
  onDelete,
  onRent,
  showOwner = false,
  className = "",
}: ToolCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryPhoto = tool.toolPhotos?.[0]?.photoUrl as string | undefined;
  const photoCount = tool.toolPhotos?.length || 0;

  // Compact variant for grid lists
  if (variant === "compact") {
    return (
      <Link
        href={`/tools/${tool.id}`}
        className={`group block bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 ${className}`}
      >
        {/* Image */}
        <div className="relative aspect-4/3 bg-primary-100 dark:bg-primary-800 overflow-hidden">
          {primaryPhoto && !imageError ? (
            <Image
              src={primaryPhoto}
              alt={tool.name}
              fill
              //   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400pxs"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              //   unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon
                icon="solar:tools-bold-duotone"
                className="text-primary-300 dark:text-primary-600"
                width={48}
              />
            </div>
          )}
          {/* Availability badge */}
          {!tool.available && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              Unavailable
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-primary-800 dark:text-primary-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-primary-500 dark:text-primary-400 mt-0.5">
            {tool.category}
          </p>
          <p className="text-lg font-bold text-primary-700 dark:text-primary-200 mt-2">
            {formatPrice(tool.dailyPriceCents)}
            <span className="text-sm font-normal text-primary-400">/day</span>
          </p>
        </div>
      </Link>
    );
  }

  // Rental/Borrowed variant with status info
  if (variant === "rental" || variant === "borrowed") {
    return (
      <div
        className={`bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden hover:shadow-md transition-shadow ${className}`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-primary-100 dark:bg-primary-800 shrink-0">
            {primaryPhoto && !imageError ? (
              <Image
                src={primaryPhoto}
                alt={tool.name}
                fill
                sizes="160px"
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon
                  icon="solar:tools-bold-duotone"
                  className="text-primary-300 dark:text-primary-600"
                  width={40}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/tools/${tool.id}`}
                  className="font-semibold text-primary-800 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                >
                  {tool.name}
                </Link>
                <p className="text-sm text-primary-500 dark:text-primary-400">
                  {tool.category}
                </p>
              </div>

              {/* Status badge */}
              {rentalInfo && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusStyles(
                    rentalInfo.status
                  )}`}
                >
                  <Icon icon={getStatusIcon(rentalInfo.status)} width={14} />
                  <span className="capitalize">{rentalInfo.status}</span>
                </div>
              )}
            </div>

            {/* Rental details */}
            {rentalInfo && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
                  <Icon icon="solar:calendar-bold" width={16} />
                  <span>
                    {new Date(rentalInfo.startDate).toLocaleDateString()} -{" "}
                    {new Date(rentalInfo.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-300 font-medium">
                  <Icon icon="solar:wallet-bold" width={16} />
                  <span>{formatPrice(rentalInfo.totalCents)}</span>
                </div>
              </div>
            )}

            {/* Owner info */}
            {showOwner && tool.profile && variant === "borrowed" && (
              <div className="mt-3 flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400">
                <div className="w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-700 overflow-hidden">
                  {tool.profile.avatarUrl ? (
                    <Image
                      src={tool.profile.avatarUrl}
                      alt={`${tool.profile.firstName}`}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-300">
                      {tool.profile.firstName?.[0]}
                    </div>
                  )}
                </div>
                <span>
                  Owned by {tool.profile.firstName} {tool.profile.lastName?.[0]}
                  .
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full card for toolbox
  return (
    <div
      className={`group bg-white dark:bg-primary-900 rounded-xl border border-primary-100 dark:border-primary-800 overflow-hidden hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section */}
      <div className="relative aspect-4/3 bg-primary-100 dark:bg-primary-800 overflow-hidden">
        {primaryPhoto && !imageError ? (
          <Image
            src={primaryPhoto}
            alt={tool.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              icon="solar:tools-bold-duotone"
              className="text-primary-300 dark:text-primary-600"
              width={64}
            />
          </div>
        )}

        {/* Photo count badge */}
        {photoCount > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            <Icon icon="solar:gallery-bold" width={14} />
            {photoCount}
          </div>
        )}

        {/* Availability badge */}
        <div
          className={`absolute top-2 left-2 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 ${
            tool.available ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <Icon
            icon={
              tool.available
                ? "solar:check-circle-bold"
                : "solar:close-circle-bold"
            }
            width={14}
          />
          {tool.available ? "Available" : "Unavailable"}
        </div>

        {/* Quick actions overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href={`/tools/${tool.id}`}
            className="p-2.5 bg-white rounded-full hover:bg-primary-50 transition-colors shadow-lg"
            title="View details"
          >
            <Icon
              icon="solar:eye-bold"
              className="text-primary-700"
              width={20}
            />
          </Link>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onEdit(tool);
              }}
              className="p-2.5 bg-white rounded-full hover:bg-primary-50 transition-colors shadow-lg cursor-pointer"
              title="Edit tool"
            >
              <Icon
                icon="solar:pen-bold"
                className="text-primary-700"
                width={20}
              />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onDelete(tool);
              }}
              className="p-2.5 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg cursor-pointer"
              title="Delete tool"
            >
              <Icon
                icon="solar:trash-bin-trash-bold"
                className="text-red-600"
                width={20}
              />
            </button>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Category tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-800 px-2 py-0.5 rounded">
            {tool.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-primary-800 dark:text-primary-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-primary-500 dark:text-primary-400 mt-1 line-clamp-2">
          {tool.description.replace(/<[^>]*>/g, "")}
        </p>

        {/* Price info */}
        <div className="mt-4 pt-4 border-t border-primary-100 dark:border-primary-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-200">
                {formatPrice(tool.dailyPriceCents)}
                <span className="text-sm font-normal text-primary-400">
                  /day
                </span>
              </p>
              <p className="text-xs text-primary-400 mt-0.5">
                Deposit: {formatPrice(tool.depositCents)}
              </p>
            </div>

            {onRent && tool.available && (
              <SpraadaButton
                variant="primary"
                size="sm"
                rightIcon="solar:arrow-right-linear"
                onClick={() => onRent(tool)}
              >
                Rent Now
              </SpraadaButton>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 text-xs text-primary-400">
          <div className="flex items-center gap-1">
            <Icon icon="solar:calendar-date-bold" width={14} />
            <span>Added {new Date(tool.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
