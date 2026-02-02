"use client";
import { formatPrice } from "@/lib/helpers/dateHelpers";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { use, useEffect, useState } from "react";
import {
  Tool,
  useProfile,
  useToolIsFavorited,
  useUpdateProfileFavoriteTools,
} from "@/store";
import { updateFavoriteTools } from "@/lib/actions/profile.actions";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const CompactCard = ({ tool }: { tool: Tool }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const photos = tool.toolPhotos || [];
  const hasMultiplePhotos = photos.length > 1;

  const profile = useProfile();
  const updateProfileFavoriteTools = useUpdateProfileFavoriteTools();
  const toolIsFavorited = useToolIsFavorited();

  useEffect(() => {
    if (profile && tool) {
      const isFavorited = toolIsFavorited(tool.id);

      setFavoriteStatus(isFavorited);
    }
  }, [profile, tool]);

  const handleIsFavoritedChange = async (
    toolId: string,
    favorited: boolean,
  ) => {
    if (!profile) {
      toast.error("You must be logged in to favorite tools");
      return redirect("/signin");
    }
    setFavoriteStatus(favorited);

    const updatedProfile = await updateFavoriteTools(
      profile!.id,
      toolId,
      favorited ? "add" : "remove",
    );
    if (!updatedProfile.success) {
      toast.error(updatedProfile.error || "Failed to update favorite tools");
      return;
    }
    //updateProfile store state
    updateProfileFavoriteTools(updatedProfile.data!.favoriteTools || []);
  };

  return (
    <Link
      href={`/toolbox/view/${tool.id}`}
      className="group block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all overflow-hidden"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {photos.length > 0 ? (
            <img
              src={photos[imageIndex]?.photoUrl || "/placeholder-tool.png"}
              alt={tool.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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

          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 z-1 w-full h-16 bg-linear-to-b from-black/30 to-transparent pointer-events-none" />

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 z-1 w-full h-12 bg-linear-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Status Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                tool.available
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tool.available ? "Available" : "Unavailable"}
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleIsFavoritedChange(tool.id, !favoriteStatus);
            }}
            className="absolute top-2.5 right-2.5 z-10 hover:scale-110 transition-transform"
          >
            <span className="relative text-[28px] flex items-center justify-center">
              <Icon icon="fe:heart-o" className="absolute z-2 text-white" />
              <Icon
                icon="fe:heart"
                className={
                  favoriteStatus ? "text-primary-500" : "text-black/20"
                }
              />
            </span>
          </button>

          {/* Image Navigation Dots */}
          {hasMultiplePhotos && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {photos.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                    idx === imageIndex
                      ? "w-3 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
              {photos.length > 5 && (
                <span className="text-white/80 text-[10px] ml-0.5">
                  +{photos.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultiplePhotos && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageIndex(
                    (prev) => (prev - 1 + photos.length) % photos.length,
                  );
                }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 z-10 ${
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
                  e.preventDefault();
                  e.stopPropagation();
                  setImageIndex((prev) => (prev + 1) % photos.length);
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 z-10 ${
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
        </div>

        {/* Content */}
        <div className="p-3 space-y-1.5">
          {/* Category */}
          <span className="text-[10px] font-medium text-primary-600 uppercase tracking-wide">
            {tool.category || "Uncategorized"}
          </span>

          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
              {tool.name}
            </h3>
            <div className="flex items-center gap-0.5 text-gray-900 shrink-0">
              <Icon
                icon="solar:star-bold"
                className="text-amber-400"
                width={12}
              />
              <span className="text-xs font-medium">4.8</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(tool.dailyPriceCents)}
            </span>
            <span className="text-gray-500 text-xs"> / day</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default CompactCard;
