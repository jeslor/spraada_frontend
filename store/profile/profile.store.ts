import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Profile, ProfileStore, ProfileState, User } from "./profile.types";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile.actions";
import { Tool } from "../tool/tool.types";
import { useToolStore } from "../tool/tool.store";

// Initial state
const initialState: ProfileState = {
  profile: null,
  user: null,
  stats: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  _hasHydrated: false,
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ==================== Core Actions ====================

      setProfile: (profile: Profile | null) => {
        set((state) => {
          state.profile = profile;
          state.error = null;
        });
      },

      updateProfileInStore: (updates: Partial<Profile>) => {
        set((state) => {
          if (state.profile) {
            state.profile = { ...state.profile, ...updates };
          }
        });
      },

      setUser: (user: User) => {
        set((state) => {
          state.user = user;
          if (user.profile) {
            state.profile = user.profile;
          }
          state.error = null;
        });
      },

      setStats: () => {
        const toolState = useToolStore.getState();
        const tools = toolState.myTools;
        const myRentals = toolState.rentedTools;

        const totalEarningsCents = myRentals.reduce(
          (sum, rental) => sum + (rental.bookingDetails?.totalPrice || 0),
          0,
        );

        set((state) => {
          state.stats = {
            totalTools: tools.length,
            totalRentals: myRentals.length,
            totalEarningsCents,
          };
        });
      },

      clearProfile: () => {
        set((state) => {
          state.profile = null;
          state.user = null;
          state.error = null;
          state.isLoading = false;
          state.isUpdating = false;
          state.stats = null;
        });
        localStorage.removeItem("spraadaSelectedChatUserId");
      },

      // ==================== Async Actions ====================

      fetchProfile: async (userId: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const result = await fetchUserProfile(userId);

          if (!result.success) {
            throw new Error(result.error || "Failed to fetch profile");
          }

          set((state) => {
            state.user = result.data;
            state.profile = result.data.profile || result.data;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Failed to fetch profile";
            state.isLoading = false;
          });
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const { profile } = get();
        if (!profile) return false;

        set((state) => {
          state.isUpdating = true;
          state.error = null;
        });

        try {
          const result = await updateUserProfile(profile.id, updates);

          if (!result.success) {
            throw new Error(result.error || "Failed to update profile");
          }

          set((state) => {
            state.profile = { ...state.profile!, ...result.data };
            state.isUpdating = false;
          });

          return true;
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Failed to update profile";
            state.isUpdating = false;
          });
          return false;
        }
      },
      // ==================== Favorite Tools ====================
      updateProfileFavoriteTools: (favoriteTools: Tool[]) => {
        set((state) => {
          if (state.profile) {
            state.profile.favoriteTools = favoriteTools;
          }
        });
      },

      toolIsFavorited: (toolId: string): boolean => {
        const state = get();
        const favoriteTools = state.profile?.favoriteTools || [];

        return favoriteTools.some((tool) => tool.id === toolId);
      },

      // ==================== Avatar/Cover Updates ====================

      updateAvatar: (avatarUrl: string, avatarUrlKey?: string) => {
        set((state) => {
          if (state.profile) {
            state.profile.avatarUrl = avatarUrl;
            if (avatarUrlKey) {
              state.profile.avatarUrlKey = avatarUrlKey;
            }
          }
        });
      },

      updateCover: (coverUrl: string, coverUrlKey?: string) => {
        set((state) => {
          if (state.profile) {
            state.profile.coverUrl = coverUrl;
            if (coverUrlKey) {
              state.profile.coverUrlKey = coverUrlKey;
            }
          }
        });
      },

      // ==================== Error Handling ====================

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      // ==================== Hydration ====================

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },
    })),
    {
      name: "spraada-profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
