"use client";

import React, { useEffect, useState } from "react";
import ToolsSkeletonGrid from "./ToolsSkeletonGrid";
import {
  useProfile,
  useMyTools,
  useToolsLoading,
  useFetchMyTools,
  useToolsHasHydrated,
  Tool,
  useSetMyTools,
  useFetchBookings,
  useRentedToolsFromBookings,
  useBorrowedToolsFromBookings,
  useBookingsLoading,
  useBookingsHasHydrated,
  useUpdateBookingStatus,
  useSetProfileStats,
} from "@/store";
import NoTools from "./NoTools";
import ToolCard from "./ToolCard/ToolCard";
import { deleteTool } from "@/lib/actions/tools.actions";
import { BookStatus, updateBookingStatus } from "@/lib/actions/book.actions";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const profile = useProfile();
  const myTools = useMyTools();
  const setMyTools = useSetMyTools();
  const rentedTools = useRentedToolsFromBookings();
  const borrowedTools = useBorrowedToolsFromBookings();
  const toolsLoading = useToolsLoading();
  const bookingsLoading = useBookingsLoading();
  const toolsHydrated = useToolsHasHydrated();
  const bookingsHydrated = useBookingsHasHydrated();
  const fetchMyTools = useFetchMyTools();
  const fetchBookings = useFetchBookings();
  const setProfileStats = useSetProfileStats();
  const updateBookingStatusInStore = useUpdateBookingStatus();
  const [hasFetchedTools, setHasFetchedTools] = useState(false);

  // Memoize profileId to prevent unnecessary effect runs
  const profileId = profile?.id;

  // Determine if using external tools (search/browse mode)
  const isExternalMode =
    type === "search" || type === "all" || propTools !== undefined;

  // Fetch tools based on type (only if not already loaded and not in external mode)
  useEffect(() => {
    if (isExternalMode) return; // Skip fetching if tools are provided externally

    if (profileId && toolsHydrated && !hasFetchedTools) {
      if (type === "owned" && myTools.length === 0) {
        setHasFetchedTools(true);
        fetchMyTools(profileId);
      }
    }
  }, [
    type,
    profileId,
    toolsHydrated,
    myTools.length,
    hasFetchedTools,
    fetchMyTools,
    isExternalMode,
  ]);

  // Handle delete tool
  const handleDelete = async (tool: Tool) => {
    setIsDeleting(true);
    try {
      const deleteToolResult = await deleteTool(tool, profileId!);
      if (deleteToolResult.success) {
        // Refresh tools list
        if (type === "owned") {
          setMyTools(myTools.filter((t) => t.id !== tool.id));
        }
        // For rented/borrowed, refetch bookings to update derived tools
        if ((type === "rented" || type === "borrowed") && profileId) {
          fetchBookings(profileId);
        }
        setProfileStats();

        toast.success(deleteToolResult.data);
      } else {
        console.error("Failed to delete tool:", deleteToolResult.data);
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle approve booking
  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookStatus
  ) => {
    alert(`Change booking ${bookingId} to status: ${status}`);
    try {
      // Update store immediately for instant UI feedback
      updateBookingStatusInStore(bookingId, status);
      // Then update backend
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success("Booking status updated successfully!");
        // Refresh bookings to ensure sync with backend
        if (profileId) {
          await fetchBookings(profileId);
        }
      } else {
        toast.error(result.data || "Failed to update booking");
        // Refresh to revert to actual state on failure
        if (profileId) {
          await fetchBookings(profileId);
        }
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
      // Refresh to revert to actual state on error
      if (profileId) {
        await fetchBookings(profileId);
      }
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

  console.log(rentedTools, borrowedTools, bookingsLoading, !bookingsHydrated);

  // Determine loading state
  const isLoading =
    externalLoading !== undefined
      ? externalLoading
      : type === "owned"
      ? !toolsHydrated ||
        toolsLoading ||
        (profile?.id && tools.length === 0 && !hasFetchedTools)
      : !bookingsHydrated || bookingsLoading;

  // Show skeleton while loading
  if (isLoading || bookingsHydrated === false) {
    // Use fullWidth skeletons for rentals and borrowed
    const isFullWidth = type === "rented" || type === "borrowed";
    return (
      <div className="mt-8">
        <ToolsSkeletonGrid
          count={variant === "compact" ? 12 : 6}
          variant={variant}
          fullWidth={isFullWidth}
        />
      </div>
    );
  }

  // Empty state
  if (!isLoading && tools.length === 0) {
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
      ? "grid sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6"
      : variant === "default"
      ? "grid sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-3 gap-y-6"
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
        {tools.map((tool: Tool) => (
          <ToolCard
            key={tool.specialId || tool.id}
            tool={tool}
            isDeleting={isDeleting}
            variant={getCardVariant()}
            onDelete={type === "owned" ? handleDelete : undefined}
            onCancelBooking={
              type === "rented" || type === "borrowed"
                ? handleUpdateBookingStatus
                : undefined
            }
            onApproveBooking={
              type === "rented" ? handleUpdateBookingStatus : undefined
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
