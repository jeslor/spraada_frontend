"use client";
import {
  calculateDaysBorrowed,
  calculateDaysRemaining,
  formatDateWithDay,
  formatPrice,
} from "@/lib/helpers/dateHelpers";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  BookStatus,
  updateBookingAsDeleted,
  updateBookingStatus,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import {
  removeBooking,
  Tool,
  updateBookingStatusInStore,
  useProfile,
  useSendNotification,
} from "@/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStatusColor } from "./ToolCard";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

const RentalCard = ({
  tool,
  variant,
  onApproveBooking,
}: {
  tool: Tool;
  variant: "rental" | "borrowed";
  onApproveBooking?: (bookingId: string, status: BookStatus) => void;
  onCancelBooking?: (bookingId: string, status: BookStatus) => void;
}) => {
  const Router = useRouter();

  // Use bookingDetails for derived tools from bookings
  const booking = (tool as any).bookingDetails;

  const isRental = variant === "rental";
  const isBorrowed = variant === "borrowed";
  const photo = tool.toolPhotos?.[0];

  const otherPerson = isRental ? booking?.borrower : booking?.owner;
  const bookingExpired = booking
    ? calculateDaysRemaining(booking.pickUpDate, true) < 0
    : false;

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string>("");

  useEffect(() => {
    if (booking) {
      setBookingStatus(booking.status);
    }
  }, [booking]);

  const profile = useProfile();
  const removeBookingById = removeBooking();
  const sendNotification = useSendNotification();
  const updateBookingStatusStore = updateBookingStatusInStore();

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

  const fetchBookings =
    (window as any)?.__NEXT_DATA__?.props?.pageProps?.fetchBookings ||
    (() => {});
  // fallback: you may want to pass fetchBookings as a prop or use a context

  const handleStatusChange = async (status: BookStatus) => {
    if (!booking) return;
    setIsUpdatingStatus(true);
    try {
      const result = await updateBookingStatus(booking.id, status);
      if (!result.success) {
        // Optionally, you could revert the optimistic update here if needed
        throw new Error(result.data || "Failed to update booking");
      }
      // Optimistically update the store first for instant UI feedback
      setBookingStatus(status);
      updateBookingStatusStore(booking.id, status);
      //Send notification

      const newNotification = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        title:
          status === "confirmed"
            ? "Booking Confirmed"
            : status === "cancelled"
            ? "Booking Cancelled"
            : "Booking Updated",
        profileId: isRental
          ? tool.bookingDetails?.borrower?.id!
          : tool.profile?.id!,
        content:
          status === "confirmed"
            ? `${profile?.firstName} ${profile?.lastName} has confirmed your booking for the tool: ${tool.name}.`
            : status === "cancelled"
            ? `${profile?.firstName} ${profile?.lastName} has cancelled your booking for the tool: ${tool.name}.`
            : `${profile?.firstName} ${profile?.lastName} has updated your booking for the tool: ${tool.name}.`,
        isRead: false,
        link:
          status === "confirmed"
            ? `/rentals?scrollId=${booking.id}`
            : `/borrowed?scrollId=${booking.id}`,
      };

      sendNotification(newNotification, profile?.id!);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error updating booking status to ${status}:`, error);
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
    if (bookingStatus.toLocaleUpperCase() !== "CANCELLED") return;
    try {
      setIsUpdatingStatus(true);
      const result = await updateBookingAsDeleted(
        booking.id,
        profile?.id === tool.profileId
          ? { deletedByOwner: true }
          : { deletedByBorrower: true }
      );
      if (!result.success) {
        throw new Error(result.data || "Failed to mark booking as deleted");
      }
      // Refresh bookings after deletion
      removeBookingById(booking.id);
    } catch (error) {
      console.error("Error marking booking as deleted:", error);
      toast.error("Failed to delete booking");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Link
      id={tool.bookingDetails?.id}
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
                  bookingStatus
                )}`}
              >
                {bookingStatus.toUpperCase()}
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
              {bookingStatus === "PENDING" && onApproveBooking && isRental && (
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
                      <Icon icon="solar:check-circle-bold-duotone" width={18} />
                      Approve Booking
                    </>
                  )}
                </SpraadaButton>
              )}
              {/* Cancel Booking: visible for confirmed or pending bookings */}
              {(isBorrowed || isRental) && bookingStatus === "PENDING" && (
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
              {bookingStatus.toLocaleUpperCase() === "CANCELLED" && (
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
              <div className="flex flex-wrap gap-3">
                {/* Days Borrowed */}
                <div className="flex w-full max-w-[300px] sm:max-w-[260px] xs:max-w-[180px] items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50">
                  <Icon
                    icon="solar:calendar-bold-duotone"
                    className="text-primary-600 dark:text-primary-400"
                    width={20}
                  />
                  <div className="flex-1">
                    <p className="text-[10px] sm:text-[9px] xs:text-[8px] text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Borrowed
                    </p>
                    <p className="text-sm sm:text-xs xs:text-[11px] font-bold text-gray-900 dark:text-white">
                      {daysBorrowed === 1
                        ? "Today"
                        : daysBorrowed === 2
                        ? "1 day ago"
                        : `${daysBorrowed} days ago`}
                    </p>
                  </div>
                </div>

                {/* Days Remaining */}
                {!(tool.bookingDetails?.status === "CANCELLED") && (
                  <div
                    className={`flex items-center  gap-2 px-2 md:px-3 py-1  md:py-2 rounded-lg border w-full max-w-[300px] sm:max-w-[260px] xs:max-w-[180px] ${
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
                      <p className="text-[10px] sm:text-[9px] xs:text-[8px] text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                        Remaining
                      </p>
                      <p
                        className={`text-sm sm:text-xs xs:text-[11px] font-bold ${
                          daysRemaining === 0 || bookingExpired
                            ? "text-red-600 dark:text-red-400"
                            : daysRemaining <= 2
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {bookingExpired
                          ? "Booking expired"
                          : daysRemaining === 0
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 ">
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
export default RentalCard;
