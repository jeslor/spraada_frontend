import { useProfileStore } from "./profile.store";
import { Profile, User, Listing, Booking, Transaction } from "./profile.types";

// ==================== Basic Selectors ====================

export const useProfile = (): Profile | null =>
  useProfileStore((state) => state.profile);

export const useUser = (): User | null =>
  useProfileStore((state) => state.user);

export const useProfileLoading = (): boolean =>
  useProfileStore((state) => state.isLoading);

export const useProfileUpdating = (): boolean =>
  useProfileStore((state) => state.isUpdating);

export const useProfileError = (): string | null =>
  useProfileStore((state) => state.error);

export const useHasHydrated = (): boolean =>
  useProfileStore((state) => state._hasHydrated);

// ==================== Derived Selectors ====================

export const useFullName = (): string => {
  const profile = useProfileStore((state) => state.profile);
  if (!profile) return "";
  return `${profile.firstName} ${profile.lastName}`.trim();
};

export const useProfileInitials = (): string => {
  const profile = useProfileStore((state) => state.profile);
  if (!profile) return "";
  const first = profile.firstName?.charAt(0) || "";
  const last = profile.lastName?.charAt(0) || "";
  return `${first}${last}`.toUpperCase();
};

export const useAvatarUrl = (): string | undefined =>
  useProfileStore((state) => state.profile?.avatarUrl);

export const useCoverUrl = (): string | undefined =>
  useProfileStore((state) => state.profile?.coverUrl);

// ==================== Collections Selectors ====================

export const useListings = (): Listing[] =>
  useProfileStore((state) => state.profile?.listings || []);

export const useListingsCount = (): number =>
  useProfileStore((state) => state.profile?.listings?.length || 0);

export const useBookings = (): Booking[] =>
  useProfileStore((state) => state.profile?.bookings || []);

export const useBookingsCount = (): number =>
  useProfileStore((state) => state.profile?.bookings?.length || 0);

export const useTransactions = (): Transaction[] =>
  useProfileStore((state) => state.profile?.transactions || []);

// ==================== Filtered Selectors ====================

export const usePendingBookings = (): Booking[] =>
  useProfileStore(
    (state) =>
      state.profile?.bookings?.filter((b) => b.status === "pending") || []
  );

export const useConfirmedBookings = (): Booking[] =>
  useProfileStore(
    (state) =>
      state.profile?.bookings?.filter((b) => b.status === "confirmed") || []
  );

export const useListingById = (id: string): Listing | undefined =>
  useProfileStore((state) => state.profile?.listings?.find((l) => l.id === id));

// ==================== Stats Selectors ====================

export const useProfileStats = () => {
  const profile = useProfileStore((state) => state.profile);

  return {
    listingsCount: profile?.listings?.length || 0,
    bookingsCount: profile?.bookings?.length || 0,
    transactionsCount: profile?.transactions?.length || 0,
    pendingBookings:
      profile?.bookings?.filter((b) => b.status === "pending").length || 0,
    confirmedBookings:
      profile?.bookings?.filter((b) => b.status === "confirmed").length || 0,
  };
};

// ==================== Action Selectors ====================

export const useProfileActions = () => {
  const setProfile = useProfileStore((state) => state.setProfile);
  const setUser = useProfileStore((state) => state.setUser);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);
  const updateCover = useProfileStore((state) => state.updateCover);
  const addListing = useProfileStore((state) => state.addListing);
  const updateListing = useProfileStore((state) => state.updateListing);
  const removeListing = useProfileStore((state) => state.removeListing);
  const addBooking = useProfileStore((state) => state.addBooking);
  const updateBookingStatus = useProfileStore(
    (state) => state.updateBookingStatus
  );
  const setError = useProfileStore((state) => state.setError);
  const clearError = useProfileStore((state) => state.clearError);

  return {
    setProfile,
    setUser,
    clearProfile,
    fetchProfile,
    updateProfile,
    updateAvatar,
    updateCover,
    addListing,
    updateListing,
    removeListing,
    addBooking,
    updateBookingStatus,
    setError,
    clearError,
  };
};
