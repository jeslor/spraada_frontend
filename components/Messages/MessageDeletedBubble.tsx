import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const MessageDeletedBubble = ({
  isFromCurrentUser,
}: {
  isFromCurrentUser: boolean;
}) => {
  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium max-w-[70%]  my-1 border border-gray-200 dark:border-gray-700 ${
        isFromCurrentUser ? "self-end" : "self-start"
      }`}
      style={{ fontStyle: "italic" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Icon icon="mdi:trash-can-outline" width={18} className="text-gray-400" />
      <span>This message was deleted</span>
    </motion.div>
  );
};

export default MessageDeletedBubble;
