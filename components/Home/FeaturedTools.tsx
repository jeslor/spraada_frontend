"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Tool } from "@/store";
import { getRandomTools } from "@/lib/actions/tools.actions";
import ToolCard from "@/components/Tools/ToolCard";
import ToolsSkeletonGrid from "@/components/Tools/ToolsSkeletonGrid";

interface FeaturedToolsProps {
  initialTools?: Tool[];
}

export const FeaturedTools = ({ initialTools }: FeaturedToolsProps) => {
  const [tools, setTools] = useState<Tool[]>(initialTools || []);
  const [isLoading, setIsLoading] = useState(!initialTools);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTools) {
      fetchTools();
    }
  }, [initialTools]);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRandomTools(12);
      setTools(data);
    } catch (err) {
      setError("Failed to load tools");
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-8 w-full max-w-[1400px] mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Discover Tools Near You
          </h2>
          <p className="text-gray-500 mt-1">
            Browse tools available in your community
          </p>
        </div>
        <Link
          href="/browse"
          className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          View All
          <Icon icon="solar:arrow-right-linear" width={18} />
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Icon
            icon="solar:danger-triangle-bold-duotone"
            className="text-amber-500 mx-auto mb-4"
            width={48}
          />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTools}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <ToolsSkeletonGrid count={8} variant="compact" />}

      {/* Tools Grid */}
      {!isLoading && !error && tools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} variant="compact" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && tools.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Icon
              icon="solar:box-bold-duotone"
              className="text-primary-500"
              width={40}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Tools Available Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Be the first to share your tools with the community!
          </p>
          <Link
            href="/toolbox/add"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Icon icon="solar:add-circle-bold" width={20} />
            List Your First Tool
          </Link>
        </div>
      )}

      {/* Mobile View All Link */}
      {!isLoading && !error && tools.length > 0 && (
        <div className="flex sm:hidden justify-center mt-6">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View All Tools
            <Icon icon="solar:arrow-right-linear" width={18} />
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedTools;
