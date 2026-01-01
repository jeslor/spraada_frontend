"use client";

import React, { useEffect, useState } from "react";
import ToolCard from "./ToolCard";
import ToolsSkeletonGrid from "./ToolsSkeletonGrid";
import { Tool } from "@/types/tool.types";
import { useProfile } from "@/store";
import NoTools from "./NoTools";
import { getToolsByOwner } from "@/lib/actions/tools.actions";

interface ToolContentProps {
  type: "owned" | "rented" | "borrowed";
  tools?: Tool[];
  isLoading?: boolean;
}

const ToolContent = ({ type }: ToolContentProps) => {
  const profile = useProfile();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tools based on type
  const fetchTools = async () => {
    try {
      const fetchedMyTools = await getToolsByOwner(profile?.id!);
      if (!fetchedMyTools) return;
      setTools(fetchedMyTools);
      console.log(fetchedMyTools);
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    }
  };

  useEffect(() => {
    if (type === "owned" && profile?.id) {
      setIsLoading(true);
      fetchTools().finally(() => setIsLoading(false));
    }
  }, [type, profile?.id]);

  // Handle edit tool
  const handleEdit = (tool: Tool) => {
    console.log("Edit tool:", tool.id);
    // TODO: Open edit modal
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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
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
            onEdit={type === "owned" ? handleEdit : undefined}
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
