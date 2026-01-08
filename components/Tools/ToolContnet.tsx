"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToolsSkeletonGrid from "./ToolsSkeletonGrid";
import {
  useProfile,
  useMyTools,
  useRentedTools,
  useBorrowedTools,
  useToolsLoading,
  useFetchMyTools,
  useFetchRentedTools,
  useFetchBorrowedTools,
  useToolsHasHydrated,
  Tool,
  useSetMyTools,
  useSetBorrowedTools,
  useSetRentedTools,
} from "@/store";
import NoTools from "./NoTools";
import ToolCard from "./ToolCard";
import { deleteTool } from "@/lib/actions/tools.actions";
import { approveBooking } from "@/lib/actions/book.actions";
import toast from "react-hot-toast";

interface ToolContentProps {
  type?: "owned" | "rented" | "borrowed" | "all" | "search";
  tools?: Tool[];
  variant?: "default" | "compact";
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  gridClassName?: string;
}

const ToolContent = ({
  type = "owned",
  tools: propTools,
  variant = "default",
  isLoading: externalLoading,
  emptyState,
  gridClassName,
}: ToolContentProps) => {
  const router = useRouter();
  const profile = useProfile();
  const myTools = useMyTools();
  const setMyTools = useSetMyTools();
  const setBorrowedTools = useSetBorrowedTools();
  const setRentedTools = useSetRentedTools();
  const rentedTools = useRentedTools();
  const borrowedTools = useBorrowedTools();
  const storeLoading = useToolsLoading();
  const hasHydrated = useToolsHasHydrated();
  const fetchMyTools = useFetchMyTools();
  const fetchRentedTools = useFetchRentedTools();
  const fetchBorrowedTools = useFetchBorrowedTools();
  const [hasFetched, setHasFetched] = useState(false);

  // Memoize profileId to prevent unnecessary effect runs
  const profileId = profile?.id;

  // Determine if using external tools (search/browse mode)
  const isExternalMode =
    type === "search" || type === "all" || propTools !== undefined;

  // Fetch tools based on type (only if not already loaded and not in external mode)
  useEffect(() => {
    if (isExternalMode) return; // Skip fetching if tools are provided externally

    if (profileId && hasHydrated && !hasFetched) {
      if (type === "owned" && myTools.length === 0) {
        setHasFetched(true);
        fetchMyTools(profileId);
      } else if (type === "rented" && rentedTools.length === 0) {
        setHasFetched(true);
        fetchRentedTools(profileId);
      } else if (type === "borrowed" && borrowedTools.length === 0) {
        setHasFetched(true);
        fetchBorrowedTools(profileId);
      }
    }
  }, [
    type,
    profileId,
    hasHydrated,
    myTools.length,
    rentedTools.length,
    borrowedTools.length,
    hasFetched,
    fetchMyTools,
    fetchRentedTools,
    fetchBorrowedTools,
    isExternalMode,
  ]);

  // Handle delete tool
  const handleDelete = async (tool: Tool) => {
    try {
      const deleteToolResult = await deleteTool(tool, profileId!);
      if (deleteToolResult.success) {
        // Refresh tools list

        if (type === "owned") {
          setMyTools(myTools.filter((t) => t.id !== tool.id));
        } else if (type === "rented") {
          setRentedTools(rentedTools.filter((t) => t.id !== tool.id));
        } else if (type === "borrowed") {
          setBorrowedTools(borrowedTools.filter((t) => t.id !== tool.id));
        }
        toast.success(deleteToolResult.data);
      } else {
        console.error("Failed to delete tool:", deleteToolResult.data);
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  // Handle rent action
  const handleRent = (tool: Tool) => {
    console.log("Rent tool:", tool.id);
    // TODO: Open rental modal
  };

  // Handle approve booking
  const handleApproveBooking = async (bookingId: string) => {
    try {
      const result = await approveBooking(bookingId);
      if (result.success) {
        toast.success("Booking approved successfully!");
        // Refresh the rented tools list
        if (profileId) {
          await fetchRentedTools(profileId);
        }
      } else {
        toast.error(result.data || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking");
    }
  };

  // Get the appropriate tools based on type
  const tools = isExternalMode
    ? propTools || []
    : type === "owned"
    ? myTools
    : type === "rented"
    ? rentedTools
    : borrowedTools;

  // Determine loading state
  const isLoading =
    externalLoading !== undefined
      ? externalLoading
      : !hasHydrated ||
        storeLoading ||
        (profile?.id && tools.length === 0 && !hasFetched);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="mt-8">
        <ToolsSkeletonGrid
          count={variant === "compact" ? 12 : 6}
          variant={variant}
        />
      </div>
    );
  }

  // Empty state
  if (tools.length === 0) {
    // Use custom empty state if provided
    if (emptyState) {
      return <>{emptyState}</>;
    }
    // Use NoTools only for owned/rented/borrowed types
    if (type !== "search" && type !== "all") {
      return <NoTools type={type} />;
    }
    return null;
  }

  // Determine grid class
  const gridClass =
    gridClassName ||
    (variant === "compact"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : variant === "default"
      ? "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-3 gap-y-6"
      : "");

  // Determine card variant based on type
  const getCardVariant = () => {
    if (variant === "compact") return "compact";
    if (type === "owned") return "default";
    if (type === "rented") return "rental";
    if (type === "borrowed") return "borrowed";
    return "compact"; // For search/all, use compact
  };

  // Tools grid
  return (
    <div className={type !== "search" && type !== "all" ? "mt-8" : ""}>
      <div className={gridClass}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            variant={getCardVariant()}
            onDelete={type === "owned" ? handleDelete : undefined}
            onRent={
              type !== "owned" && type !== "search" && type !== "all"
                ? handleRent
                : undefined
            }
            onApproveBooking={
              type === "rented" ? handleApproveBooking : undefined
            }
            showOwner={
              type === "borrowed" || type === "search" || type === "all"
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ToolContent;
