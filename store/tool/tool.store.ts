import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ToolStore, ToolState, Tool } from "./tool.types";

import { getToolsByOwner } from "@/lib/actions/tools.actions";

// Initial state
const initialState: ToolState = {
  myTools: [],
  rentedTools: [],
  borrowedTools: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  _hasHydrated: false,
};

export const useToolStore = create<ToolStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ==================== Core Actions ====================

      setMyTools: (tools: Tool[]) => {
        set((state) => {
          state.myTools = tools;
          state.error = null;
        });
      },

      setRentedTools: (tools: Tool[]) => {
        set((state) => {
          state.rentedTools = tools;
          state.error = null;
        });
      },

      setBorrowedTools: (tools: Tool[]) => {
        set((state) => {
          state.borrowedTools = tools;
          state.error = null;
        });
      },

      clearTools: () => {
        set((state) => {
          state.myTools = [];
          state.rentedTools = [];
          state.borrowedTools = [];
          state.error = null;
          state.isLoading = false;
          state.isUpdating = false;
        });
      },

      // ==================== Single Tool Operations ====================

      addTool: (tool: Tool) => {
        set((state) => {
          state.myTools.push(tool);
        });
      },

      updateTool: (toolId: string, updates: Partial<Tool>) => {
        set((state) => {
          const index = state.myTools.findIndex((t) => t.id === toolId);
          if (index !== -1) {
            state.myTools[index] = { ...state.myTools[index], ...updates };
          }
        });
      },

      removeTool: (toolId: string) => {
        set((state) => {
          state.myTools = state.myTools.filter((t) => t.id !== toolId);
        });
      },

      // ==================== Getters ====================

      getToolById: (toolId: string): Tool | undefined => {
        const state = get();
        // Check in myTools first
        let tool = state.myTools.find((t) => t.id === toolId);
        if (tool) return tool;

        // Check in rentedTools
        tool = state.rentedTools.find((t) => t.id === toolId);
        if (tool) return tool;

        // Check in borrowedTools
        tool = state.borrowedTools.find((t) => t.id === toolId);
        return tool;
      },

      // ==================== Async Actions ====================

      fetchMyTools: async (profileId: number) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const tools = await getToolsByOwner(profileId);

          set((state) => {
            state.myTools = tools || [];
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Failed to fetch tools";
            state.isLoading = false;
          });
        }
      },

      // ==================== Loading State Setters ====================

      setLoading: (isLoading: boolean) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      // ==================== Hydration ====================

      setHasHydrated: (hydrated: boolean) => {
        set((state) => {
          state._hasHydrated = hydrated;
        });
      },
    })),
    {
      name: "tool-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        myTools: state.myTools,
        rentedTools: state.rentedTools,
        borrowedTools: state.borrowedTools,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
