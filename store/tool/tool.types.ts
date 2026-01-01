import { Tool } from "@/types/tool.types";

// Store state types
export interface ToolState {
  // My tools (owned by the current user)
  myTools: Tool[];

  // Rented tools (tools I've rented out to others)
  rentedTools: Tool[];

  // Borrowed tools (tools I've borrowed from others)
  borrowedTools: Tool[];

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Hydration state (for SSR)
  _hasHydrated: boolean;
}

export interface ToolActions {
  // Core actions
  setMyTools: (tools: Tool[]) => void;
  setRentedTools: (tools: Tool[]) => void;
  setBorrowedTools: (tools: Tool[]) => void;
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
