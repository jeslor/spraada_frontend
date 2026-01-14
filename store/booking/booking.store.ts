import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BookingStore, BookingState, Booking } from "./booking.type";
import { getBookingsByProfile } from "@/lib/actions/book.actions";

// Initial state
const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
  _hasHydrated: false,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ==================== Core Actions ====================

      setBookings: (bookings: Booking[]) => {
        set((state) => {
          state.bookings = bookings;
          state.error = null;
        });
      },

      clearBookings: () => {
        set((state) => {
          state.bookings = [];
          state.error = null;
          state.isLoading = false;
        });
      },

      removeBooking: (bookingId: string) => {
        set((state) => {
          state.bookings = state.bookings.filter(
            (booking) => booking.id !== bookingId
          );
        });
      },

      updateBookingStatus: (bookingId: string, status: string) => {
        set((state) => {
          const booking = state.bookings.find((b) => b.id === bookingId);
          if (booking) {
            booking.status = status as any;
          }
        });
      },

      // ==================== Async Actions ====================

      fetchBookings: async (profileId: number) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const bookings = await getBookingsByProfile(profileId);

          set((state) => {
            state.bookings = bookings || [];
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Failed to fetch bookings";
            state.isLoading = false;
          });
        }
      },

      // ==================== Loading State Setters ====================

      setLoading: (isLoading: boolean) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      // ==================== Hydration ====================

      setHasHydrated: (hydrated: boolean) => {
        set((state) => {
          state._hasHydrated = hydrated;
        });
      },
    })),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookings: state.bookings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
