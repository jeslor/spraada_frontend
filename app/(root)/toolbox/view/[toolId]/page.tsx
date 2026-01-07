"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Tool } from "@/store";
import { getToolById } from "@/lib/actions/tools.actions";
import { useProfile, useToolById } from "@/store";
import LoadingUI from "@/components/ui/Loading";
import ImageGallery from "@/components/Tools/ImageGallery";
import ViewToolError from "@/components/Tools/ViewToolError";

// Format cents to currency
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export default function ViewToolPage() {
  const params = useParams();
  const router = useRouter();
  const profile = useProfile();
  const toolId = params.toolId as string;
  const toolFromStore = useToolById(toolId);

  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isOwner = profile && tool && tool.profileId === profile.id;

  // Fetch tool data - always fetch from API to ensure complete data with profile
  const fetchTool = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Always fetch from API to get complete data including profile
      const fetchedTool = await getToolById(toolId);
      if (!fetchedTool) {
        setError("Tool not found");
        return;
      }
      setTool(fetchedTool);
    } catch (err) {
      console.error("Failed to fetch tool:", err);
      // Fallback to store data if API fails
      if (toolFromStore) {
        setTool(toolFromStore);
      } else {
        setError("Failed to load tool");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toolId) fetchTool();
  }, [toolId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingUI />
      </div>
    );
  }

  // Error state
  if (error || !tool) {
    return <ViewToolError />;
  }

  const descriptionLength = tool.description?.length || 0;
  const shouldTruncateDescription = descriptionLength > 400;

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-4  lg:px-8">
      {/* Header - Back button & Actions */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 -mx-4 px-4 lg:-mx-8 lg:px-8 py-3 mb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2.5 rounded-full transition-all ${
                isFavorited
                  ? "bg-red-50 dark:bg-red-900/30 text-red-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Icon
                icon={isFavorited ? "solar:heart-bold" : "solar:heart-linear"}
                width={20}
              />
            </button>
            <button
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Share tool"
            >
              <Icon icon="solar:share-linear" width={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Image Gallery */}
            <ImageGallery photos={tool.toolPhotos} toolName={tool.name} />

            {/* Mobile: Quick Info Card */}
            <div className="lg:hidden">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full mb-1.5">
                      {tool.category}
                    </span>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </h1>
                  </div>
                  <div
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      tool.available
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {tool.available ? "Available" : "Unavailable"}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(tool.dailyPriceCents)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / day
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <section>
              <h2 className="text-[24px] font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon
                  icon="solar:document-text-linear"
                  className="text-primary-500"
                  width={18}
                />
                About this tool
              </h2>
              <div className="relative bg-white py-6 px-4 dark:bg-gray-800 rounded-lg border border-primary-200/30 dark:border-primary-700 overflow-hidden">
                <div
                  className={`prose prose-sm prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-[14px] leading-7
                    prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
                    prose-strong:text-gray-800 dark:prose-strong:text-gray-200
                    prose-a:text-primary-600 dark:prose-a:text-primary-400
                    ${
                      !showFullDescription && shouldTruncateDescription
                        ? "line-clamp-7"
                        : ""
                    }`}
                  dangerouslySetInnerHTML={{ __html: tool.description }}
                />
                {shouldTruncateDescription && (
                  <>
                    {!showFullDescription && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
                    )}
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="relative mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                    >
                      {showFullDescription ? (
                        <>
                          <Icon
                            icon="solar:minimize-square-linear"
                            width={16}
                          />
                          Show less
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="solar:maximize-square-linear"
                            width={16}
                          />
                          Read more
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* Specifications Grid */}
            <section className="bg-white py-5 px-4 rounded-2xl border border-primary-200/30 dark:border-primary-700 shadow-sm space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon
                  icon="solar:widget-linear"
                  className="text-primary-500"
                  width={18}
                />
                Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                  <Icon
                    icon="solar:tag-price-linear"
                    className="mx-auto mb-1.5 text-primary-500"
                    width={20}
                  />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    Daily Rate
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(tool.dailyPriceCents)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                  <Icon
                    icon="solar:shield-check-linear"
                    className="mx-auto mb-1.5 text-primary-500"
                    width={20}
                  />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    Deposit
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(tool.depositCents)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                  <Icon
                    icon="solar:dollar-minimalistic-linear"
                    className="mx-auto mb-1.5 text-primary-500"
                    width={20}
                  />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    Value
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(tool.replacementValue)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                  <Icon
                    icon="solar:calendar-linear"
                    className="mx-auto mb-1.5 text-primary-500"
                    width={20}
                  />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                    Listed
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {formatDate(tool.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            {/* Rental Information */}
            <section className="p-4 bg-linear-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl border border-primary-100 dark:border-primary-800/30">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon
                  icon="solar:info-circle-linear"
                  className="text-primary-600"
                  width={16}
                />
                Rental Information
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="text-primary-600 shrink-0 mt-0.5"
                    width={14}
                  />
                  <span>
                    Flexible rental periods available - daily, weekly, or
                    monthly
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="text-primary-600 shrink-0 mt-0.5"
                    width={14}
                  />
                  <span>
                    Security deposit of {formatPrice(tool.depositCents)}{" "}
                    required, fully refundable
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="text-primary-600 shrink-0 mt-0.5"
                    width={14}
                  />
                  <span>Secure payment processing with buyer protection</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="text-primary-600 shrink-0 mt-0.5"
                    width={14}
                  />
                  <span>
                    Coordinate pickup/delivery directly with the owner
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Sticky Booking Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24">
              <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-200/50 dark:shadow-none">
                {/* Title & Category */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full">
                      {tool.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        tool.available
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {tool.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {tool.name}
                  </h1>
                </div>

                {/* Price */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(tool.dailyPriceCents)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-base">
                      / day
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon
                        icon="solar:shield-check-linear"
                        width={14}
                        className="text-green-500"
                      />
                      {formatPrice(tool.depositCents)} deposit
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2.5 mb-5">
                  {isOwner ? (
                    <>
                      {/* Owner Actions */}
                      <Link
                        href={`/toolbox/edit/${tool.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <Icon icon="solar:pen-bold" width={16} />
                        Edit Tool Listing
                      </Link>
                      <button
                        className={`flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-lg transition-all border-2 ${
                          tool.available
                            ? "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                            : "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                        }`}
                      >
                        <Icon
                          icon={
                            tool.available
                              ? "solar:clock-circle-bold"
                              : "solar:check-circle-bold"
                          }
                          width={16}
                        />
                        {tool.available
                          ? "Mark as Unavailable"
                          : "Mark as Available"}
                      </button>
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 font-medium rounded-lg transition-all">
                        <Icon icon="solar:chart-2-linear" width={16} />
                        View Analytics
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Non-Owner Actions */}
                      <button
                        disabled={!tool.available}
                        className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-lg transition-all ${
                          tool.available
                            ? "bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/25"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Icon icon="solar:hand-shake-bold" width={18} />
                        {tool.available
                          ? "Request to Borrow"
                          : "Currently Unavailable"}
                      </button>
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold rounded-lg transition-all">
                        <Icon icon="solar:chat-round-dots-bold" width={16} />
                        Message Owner
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsFavorited(!isFavorited)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all border ${
                            isFavorited
                              ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <Icon
                            icon={
                              isFavorited
                                ? "solar:heart-bold"
                                : "solar:heart-linear"
                            }
                            width={14}
                          />
                          {isFavorited ? "Saved" : "Save"}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <Icon icon="solar:share-linear" width={14} />
                          Share
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <Icon icon="solar:flag-linear" width={14} />
                          Report
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-700 my-5" />

                {/* Owner Section */}
                <div>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Listed by
                  </p>
                  {tool.profile ? (
                    <Link
                      href={`/profile/${tool.profile.id}`}
                      className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
                        {tool.profile.avatarUrl ? (
                          <img
                            src={tool.profile.avatarUrl}
                            alt={`${tool.profile.firstName} ${tool.profile.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon
                              icon="solar:user-bold"
                              className="text-primary-500"
                              width={20}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {tool.profile.firstName} {tool.profile.lastName}
                        </p>
                        {tool.profile.city && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Icon icon="solar:map-point-linear" width={12} />
                            {tool.profile.city}
                            {tool.profile.country &&
                              `, ${tool.profile.country}`}
                          </p>
                        )}
                      </div>
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="text-gray-400 group-hover:text-primary-500 transition-colors"
                        width={16}
                      />
                    </Link>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Owner information unavailable
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-5 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon
                        icon="solar:shield-check-bold"
                        className="text-green-500"
                        width={14}
                      />
                      Secure Payments
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-blue-500"
                        width={14}
                      />
                      Verified Users
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2.5 safe-area-pb">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(tool.dailyPriceCents)}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {" "}
                / day
              </span>
            </p>
          </div>
          {isOwner ? (
            <div className="flex gap-2">
              <button
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  tool.available
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                }`}
              >
                <Icon
                  icon={
                    tool.available
                      ? "solar:clock-circle-bold"
                      : "solar:check-circle-bold"
                  }
                  width={18}
                />
              </button>
              <Link
                href={`/toolbox/edit/${tool.id}`}
                className="px-5 py-2.5 text-sm bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Edit Tool
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2.5 rounded-lg transition-colors ${
                  isFavorited
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                }`}
              >
                <Icon
                  icon={isFavorited ? "solar:heart-bold" : "solar:heart-linear"}
                  width={20}
                />
              </button>
              <button
                disabled={!tool.available}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  tool.available
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {tool.available ? "Borrow" : "Unavailable"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
