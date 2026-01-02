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

export const useMyToolsCount = (): number =>
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

export const useToolActions = () => {
  const setMyTools = useToolStore((state) => state.setMyTools);
  const setRentedTools = useToolStore((state) => state.setRentedTools);
  const setBorrowedTools = useToolStore((state) => state.setBorrowedTools);
  const clearTools = useToolStore((state) => state.clearTools);
  const addTool = useToolStore((state) => state.addTool);
  const updateTool = useToolStore((state) => state.updateTool);
  const removeTool = useToolStore((state) => state.removeTool);
  const fetchMyTools = useToolStore((state) => state.fetchMyTools);
  const getToolById = useToolStore((state) => state.getToolById);

  return {
    setMyTools,
    setRentedTools,
    setBorrowedTools,
    clearTools,
    addTool,
    updateTool,
    removeTool,
    fetchMyTools,
    getToolById,
  };
};
