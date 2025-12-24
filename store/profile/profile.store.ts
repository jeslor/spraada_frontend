import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Profile,
  ProfileStore,
  ProfileState,
  Listing,
  Booking,
  User,
} from "./profile.types";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile.actions";

// Initial state
const initialState: ProfileState = {
  profile: null,
  user: null,
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

      setProfile: (profile: Profile) => {
        set((state) => {
          state.profile = profile;
          state.error = null;
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

      clearProfile: () => {
        set((state) => {
          state.profile = null;
          state.user = null;
          state.error = null;
          state.isLoading = false;
          state.isUpdating = false;
        });
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

      // ==================== Listings Management ====================

      addListing: (listing: Listing) => {
        set((state) => {
          if (state.profile) {
            state.profile.listings = [
              ...(state.profile.listings || []),
              listing,
            ];
          }
        });
      },

      updateListing: (listingId: string, updates: Partial<Listing>) => {
        set((state) => {
          if (state.profile?.listings) {
            const index = state.profile.listings.findIndex(
              (l) => l.id === listingId
            );
            if (index !== -1) {
              state.profile.listings[index] = {
                ...state.profile.listings[index],
                ...updates,
              };
            }
          }
        });
      },

      removeListing: (listingId: string) => {
        set((state) => {
          if (state.profile?.listings) {
            state.profile.listings = state.profile.listings.filter(
              (l) => l.id !== listingId
            );
          }
        });
      },

      // ==================== Bookings Management ====================

      addBooking: (booking: Booking) => {
        set((state) => {
          if (state.profile) {
            state.profile.bookings = [
              ...(state.profile.bookings || []),
              booking,
            ];
          }
        });
      },

      updateBookingStatus: (bookingId: string, status: Booking["status"]) => {
        set((state) => {
          if (state.profile?.bookings) {
            const index = state.profile.bookings.findIndex(
              (b) => b.id === bookingId
            );
            if (index !== -1) {
              state.profile.bookings[index].status = status;
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
    }
  )
);
