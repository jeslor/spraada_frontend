import React from "react";
import ToolsSkeletonGrid from "./ToolsSkeletonGrid";

const ToolsSkeleton = () => {
  return (
    <section className="py-8 w-full max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
        </div>
      </div>
      <ToolsSkeletonGrid count={8} variant="compact" />
    </section>
  );
};

export default ToolsSkeleton;
