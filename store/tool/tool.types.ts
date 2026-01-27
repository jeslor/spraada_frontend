export interface ToolPhoto {
  id?: string;
  file?: File;
  previewUrl?: string;
  photoUrl?: string;
  photoUrlKey?: string;
}

export interface ToolInfo {
  profileId: number;
  userId?: number;
  name: string;
  description: string;
  depositCents: number;
  category: string;
  dailyPriceCents: number;
  replacementValue: number;
}

// Full tool type from API/database
export interface Tool {
  specialId: string;
  id: string;
  name: string;
  description: string;
  category: string;
  dailyPriceCents: number;
  depositCents: number;
  replacementValue: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  profileId: number;
  toolPhotos: {
    photoUrl: string;
    photoUrlKey: string;
  }[];
  profile?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    city?: string;
    country?: string;
    createdAt?: string;
  };
  bookingDetails?: {
    id: string;
    pickUpDate: string;
    returnDate: string;
    totalPrice: number;
    status: string;
    borrower?: {
      id: number;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
    owner?: {
      id: number;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  };
}

// Props for rental context
export interface RentalInfo {
  pickUpDate: string;
  returnDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

// Store state types
export interface ToolState {
  // My tools (owned by the current user)
  myTools: Tool[];

  // Rented tools (tools I've rented out to others)
  rentedTools: Tool[];

  // Borrowed tools (tools I've borrowed from others)
  borrowedTools: Tool[];

  // Featured tools for homepage or browsing
  featuredTools: Tool[];

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Hydration state (for SSR)
  _hasHydrated: boolean;
}

//search params for tools
export interface SearchToolsParams {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

//response type for searching tools
export interface SearchToolsResponse {
  data: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ToolActions {
  // Core actions
  setMyTools: (tools: Tool[]) => void;
  setRentedTools: (tools: Tool[]) => void;
  setBorrowedTools: (tools: Tool[]) => void;
  setFeaturedTools: (tools: Tool[]) => void;
  clearTools: () => void;

  // Single tool operations
  addTool: (tool: Tool) => void;
  updateTool: (toolId: string, updates: Partial<Tool>) => void;
  removeTool: (toolId: string) => void;

  // Getters
  getToolById: (toolId: string) => Tool | undefined;

  // Async actions
  fetchMyTools: (profileId: number) => Promise<void>;

  // Loading state setters
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Hydration
  setHasHydrated: (state: boolean) => void;
}

export type ToolStore = ToolState & ToolActions;
