export interface ToolPhoto {
  id?: string;
  file: File;
  previewUrl?: string;
}

export interface ToolInfo {
  ownerId: number;
  name: string;
  description: string;
  deposit: number;
  category: string;
  dailyRate: number;
  replacementValue: number;
}
