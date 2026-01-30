import React, { forwardRef } from "react";

type MessageLeftChatSkeletonProps = {
  attachRef?: boolean;
};

const MessageLeftChatSkeleton = forwardRef<
  HTMLDivElement,
  MessageLeftChatSkeletonProps
>(({ attachRef = false }, ref) => {
  return (
    <div className="flex-1 flex justify-center">
      <div
        ref={attachRef ? ref : undefined}
        className="w-[90%] overflow-y-auto py-4 space-y-4"
      >
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-3 rounded-lg
                       bg-primary-100 dark:bg-gray-800
                       animate-pulse"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-gray-700" />

            {/* Text */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-primary-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-2/4 bg-primary-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

MessageLeftChatSkeleton.displayName = "MessageLeftChatSkeleton";

export default MessageLeftChatSkeleton;
