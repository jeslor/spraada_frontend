"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import { formatPrice, generateCalendarDays } from "@/lib/helpers/dateHelpers";
import { createBooking, getBookingsByTool } from "@/lib/actions/book.actions";
import { useProfile, useFetchBookings } from "@/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  dailyPriceCents: number;
  depositCents: number;
  toolId: string;
  toolOwnerId: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  toolName,
  dailyPriceCents,
  depositCents,
  toolId,
  toolOwnerId,
}: BookingModalProps) {
  const Router = useRouter();
  const [pickUpDate, setPickUpDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<{ start: Date; end: Date }[]>(
    []
  );
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);

  const profile = useProfile();
  const fetchBookings = useFetchBookings();

  // Fetch booked dates for this tool when modal opens
  useEffect(() => {
    if (isOpen && toolId) {
      const fetchBookedDates = async () => {
        setLoadingBookedDates(true);
        try {
          const bookings = await getBookingsByTool(toolId);
          // Filter only confirmed or pending bookings
          const activeBookings = bookings.filter(
            (booking: any) =>
              booking.status === "CONFIRMED" || booking.status === "PENDING"
          );

          const bookedRanges = activeBookings.map((booking: any) => ({
            start: new Date(booking.pickUpDate),
            end: new Date(booking.returnDate),
          }));

          setBookedDates(bookedRanges);
        } catch (error) {
          console.error("Error fetching booked dates:", error);
        } finally {
          setLoadingBookedDates(false);
        }
      };

      fetchBookedDates();
    }
  }, [isOpen, toolId]);

  // Calculate number of days
  const numberOfDays = useMemo(() => {
    if (!pickUpDate || !returnDate) return 0;
    const diff = returnDate.getTime() - pickUpDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [pickUpDate, returnDate]);

  // Calculate total price
  const rentalTotal = numberOfDays * dailyPriceCents;
  const serviceFee = Math.round(rentalTotal * 0.1); // 10% service fee
  const totalPrice = rentalTotal + serviceFee + depositCents;

  const calendarDays = generateCalendarDays(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if a date is already booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some((range) => {
      const checkDate = new Date(date);
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);

      checkDate.setHours(0, 0, 0, 0);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(0, 0, 0, 0);

      return checkDate >= rangeStart && checkDate <= rangeEnd;
    });
  };

  const handleDateClick = (date: Date) => {
    if (date < today || isDateBooked(date)) return; // Can't select past dates or booked dates

    if (!pickUpDate || (pickUpDate && returnDate)) {
      // Start new selection
      setPickUpDate(date);
      setReturnDate(null);
    } else if (date > pickUpDate) {
      // Check if there are any booked dates in the range
      const hasBookedDatesInRange = bookedDates.some((range) => {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeStart.setHours(0, 0, 0, 0);
        rangeEnd.setHours(0, 0, 0, 0);

        return (
          (rangeStart > pickUpDate && rangeStart < date) ||
          (rangeEnd > pickUpDate && rangeEnd < date) ||
          (rangeStart <= pickUpDate && rangeEnd >= date)
        );
      });

      if (hasBookedDatesInRange) {
        // Reset selection if there are booked dates in range
        setPickUpDate(date);
        setReturnDate(null);
      } else {
        // Set return date if range is clear
        setReturnDate(date);
      }
    } else {
      // Reset if selected date is before pick-up
      setPickUpDate(date);
      setReturnDate(null);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!pickUpDate || !returnDate) return false;
    return date > pickUpDate && date < returnDate;
  };

  const isDateSelected = (date: Date) => {
    if (!pickUpDate) return false;
    if (pickUpDate && date.getTime() === pickUpDate.getTime()) return true;
    if (returnDate && date.getTime() === returnDate.getTime()) return true;
    return false;
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleBook = async () => {
    if (!pickUpDate || !returnDate) return;

    try {
      setBookingLoading(true);
      const bookingResponse = await createBooking({
        toolId,
        borrowerId: Number(profile?.id!),
        toolOwnerId: Number(toolOwnerId),
        pickUpDate,
        returnDate,
        totalPrice,
      });

      if (bookingResponse.success) {
        toast.success("Booking request sent successfully!");
        // Refresh borrowed tools list after successful booking
        if (profile?.id) {
          await fetchBookings(Number(profile.id));
        }
        onClose();
        Router.push("/borrowed");
      } else {
        toast.error(
          bookingResponse.data ||
            "Failed to create booking. Please try different dates."
        );
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(
        "Failed to create booking. The selected dates may no longer be available."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] h-full overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Book {toolName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {formatPrice(dailyPriceCents)} per day
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Icon
              icon="solar:close-circle-linear"
              className="text-gray-500 dark:text-gray-400"
              width={24}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex py-3 flex-2 overflow-y-auto ">
          <div className="p-6 grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:grid-cols-3 gap-6 w-full">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Date Selection Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Check-in
                    </label>
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {pickUpDate
                        ? pickUpDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Add date"}
                    </p>
                  </div>
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Check-out
                    </label>
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {returnDate
                        ? returnDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Add date"}
                    </p>
                  </div>
                </div>

                {/* Calendar */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  {loadingBookedDates && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <Icon
                        icon="solar:refresh-linear"
                        className="animate-spin"
                        width={16}
                      />
                      Loading availability...
                    </div>
                  )}
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <SpraadaButton
                      onClick={previousMonth}
                      variant="ghost"
                      className="p-2"
                    >
                      <Icon icon="solar:alt-arrow-left-linear" width={20} />
                    </SpraadaButton>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <SpraadaButton
                      onClick={nextMonth}
                      variant="ghost"
                      className="p-2"
                    >
                      <Icon icon="solar:alt-arrow-right-linear" width={20} />
                    </SpraadaButton>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) return <div key={index} />;

                      const isCurrentMonth =
                        date.getMonth() === currentMonth.getMonth();
                      const isPast = date < today;
                      const isBooked = isDateBooked(date);
                      const isSelected = isDateSelected(date);
                      const isInRange = isDateInRange(date);
                      const isDisabled = isPast || isBooked;

                      return (
                        <button
                          key={index}
                          onClick={() => !isDisabled && handleDateClick(date)}
                          disabled={isDisabled}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg
                            transition-all duration-200 relative
                            ${
                              !isCurrentMonth
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-900 dark:text-gray-100"
                            }
                            ${
                              isDisabled
                                ? "cursor-not-allowed opacity-40"
                                : "hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer"
                            }
                            ${
                              isBooked && isCurrentMonth
                                ? "bg-red-100 dark:bg-red-900/30 line-through text-red-600 dark:text-red-400"
                                : ""
                            }
                            ${
                              isSelected
                                ? "bg-primary-600 text-white hover:bg-primary-700"
                                : ""
                            }
                            ${
                              isInRange && !isBooked
                                ? "bg-primary-100 dark:bg-primary-900/30"
                                : ""
                            }
                          `}
                          title={isBooked ? "Already booked" : ""}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-primary-600"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800"></div>
                    <span>Your dates</span>
                  </div>
                </div>

                {/* Info message */}
                {bookedDates.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Icon
                      icon="solar:info-circle-bold"
                      className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                      width={18}
                    />
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      This tool has {bookedDates.length} active{" "}
                      {bookedDates.length === 1 ? "booking" : "bookings"}. You
                      can book any available dates.
                    </p>
                  </div>
                )}

                {/* Clear Dates */}
                {(pickUpDate || returnDate) && (
                  <SpraadaButton
                    onClick={() => {
                      setPickUpDate(null);
                      setReturnDate(null);
                    }}
                    variant="ghost"
                    className="text-sm text-gray-600 dark:text-gray-400 underline"
                  >
                    Clear dates
                  </SpraadaButton>
                )}
              </div>
            </div>

            {/* Price Summary Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 p-5 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Price details
                </h3>

                {numberOfDays > 0 ? (
                  <>
                    <div className="space-y-3 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatPrice(dailyPriceCents)} × {numberOfDays} days
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(rentalTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Service fee
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(serviceFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Security deposit
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(depositCents)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Total
                      </span>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Security deposit will be refunded after tool return
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Icon
                      icon="solar:calendar-linear"
                      className="mx-auto text-gray-300 dark:text-gray-600 mb-2"
                      width={48}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select dates to see pricing
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className=" flex items-center justify-center Sm:justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-wrap gap-y-3 ">
          <div className="">
            {numberOfDays > 0 && (
              <p className="text-[16px] font-bold text-gray-600 dark:text-gray-400">
                <span className=" text-gray-900 dark:text-gray-100">
                  {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
                </span>{" "}
                • {formatPrice(totalPrice)} total
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <SpraadaButton onClick={onClose} variant="ghost">
              Cancel
            </SpraadaButton>
            <SpraadaButton
              onClick={handleBook}
              disabled={!pickUpDate || !returnDate}
              className="px-6 flex items-center gap-1"
            >
              <Icon icon="solar:hand-shake-bold" width={18} />
              <span className="whitespace-pre hidden sm:inline">
                Request to
              </span>{" "}
              book
            </SpraadaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
