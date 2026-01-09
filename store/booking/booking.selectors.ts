import { useBookingStore } from "./booking.store";
import { Booking } from "./booking.type";
import { Tool } from "../tool/tool.types";
import { useProfile } from "../profile/profile.selectors";

// ==================== Basic Selectors ====================

export const useBookings = (): Booking[] =>
  useBookingStore((state) => state.bookings);

export const useBookingsLoading = (): boolean =>
  useBookingStore((state) => state.isLoading);

export const useBookingsError = (): string | null =>
  useBookingStore((state) => state.error);

export const useBookingsHasHydrated = (): boolean =>
  useBookingStore((state) => state._hasHydrated);

// ==================== Derived Selectors ====================

// Get tools that the user has rented OUT to others (user is the owner)
export const useRentedToolsFromBookings = (): Tool[] => {
  const bookings = useBookings();
  const profile = useProfile();

  if (!profile?.id) return [];

  // Filter bookings where user is the owner (rentedById)
  const rentedBookings = bookings.filter(
    (booking) => booking.rentedById === profile.id
  );

  //  // Convert bookings to tools with bookingDetails info
  const derivedTools = rentedBookings
    .filter((booking) => booking.tool && booking.tool.id)
    .map((booking) => ({
      ...booking.tool!,
      specialId: booking.id + booking.tool!.id,
      bookingDetails: {
        id: booking.id,
        pickUpDate: booking.pickUpDate,
        returnDate: booking.returnDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        borrower: booking.toolBorrower,
      },
    }));

  return derivedTools;
};

// Get tools that the user has borrowed FROM others (user is the borrower)
export const useBorrowedToolsFromBookings = (): Tool[] => {
  const bookings = useBookings();
  const profile = useProfile();

  if (!profile?.id) return [];

  // Filter bookings where user is the borrower (borrowedById)
  const borrowedBookings = bookings.filter(
    (booking) => booking.borrowedById === profile.id
  );

  // Convert bookings to tools with bookingDetails info
  const derivedTools = borrowedBookings
    .filter((booking) => booking.tool && booking.tool.id)
    .map((booking) => ({
      ...booking.tool!,
      specialId: booking.id + booking.tool!.id,
      bookingDetails: {
        id: booking.id,
        pickUpDate: booking.pickUpDate,
        returnDate: booking.returnDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        borrower: booking.toolBorrower,
      },
    }));

  return derivedTools;
};

// Get count of rented tools
export const useRentedToolsCount = (): number => {
  const rentedTools = useRentedToolsFromBookings();
  return rentedTools.length;
};

// Get count of borrowed tools
export const useBorrowedToolsCount = (): number => {
  const borrowedTools = useBorrowedToolsFromBookings();
  return borrowedTools.length;
};

// ==================== Action Hooks ====================

export const useSetBookings = () =>
  useBookingStore((state) => state.setBookings);

export const useFetchBookings = () =>
  useBookingStore((state) => state.fetchBookings);

export const useUpdateBookingStatus = () =>
  useBookingStore((state) => state.updateBookingStatus);

export const useClearBookings = () =>
  useBookingStore((state) => state.clearBookings);
