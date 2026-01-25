"use client";
import { formatPrice } from "@/lib/helpers/dateHelpers";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { useState } from "react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { isFavorite, isToolOwnedByUser, Tool } from "@/store";

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    setIsFavoriteWorking(true);
    e.preventDefault();
    e.stopPropagation();
    // Implement favorite logic here
    setIsFavoriteWorking(false);
  };

  const handleNavigatePreviousPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNavigateNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % photos.length);
  };

  const handleTheCurrentPhoto = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex(idx);
  };

  return (
    <Link
      href={`/toolbox/view/${tool.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDeleteConfirm(false);
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden ">
        {photos.length > 0 ? (
          <img
            src={
              (photos[imageIndex]?.photoUrl as string) ||
              "/placeholder-tool.png"
            }
            alt={tool.name}
            className="object-cover transition-opacity duration-300 h-full w-full object-top"
            sizes=""
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
        <div className="absolute top-0 left-0 z-2 w-full h-20 bg-linear-to-b from-black/30 to-transparent"></div>

        {/* overlay bottom section */}
        <div className="absolute bottom-0 left-0 z-2 w-full h-15 bg-linear-to-t from-black/30 to-transparent"></div>

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
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="size-7 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer bg-primary-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
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
              onClick={(e) => handleNavigatePreviousPhoto(e)}
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
              onClick={(e) => handleNavigateNextPhoto(e)}
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
                onClick={(e) => handleTheCurrentPhoto(e, idx)}
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
            href={`/toolbox/view/${tool.id}`}
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
            href={`/toolbox/view/${tool.id}`}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        itemName={tool.name}
        itemType="Tool"
        isDeleting={isDeleting}
        onConfirm={() => onDelete?.(tool)}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </Link>
  );
};
export default DefaultCard;
