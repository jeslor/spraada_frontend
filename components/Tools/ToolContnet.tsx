"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolsSkeletonGrid from "./ToolsSkeletonGrid";
import { Tool } from "@/types/tool.types";
import {
  useProfile,
  useMyTools,
  useToolsLoading,
  useToolActions,
} from "@/store";
import NoTools from "./NoTools";
import ToolCard from "./ToolCard";

interface ToolContentProps {
  type: "owned" | "rented" | "borrowed";
}

const ToolContent = ({ type }: ToolContentProps) => {
  const router = useRouter();
  const profile = useProfile();
  const myTools = useMyTools();
  const isLoading = useToolsLoading();
  const { fetchMyTools } = useToolActions();

  // Fetch tools based on type (only if not already loaded)
  useEffect(() => {
    if (type === "owned" && profile?.id && myTools.length === 0) {
      fetchMyTools(profile.id);
    }
  }, [type, profile?.id]);

  // Handle edit tool - navigate to edit page
  const handleEdit = (tool: Tool) => {
    router.push(`/toolbox/edit/${tool.id}`);
  };

  // Handle delete tool
  const handleDelete = (tool: Tool) => {
    console.log("Delete tool:", tool.id);
    // TODO: Show confirmation dialog
  };

  // Handle rent action
  const handleRent = (tool: Tool) => {
    console.log("Rent tool:", tool.id);
    // TODO: Open rental modal
  };

  // Get the appropriate tools based on type
  const tools = type === "owned" ? myTools : [];

  // Loading state
  if (isLoading && tools.length === 0) {
    return (
      <div className="mt-8">
        <ToolsSkeletonGrid count={6} variant="default" />
      </div>
    );
  }

  // Empty state
  if (tools.length === 0 && !isLoading) {
    return <NoTools type={type} />;
  }

  // Tools grid
  return (
    <div className="mt-8 ">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-3 gap-y-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            variant={
              type === "owned"
                ? "default"
                : type === "rented"
                ? "rental"
                : "borrowed"
            }
            onDelete={type === "owned" ? handleDelete : undefined}
            onRent={type !== "owned" ? handleRent : undefined}
            showOwner={type === "borrowed"}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolContent;
