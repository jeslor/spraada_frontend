"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import { formatPrice, generateCalendarDays } from "@/lib/helpers/dateHelpers";
import { createBooking } from "@/lib/actions/book.actions";
import { useProfile, useFetchBookings } from "@/store";
import { useRouter } from "next/navigation";

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

  const profile = useProfile();
  const fetchBookings = useFetchBookings();

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

  const handleDateClick = (date: Date) => {
    if (date < today) return; // Can't select past dates

    if (!pickUpDate || (pickUpDate && returnDate)) {
      // Start new selection
      setPickUpDate(date);
      setReturnDate(null);
    } else if (date > pickUpDate) {
      // Set return date
      setReturnDate(date);
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

      // Refresh borrowed tools list after successful booking
      if (bookingResponse.success && profile?.id) {
        await fetchBookings(Number(profile.id));
      }
      Router.push("/borrowed");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setBookingLoading(false);
    }

    onClose();
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
                      const isSelected = isDateSelected(date);
                      const isInRange = isDateInRange(date);

                      return (
                        <button
                          key={index}
                          onClick={() => !isPast && handleDateClick(date)}
                          disabled={isPast}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg
                            transition-all duration-200 relative
                            ${
                              !isCurrentMonth
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-900 dark:text-gray-100"
                            }
                            ${
                              isPast
                                ? "cursor-not-allowed opacity-40"
                                : "hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer"
                            }
                            ${
                              isSelected
                                ? "bg-primary-600 text-white hover:bg-primary-700"
                                : ""
                            }
                            ${
                              isInRange
                                ? "bg-primary-100 dark:bg-primary-900/30"
                                : ""
                            }
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
