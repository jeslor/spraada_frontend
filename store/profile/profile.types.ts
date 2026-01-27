// Profile entity types

import { Tool } from "../tool/tool.types";

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  avatarUrlKey?: string;
  coverUrl?: string;
  coverUrlKey?: string;
  country: string;
  address?: string;
  city: string;
  phone?: string;
  userId: number;
  myToolBox?: Tool[];
  myRentals?: [];
  favoriteTools?: Tool[];
  transactions?: [];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  isOnboarded: boolean;
  profile?: Profile;
  createdAt?: string;
}

// Store state types
export interface ProfileState {
  // Data
  profile: Profile | null;
  user: User | null;
  stats: {
    totalTools: number;
    totalRentals: number;
    totalEarningsCents: number;
  } | null;

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Hydration state (for SSR)
  _hasHydrated: boolean;
}

export interface ProfileActions {
  // Core actions
  setProfile: (profile: Profile | null) => void;
  setUser: (user: User) => void;
  clearProfile: () => void;

  // Async actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;

  // Stats
  setStats: () => void;

  // Avatar/Cover updates
  updateAvatar: (avatarUrl: string, avatarUrlKey?: string) => void;
  updateCover: (coverUrl: string, coverUrlKey?: string) => void;

  // Favorite tools
  updateProfileFavoriteTools: (favoriteTools: Tool[]) => void;
  toolIsFavorited: (toolId: string) => boolean;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Hydration
  setHasHydrated: (state: boolean) => void;
}

export type ProfileStore = ProfileState & ProfileActions;
