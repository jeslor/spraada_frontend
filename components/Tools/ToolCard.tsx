"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  isFavorite,
  isToolOwnedByUser,
  Tool,
  useProfile,
  useUpdateBookingStatus,
} from "@/store";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import {
  calculateDaysRemaining,
  calculateDaysBorrowed,
  formatDateWithDay,
  formatPrice,
} from "@/lib/helpers/dateHelpers";
import { SpraadaButton } from "../ui/SpraadaButton";
import {
  BookStatus,
  updateBookingAsDeleted,
  updateBookingStatus,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "compact" | "rental" | "borrowed";
  onDelete?: (toolId: Tool) => void;
  onRent?: (toolId: Tool) => void;
  onApproveBooking?: (bookingId: string, status: BookStatus) => void;
  onCancelBooking?: (bookingId: string, status: BookStatus) => void;
  showOwner?: boolean;
  isDeleting?: boolean;
}

// Compact variant - Airbnb-style grid listing
const CompactCard = ({ tool }: { tool: Tool }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const photos = tool.toolPhotos || [];
  const hasMultiplePhotos = photos.length > 1;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavoriteState(!isFavoriteState);
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
            onClick={handleFavorite}
            className="absolute top-2.5 right-2.5 z-10 hover:scale-110 transition-transform"
          >
            <span className="relative text-[28px] flex items-center justify-center">
              <Icon icon="fe:heart-o" className="absolute z-2 text-white" />
              <Icon
                icon="fe:heart"
                className={
                  isFavoriteState ? "text-primary-500" : "text-black/20"
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
                    (prev) => (prev - 1 + photos.length) % photos.length
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

// Get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "confirmed":
      return "bg-primary-100 text-primary-700 border-primary-200";
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Rental/Borrowed variant - Full width horizontal card
const RentalCard = ({
  tool,
  variant,
  onApproveBooking,
  onCancelBooking,
}: {
  tool: Tool;
  variant: "rental" | "borrowed";
  onApproveBooking?: (bookingId: string, status: BookStatus) => void;
  onCancelBooking?: (bookingId: string, status: BookStatus) => void;
}) => {
  const Router = useRouter();

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const profile = useProfile();

  const isRental = variant === "rental";
  const isBorrowed = variant === "borrowed";
  const photo = tool.toolPhotos?.[0];

  // Use bookingDetails for derived tools from bookings
  const booking = (tool as any).bookingDetails;
  const otherPerson = isRental ? booking?.borrower : booking?.owner;
  const daysRemaining = booking
    ? calculateDaysRemaining(booking.returnDate)
    : 0;
  const daysBorrowed = booking ? calculateDaysBorrowed(booking.pickUpDate) : 0;

  // Calculate total rental days
  const totalDays = booking
    ? Math.ceil(
        (new Date(booking.returnDate).getTime() -
          new Date(booking.pickUpDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const updateBookingStatusInStore = useUpdateBookingStatus();
  const fetchBookings =
    (window as any)?.__NEXT_DATA__?.props?.pageProps?.fetchBookings ||
    (() => {});
  // fallback: you may want to pass fetchBookings as a prop or use a context

  const handleStatusChange = async (status: BookStatus) => {
    if (!booking) return;
    setIsUpdatingStatus(true);
    try {
      updateBookingStatusInStore(booking.id, status);
      const result = await updateBookingStatus(booking.id, status);
      if (!result.success) {
        throw new Error(result.data || "Failed to update booking");
      }
      // Always fetch latest bookings after status change
      if (profile?.id && typeof fetchBookings === "function") {
        await fetchBookings(profile.id);
      }
    } catch (error) {
      console.error(`Error updating booking status to ${status}:`, error);
      updateBookingStatusInStore(booking.id, booking.status); // revert
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleStatusChange("confirmed");
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleStatusChange("cancelled");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    // Use 'cancelled' as the status for deletion (no 'deleted' in BookStatus)
    if (booking.status !== "PENDING") return;
    try {
      setIsUpdatingStatus(true);
      const result = await updateBookingAsDeleted(
        booking.id,
        profile?.id === tool.profile?.id ? { owner: true } : { borrower: true }
      );
      if (!result.success) {
        throw new Error(result.data || "Failed to mark booking as deleted");
      }
    } catch (error) {
      console.error("Error marking booking as deleted:", error);
      toast.error("Failed to delete booking");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Link
      href={`/toolbox/view/${tool.id}`}
      className="group shadow block w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-wrap  gap-5 p-5">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-48 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {photo ? (
            <img
              src={photo.photoUrl}
              alt={tool.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                icon="solar:box-bold-duotone"
                className="text-gray-300 dark:text-gray-600"
                width={48}
              />
            </div>
          )}

          {/* Status Badge */}
          {booking && (
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 rounded-md text-[10px] font-semibold ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute bottom-2 left-2">
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
                isRental
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              }`}
            >
              {isRental ? "Renting Out" : "Borrowed"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* Category */}
              <span className="inline-block text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                {tool.category || "Uncategorized"}
              </span>

              {/* Tool Name */}
              <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">
                {tool.name}
              </h3>

              {/* Person Info */}
              {otherPerson && (
                <div className="flex items-center gap-3 pt-2">
                  {otherPerson.avatarUrl ? (
                    <img
                      src={otherPerson.avatarUrl}
                      alt={`${otherPerson.firstName} ${otherPerson.lastName}`}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {otherPerson.firstName[0]}
                        {otherPerson.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isRental ? "Borrowed by" : "Owner"}
                    </p>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        Router.push(
                          `/toolbox/view/${tool.id}/owner?bookingId=${booking?.id}`
                        );
                      }}
                      className="font-semibold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                    >
                      {otherPerson.firstName} {otherPerson.lastName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Cancel and Delete Booking Actions */}
          <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Cancel and Delete Booking Buttons */}
            <div className="flex gap-3">
              {/* Approve Button - Only for rentals with pending status */}
              {booking?.status === "PENDING" &&
                onApproveBooking &&
                isRental && (
                  <SpraadaButton
                    onClick={handleApprove}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Icon
                          icon="solar:spinner-linear"
                          className="animate-spin"
                          width={18}
                        />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="solar:check-circle-bold-duotone"
                          width={18}
                        />
                        Approve Booking
                      </>
                    )}
                  </SpraadaButton>
                )}
              {/* Cancel Booking: visible for confirmed or pending bookings */}
              {(isBorrowed || isRental) && booking.status === "PENDING" && (
                <SpraadaButton
                  onClick={handleCancel}
                  disabled={isUpdatingStatus}
                  className="spraada-btn-secondary"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Icon
                        icon="solar:spinner-linear"
                        className="animate-spin"
                        width={18}
                      />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:close-circle-bold-duotone" width={18} />
                      Cancel Booking
                    </>
                  )}
                </SpraadaButton>
              )}
              {/* Delete Booking: only for pending bookings */}
              {booking?.status === "CANCELLED" && (
                <SpraadaButton
                  onClick={handleDelete}
                  className="spraada-btn-danger"
                  type="button"
                >
                  <Icon icon="solar:trash-bin-2-linear" width={18} /> Delete
                  Booking
                </SpraadaButton>
              )}
            </div>

            {/* Duration Stats */}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                itemName={tool.name}
                itemType="Booking"
                isDeleting={isUpdatingStatus}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            )}
            {booking && (
              <div className="flex gap-3">
                {/* Days Borrowed */}
                <div className="flex w-full max-w-[300px] items-center gap-2 p-3 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50">
                  <Icon
                    icon="solar:calendar-bold-duotone"
                    className="text-primary-600 dark:text-primary-400"
                    width={20}
                  />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Borrowed
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {daysBorrowed === 0
                        ? "Today"
                        : daysBorrowed === 1
                        ? "1 day"
                        : `${daysBorrowed} days`}
                    </p>
                  </div>
                </div>

                {/* Days Remaining */}
                {!(tool.bookingDetails?.status === "CANCELLED") && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg border w-full max-w-[300px] ${
                      daysRemaining === 0
                        ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
                        : daysRemaining <= 2
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                        : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
                    }`}
                  >
                    <Icon
                      icon="solar:clock-circle-bold-duotone"
                      className={`${
                        daysRemaining === 0
                          ? "text-red-600 dark:text-red-400"
                          : daysRemaining <= 2
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                      width={20}
                    />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Remaining
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          daysRemaining === 0
                            ? "text-red-600 dark:text-red-400"
                            : daysRemaining <= 2
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {daysRemaining === 0
                          ? "Due today!"
                          : daysRemaining === 1
                          ? "1 day"
                          : `${daysRemaining} days`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates with Day of Week */}
            {booking && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  {/* Pick-up Date */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                      <Icon
                        icon="solar:calendar-mark-bold-duotone"
                        className="text-primary-600 dark:text-primary-400"
                        width={16}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
                        Pick-up
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {formatDateWithDay(booking.pickUpDate)}
                      </p>
                    </div>
                  </div>

                  <Icon
                    icon="solar:arrow-right-linear"
                    className="hidden sm:block text-gray-400"
                    width={16}
                  />

                  {/* Return Date */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                      <Icon
                        icon="solar:calendar-bold-duotone"
                        className="text-primary-600 dark:text-primary-400"
                        width={16}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
                        Return
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {formatDateWithDay(booking.returnDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {formatPrice(tool.dailyPriceCents)} × {totalDays}{" "}
                      {totalDays === 1 ? "day" : "days"}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {booking
                        ? formatPrice(booking.totalPrice)
                        : formatPrice(tool.dailyPriceCents)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total amount
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

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
    </div>
  );
};

// Main ToolCard component
export const ToolCard = ({
  tool,
  variant = "default",
  onDelete,
  onApproveBooking,
  onCancelBooking,
  isDeleting,
}: ToolCardProps) => {
  switch (variant) {
    case "compact":
      return <CompactCard tool={tool} />;
    case "rental":
    case "borrowed":
      return (
        <RentalCard
          tool={tool}
          variant={variant}
          onApproveBooking={onApproveBooking}
          onCancelBooking={onCancelBooking}
        />
      );
    default:
      return (
        <DefaultCard tool={tool} onDelete={onDelete} isDeleting={isDeleting} />
      );
  }
};

export default ToolCard;
