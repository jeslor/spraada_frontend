"use client";

import React, { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Tool } from "@/types/tool.types";
import { getToolById } from "@/lib/actions/tools.actions";
import { useProfile, useToolById, useToolActions } from "@/store";
import EditToolForm from "@/components/Tools/EditToolForm";
import LoadingUI from "@/components/ui/Loading";

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const profile = useProfile();
  const toolId = params.toolId as string;

  // Try to get tool from store first
  const toolFromStore = useToolById(toolId);
  const { fetchMyTools } = useToolActions();

  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToolFromStoreOrAPI = async () => {
    setIsLoading(true);
    setError(null);

    // If tool is in store, use it directly (no API call)
    if (toolFromStore) {
      // Check if the user owns this tool
      if (profile && toolFromStore.profileId !== profile.id) {
        setError("You don't have permission to edit this tool");
        setIsLoading(false);
        return;
      }
      setTool(toolFromStore);
      setIsLoading(false);
      return;
    }

    // If not in store, fetch from API as fallback
    try {
      const fetchedTool = await getToolById(toolId);

      if (!fetchedTool) {
        setError("Tool not found");
        return;
      }

      // Check if the user owns this tool
      if (profile && fetchedTool.profileId !== profile.id) {
        setError("You don't have permission to edit this tool");
        return;
      }

      setTool(fetchedTool);
    } catch (err) {
      console.error("Failed to fetch tool:", err);
      setError("Failed to load tool. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toolId && profile?.id) {
      getToolFromStoreOrAPI();
    }
  }, [toolId, profile?.id, toolFromStore]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingUI />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center ">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Icon
              icon="solar:danger-triangle-bold"
              className="text-red-500"
              width={32}
            />
          </div>
          <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
            {error}
          </h2>
          <Link
            href="/toolbox"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-bold"
          >
            <Icon icon="solar:arrow-left-bold" width={20} />
            Back to Toolbox
          </Link>
        </div>
      </div>
    );
  }

  //Just take the user back if tool not found
  if (!tool && !isLoading) {
    return redirect("/toolbox");
  }

  return (
    <section className="py-8 px-0 xl:px-10 flex flex-col w-full">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/toolbox"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-4 hover:underline font-bold"
        >
          <Icon icon="solar:arrow-left-bold" width={20} />
          <span>Back to Toolbox</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 dark:text-primary-100">
          Edit Tool
        </h1>
        <p className="text-primary-500 dark:text-primary-400 mt-2">
          Update your tool listing information
        </p>
      </div>

      {/* Edit Form */}
      <EditToolForm
        tool={tool!}
        onSuccess={() => {
          router.push("/toolbox");
        }}
      />
    </section>
  );
}
