import React from "react";

const ChatLoading = () => {
  return (
    <div className="flex h-full w-full animate-pulse">
      {/* ChatLeft Skeleton */}
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-primary-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        {/* User List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ChatRight Skeleton */}
      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4" />
          <div className="flex-1">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide space-y-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="h-20 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-6">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="w-10 h-10 ml-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ChatLoading;
