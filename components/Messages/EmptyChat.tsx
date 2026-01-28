"use client";
import { Icon } from "@iconify/react";

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 select-none">
      {/* Icon bubble */}
      <div className="mb-6 flex items-center justify-center w-28 h-28 rounded-full bg-primary-50 dark:bg-primary-900/30">
        <Icon
          icon="mdi:chat-outline"
          className="text-primary-500 dark:text-primary-400"
          width={56}
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Your messages
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Select a contact from the left to start a new conversation or start a
        conversation.
      </p>

      {/* Optional hint */}
      <div className="mt-6 flex items-center gap-2 text-xs text-primary-400 dark:text-gray-500">
        <Icon icon="mdi:cursor-default-outline" width={16} />
        <span>Choose a chat to begin</span>
      </div>
    </div>
  );
};

export default EmptyChat;
