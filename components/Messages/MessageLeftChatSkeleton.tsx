import React from "react";

const MessageLeftChatSkeleton = () => {
  return (
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
  );
};

export default MessageLeftChatSkeleton;
