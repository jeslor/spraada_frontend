// Profile entity types
export interface Listing {
  id: string;
  title: string;
  description: string;
  dailyPriceCents: number;
  city: string;
  country: string;
  photos?: { id: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  start: string;
  end: string;
  status: "confirmed" | "pending" | "cancelled";
  listingId?: string;
  listing?: Listing;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "payment" | "payout" | "refund";
  status: "completed" | "pending" | "failed";
  createdAt: string;
  description?: string;
}

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
  listings?: Listing[];
  bookings?: Booking[];
  transactions?: Transaction[];
  createdAt?: string;
  updatedAt?: string;
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

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Hydration state (for SSR)
  _hasHydrated: boolean;
}

export interface ProfileActions {
  // Core actions
  setProfile: (profile: Profile) => void;
  setUser: (user: User) => void;
  clearProfile: () => void;

  // Async actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;

  // Avatar/Cover updates
  updateAvatar: (avatarUrl: string, avatarUrlKey?: string) => void;
  updateCover: (coverUrl: string, coverUrlKey?: string) => void;

  // Listings management
  addListing: (listing: Listing) => void;
  updateListing: (listingId: string, updates: Partial<Listing>) => void;
  removeListing: (listingId: string) => void;

  // Bookings management
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Hydration
  setHasHydrated: (state: boolean) => void;
}

export type ProfileStore = ProfileState & ProfileActions;
