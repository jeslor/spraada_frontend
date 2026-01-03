import { useProfile } from "../profile/profile.selectors";
import { useToolStore } from "./tool.store";
import { Tool } from "@/types/tool.types";

// ==================== Basic Selectors ====================

export const useMyTools = (): Tool[] => useToolStore((state) => state.myTools);

export const useRentedTools = (): Tool[] =>
  useToolStore((state) => state.rentedTools);

export const useBorrowedTools = (): Tool[] =>
  useToolStore((state) => state.borrowedTools);

export const useToolsLoading = (): boolean =>
  useToolStore((state) => state.isLoading);

export const useToolsUpdating = (): boolean =>
  useToolStore((state) => state.isUpdating);

export const useToolsError = (): string | null =>
  useToolStore((state) => state.error);

export const useToolsHasHydrated = (): boolean =>
  useToolStore((state) => state._hasHydrated);

// ==================== Derived Selectors ====================

export const useToolById = (toolId: string): Tool | undefined => {
  return useToolStore((state) => {
    // Check in myTools first
    let tool = state.myTools.find((t) => t.id === toolId);
    if (tool) return tool;

    // Check in rentedTools
    tool = state.rentedTools.find((t) => t.id === toolId);
    if (tool) return tool;

    // Check in borrowedTools
    return state.borrowedTools.find((t) => t.id === toolId);
  });
};

export const useMyToolsStoreCount = (): number =>
  useToolStore((state) => state.myTools.length);

export const useRentedToolsCount = (): number =>
  useToolStore((state) => state.rentedTools.length);

export const useBorrowedToolsCount = (): number =>
  useToolStore((state) => state.borrowedTools.length);

export const useAvailableTools = (): Tool[] =>
  useToolStore((state) => state.myTools.filter((t) => t.available));

export const useUnavailableTools = (): Tool[] =>
  useToolStore((state) => state.myTools.filter((t) => !t.available));

export const isToolOwnedByUser = (tool: Tool): boolean => {
  const profile = useProfile();
  return tool.profileId === profile?.id;
};

export const isFavorite = (toolId: string): boolean => {
  const profile = useProfile();
  const favoriteTools = profile?.favoriteTools || [];
  return favoriteTools.some((tool: Tool) => tool.id === toolId);
};

// ==================== Action Hooks ====================

// Individual action hooks for stable references
export const useSetMyTools = () => useToolStore((state) => state.setMyTools);

export const useSetRentedTools = () =>
  useToolStore((state) => state.setRentedTools);

export const useSetBorrowedTools = () =>
  useToolStore((state) => state.setBorrowedTools);

export const useClearTools = () => useToolStore((state) => state.clearTools);

export const useAddTool = () => useToolStore((state) => state.addTool);

export const useUpdateToolAction = () =>
  useToolStore((state) => state.updateTool);

export const useRemoveTool = () => useToolStore((state) => state.removeTool);

export const useFetchMyTools = () =>
  useToolStore((state) => state.fetchMyTools);

export const useGetToolById = () => useToolStore((state) => state.getToolById);

// Combined actions hook (use individual hooks above when possible for better performance)
export const useToolActions = () => {
  return {
    setMyTools: useSetMyTools(),
    setRentedTools: useSetRentedTools(),
    setBorrowedTools: useSetBorrowedTools(),
    clearTools: useClearTools(),
    addTool: useAddTool(),
    updateTool: useUpdateToolAction(),
    removeTool: useRemoveTool(),
    fetchMyTools: useFetchMyTools(),
    getToolById: useGetToolById(),
  };
};
