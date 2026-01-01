import { useProfileStore } from "./profile.store";
import { Profile, User } from "./profile.types";

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

export const useMyToolsCount = (): number =>
  useProfileStore((state) => state.profile?.myToolBox?.length || 0);

export const useBookingsCount = (): number =>
  useProfileStore((state) => state.profile?.myRentals?.length || 0);

export const useTransactionsCount = (): number =>
  useProfileStore((state) => state.profile?.transactions?.length || 0);

// ==================== Stats Selectors ====================

export const useProfileStats = () => {
  return {
    myToolsCount: useMyToolsCount() || 0,
    bookingsCount: useBookingsCount() || 0,
    transactionsCount: useTransactionsCount() || 0,
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

    setError,
    clearError,
  };
};
