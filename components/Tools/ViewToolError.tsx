"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

const ViewToolError = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
          <Icon
            icon="solar:box-minimalistic-broken"
            className="text-red-500"
            width={48}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tool Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This tool may have been removed or the link is incorrect.
        </p>
        <Link
          href="/toolbox"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" width={18} />
          Browse Tools
        </Link>
      </div>
    </div>
  );
};

export default ViewToolError;
