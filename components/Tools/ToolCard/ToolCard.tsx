"use client";

import { Tool } from "@/store";

import { BookStatus } from "@/lib/actions/book.actions";
import RentalCard from "./RentalBorrowToolCard";
import DefaultCard from "./DefaultToolCard";
import CompactCard from "./CompactToolCard";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "compact" | "rental" | "borrowed";
  onDelete?: (toolId: Tool) => void;
  onRent?: (toolId: Tool) => void;
  onApproveBooking?: (bookingId: string, status: BookStatus) => void;
  onCancelBooking?: (bookingId: string, status: BookStatus) => void;
  showOwner?: boolean;
  isDeleting?: boolean;
}

// Compact variant - Airbnb-style grid listing

// Get status color
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "confirmed":
      return "bg-primary-100 text-primary-700 border-primary-200";
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Main ToolCard component
export const ToolCard = ({
  tool,
  variant = "default",
  onDelete,
  onApproveBooking,
  onCancelBooking,
  isDeleting,
}: ToolCardProps) => {
  switch (variant) {
    case "compact":
      return <CompactCard tool={tool} />;
    case "rental":
    case "borrowed":
      return (
        <RentalCard
          tool={tool}
          variant={variant}
          onApproveBooking={onApproveBooking}
          onCancelBooking={onCancelBooking}
        />
      );
    default:
      return (
        <DefaultCard tool={tool} onDelete={onDelete} isDeleting={isDeleting} />
      );
  }
};

export default ToolCard;
