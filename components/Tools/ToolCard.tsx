"use client";

import { Tool } from "@/types/tool.types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { isFavorite, isToolOwnedByUser } from "@/store/tool/tool.selectors";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "compact" | "rental" | "borrowed";
  onDelete?: (toolId: Tool) => void;
  onRent?: (toolId: Tool) => void;
  showOwner?: boolean;
  isDeleting?: boolean;
}

// Format cents to dollars
//Move this to a utils file later if reused elsewhere
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

// Compact variant - Airbnb-style grid listing
const CompactCard = ({ tool }: { tool: Tool }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const photos = tool.toolPhotos || [];
  const hasMultiplePhotos = photos.length > 1;

  return (
    <Link href={`/tools/${tool.id}`} className="group block">
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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                icon="solar:box-linear"
                className="text-gray-300"
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
                className="text-gray-900"
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

// Rental/Borrowed variant - horizontal card
const RentalCard = ({
  tool,
  variant,
}: {
  tool: Tool;
  variant: "rental" | "borrowed";
}) => {
  const isRental = variant === "rental";
  const photo = tool.toolPhotos?.[0];

  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {photo ? (
          <img src={photo.photoUrl} alt={tool.name} className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              icon="solar:box-linear"
              className="text-gray-300"
              width={32}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isRental
                  ? "bg-primary-100 text-primary-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isRental ? "Renting Out" : "Borrowed"}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 truncate">{tool.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Icon icon="solar:user-linear" width={14} />
            {isRental ? "Rented to: John D." : "From: Sarah M."}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Icon icon="solar:calendar-linear" width={14} />
            Ends in 3 days
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(tool.dailyPriceCents)}/day
          </span>
        </div>
      </div>
    </Link>
  );
};

// Default variant - Full featured toolbox card
const DefaultCard = ({
  tool,
  onDelete,
  isDeleting,
}: {
  tool: Tool;
  onDelete?: (toolId: Tool) => void;
  isDeleting?: boolean;
}) => {
  const isOwnedByUser = isToolOwnedByUser(tool);
  const isFavoriteTool = isFavorite(tool.id);

  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFavoriteWorking, setIsFavoriteWorking] = useState(false);

  const photos = tool.toolPhotos || [];
  const hasMultiplePhotos = photos.length > 1;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showDeleteConfirm && onDelete) {
      onDelete(tool);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    setIsFavoriteWorking(true);
    e.preventDefault();
    e.stopPropagation();
    // Implement favorite logic here
    setIsFavoriteWorking(false);
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDeleteConfirm(false);
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
        {photos.length > 0 ? (
          <img
            src={
              (photos[imageIndex]?.photoUrl as string) ||
              "/placeholder-tool.png"
            }
            alt={tool.name}
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              icon="solar:box-linear"
              className="text-gray-300"
              width={64}
            />
          </div>
        )}

        {/* overlay top section */}
        <div className="absolute top-0 left-0 z-2 w-full h-20 bg-linear-to-b from-black/10 to-transparent"></div>

        {/* Top Bar */}
        <div className="absolute z-20 top-0 left-0 right-0 p-3 flex items-center justify-between">
          {/* Status Badge */}
          <div
            className={`px-2.5 py-1 rounded-full text-[8px] font-semibold ${
              tool.available
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tool.available ? "Available" : "Unavailable"}
          </div>
        </div>

        {/* Quick Actions - on hover */}
        <div
          className={`absolute  right-3 top-2 flex  gap-2 transition-all duration-200 z-20 ${
            isHovered || !isOwnedByUser
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {isOwnedByUser ? (
            <>
              <Link
                href={`/toolbox/edit/${tool.id}`}
                className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-50 transition-colors"
              >
                <Icon
                  icon="solar:pen-linear"
                  className="text-gray-700"
                  width={15}
                />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`size-7 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer ${
                  showDeleteConfirm
                    ? "bg-red-500 text-white"
                    : "bg-primary-100 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isDeleting ? (
                  <Icon
                    icon="solar:refresh-bold"
                    className="animate-spin"
                    width={15}
                  />
                ) : (
                  <Icon icon="solar:trash-bin-2-linear" width={18} />
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleFavorite}
              disabled={isFavoriteWorking}
              className="relative rounded-full flex items-center justify-center
             transition cursor-pointer hover:text-[37px] transition-text text-[35px]"
            >
              {/* White outline (always visible) */}
              <Icon icon="fe:heart-o" className="absolute z-2 text-white " />

              {/* Fill */}
              <Icon
                icon="fe:heart"
                className={` ${
                  isFavoriteTool ? "text-primary-500 " : "text-black/20 "
                }`}
              />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex(
                  (prev) => (prev - 1 + photos.length) % photos.length
                );
              }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 size-6 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Icon
                icon="solar:alt-arrow-left-linear"
                width={14}
                className="text-gray-800"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prev) => (prev + 1) % photos.length);
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 size-6 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Icon
                icon="solar:alt-arrow-right-linear"
                width={14}
                className="text-gray-800"
              />
            </button>
          </>
        )}

        {/* Photo Dots */}
        {hasMultiplePhotos && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                  idx === imageIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
            {photos.length > 5 && (
              <span className="text-white/80 text-xs ml-1">
                +{photos.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 border-t border-gray-100">
        {/* Category & Title */}
        <div>
          <span className="text-[9px] font-medium text-primary-600 uppercase tracking-wide">
            {tool.category || "Uncategorized"}
          </span>
          <Link
            href={`/toolbox/${tool.id}`}
            className="font-semibold text-gray-900 text-[14px]  line-clamp-1 group-hover:text-primary-600 transition-colors"
          >
            {tool.name}
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(tool.dailyPriceCents)}
            </span>
            <span className="text-gray-500 text-sm"> / day</span>
          </div>

          <Link
            href={`/toolbox/${tool.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-100 rounded-lg"
          >
            <Icon
              icon="lsicon:view-outline"
              className="text-primary-600"
              width={18}
            />
            <span className="text-xs font-medium text-primary-700">
              view tool
            </span>
          </Link>
        </div>
      </div>

      {/* Delete Confirm Toast */}
      {showDeleteConfirm && (
        <div className="absolute bottom-4 right-4 px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-lg shadow-lg">
          Click again to delete
        </div>
      )}
    </div>
  );
};

// Main ToolCard component
export const ToolCard = ({
  tool,
  variant = "default",
  onDelete,
  isDeleting,
}: ToolCardProps) => {
  switch (variant) {
    case "compact":
      return <CompactCard tool={tool} />;
    case "rental":
    case "borrowed":
      return <RentalCard tool={tool} variant={variant} />;
    default:
      return (
        <DefaultCard tool={tool} onDelete={onDelete} isDeleting={isDeleting} />
      );
  }
};

export default ToolCard;
