import { useProfileStore } from "./profile.store";
import { Profile, User } from "./profile.types";

// ==================== Basic Selectors ====================

export const useProfile = (): Profile | null =>
  useProfileStore((state) => state.profile);
export const useUpdateProfileInStore = () =>
  useProfileStore((state) => state.updateProfileInStore);
export const useUser = (): User | null =>
  useProfileStore((state) => state.user);

export const useProfileLoading = (): boolean =>
  useProfileStore((state) => state.isLoading);

export const useProfileUpdating = (): boolean =>
  useProfileStore((state) => state.isUpdating);

export const useUpdateProfileFavoriteTools = () =>
  useProfileStore((state) => state.updateProfileFavoriteTools);
export const useToolIsFavorited = () =>
  useProfileStore((state) => state.toolIsFavorited);

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
  return useProfileStore((state) => state.stats);
};
export const useSetProfileStats = () => {
  return useProfileStore((state) => state.setStats);
};

// ==================== Action Selectors ====================

// Individual action hooks for stable references
export const useSetProfile = () => useProfileStore((state) => state.setProfile);

export const useSetUser = () => useProfileStore((state) => state.setUser);

export const useClearProfile = () =>
  useProfileStore((state) => state.clearProfile);

export const useFetchProfile = () =>
  useProfileStore((state) => state.fetchProfile);

export const useUpdateProfile = () =>
  useProfileStore((state) => state.updateProfile);

export const useUpdateAvatar = () =>
  useProfileStore((state) => state.updateAvatar);

export const useUpdateCover = () =>
  useProfileStore((state) => state.updateCover);

export const useSetError = () => useProfileStore((state) => state.setError);

export const useClearError = () => useProfileStore((state) => state.clearError);

// Combined actions hook (use individual hooks above when possible for better performance)
export const useProfileActions = () => {
  return {
    setProfile: useSetProfile(),
    setUser: useSetUser(),
    clearProfile: useClearProfile(),
    fetchProfile: useFetchProfile(),
    updateProfile: useUpdateProfile(),
    updateAvatar: useUpdateAvatar(),
    updateCover: useUpdateCover(),
    setError: useSetError(),
    clearError: useClearError(),
  };
};
