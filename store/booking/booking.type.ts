import { Tool } from "../tool/tool.types";

export interface Booking {
  id: string;
  toolId: string;
  rentedById: number;
  borrowedById: number;
  pickUpDate: string;
  returnDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  tool?: Tool;
  toolOwner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  toolBorrower?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
}

export interface BookingActions {
  setBookings: (bookings: Booking[]) => void;
  fetchBookings: (profileId: number) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: string) => void;
  clearBookings: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export interface BookingStore extends BookingState, BookingActions {}
