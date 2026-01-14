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

//get booking tool borrower by booking id
export const useBookingToolBorrowerById = (bookingId: string) => {
  const bookings = useBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  return booking ? booking.toolBorrower : null;
};

// ==================== Action Hooks ====================

export const useSetBookings = () =>
  useBookingStore((state) => state.setBookings);

export const removeBooking = () =>
  useBookingStore((state) => state.removeBooking);

export const useFetchBookings = () =>
  useBookingStore((state) => state.fetchBookings);

export const useUpdateBookingStatus = () =>
  useBookingStore((state) => state.updateBookingStatus);

export const useClearBookings = () =>
  useBookingStore((state) => state.clearBookings);

//main export

export const useBookingActions = () => ({
  useBookingsHasHydrated,
  bookingsLoading: useBookingsLoading,
  borrowedToolsFromBookings: useBorrowedToolsFromBookings,
  rentedToolsFromBookings: useRentedToolsFromBookings,
  fetchBookings: useFetchBookings,
  updateBookingStatus: useUpdateBookingStatus,
});
