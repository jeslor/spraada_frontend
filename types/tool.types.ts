export interface ToolPhoto {
  id?: string;
  file: File;
  previewUrl?: string;
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
