export interface ToolPhoto {
  id?: string;
  file?: File;
  previewUrl?: string;
  photoUrl?: string;
  photoUrlKey?: string;
}

export interface ToolInfo {
  profileId: number;
  name: string;
  description: string;
  depositCents: number;
  category: string;
  dailyPriceCents: number;
  replacementValue: number;
}

// Full tool type from API/database
export interface Tool {
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
    city?: string;
    country?: string;
  };
}

// Props for rental context
export interface RentalInfo {
  startDate: string;
  endDate: string;
  totalCents: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
}
