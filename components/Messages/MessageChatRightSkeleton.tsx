import React from "react";

function MessageChatRightSkeleton() {
  return (
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
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
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
  );
}

export default MessageChatRightSkeleton;
