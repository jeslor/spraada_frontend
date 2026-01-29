"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Message } from "@/store";
import MessageBubbleeLightBox from "./MessageBubbleeLightBox";
import { useClickOutside } from "@/Hooks/useClickOutside";

interface MessageBubbleProps {
  msg: Message;
  setChatHeightLocked?: (locked: boolean) => void;
  handleDeleteMessage: (messageId: string) => void;
  profileId: number | undefined;
  idx: number;
  isLast: boolean;
}

/** * Senior Tip: Move static style generators outside the component
 * to avoid re-allocation on every render.
 */
const getMediaCardStyle = (index: number, total: number) => {
  if (total <= 1) return "";
  switch (index) {
    case 0:
      return "rotate-[-8deg] translate-x-[-6px] translate-y-[6px] group-hover:rotate-[-14deg] group-hover:translate-x-[-22px] group-hover:translate-y-[10px]";
    case 1:
      return "z-20 group-hover:-translate-y-1 group-hover:scale-105";
    case 2:
      return "rotate-[8deg] translate-x-[6px] translate-y-[6px] group-hover:rotate-[14deg] group-hover:translate-x-[22px] group-hover:translate-y-[10px] z-10";
    default:
      return "";
  }
};

const MessageBubble = React.memo(
  ({
    msg,
    setChatHeightLocked,
    handleDeleteMessage,
    profileId,
    idx,
    isLast,
  }: MessageBubbleProps) => {
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const [showActions, setShowActions] = useState(false);

    const actionsRef = useRef<HTMLDivElement>(null);
    const moreBtnRef = useRef<HTMLButtonElement>(null);

    const isOwnMessage = msg.senderId === profileId;

    // Custom hook for cleaner "click outside" logic
    useClickOutside(
      actionsRef,
      () => setShowActions(false),
      moreBtnRef, // We pass this so clicking the button itself doesn't trigger "outside"
    );

    // Sync scroll lock with parent
    useEffect(() => {
      setChatHeightLocked?.(showActions);
      return () => setChatHeightLocked?.(false);
    }, [showActions, setChatHeightLocked]);

    // Memoize formatted time
    const timestamp = useMemo(() => {
      if (!msg.createdAt) return "";
      return new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }, [msg.createdAt]);

    const toggleActions = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setShowActions((prev) => !prev);
    }, []);

    const onDelete = useCallback(() => {
      if (msg.id) handleDeleteMessage(msg.id);
      setShowActions(false);
    }, [msg.id, handleDeleteMessage]);

    /**
     * Component UI logic separated from the wrapper to avoid duplication
     */
    const BubbleContent = (
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word group/bubble relative ${
          isOwnMessage
            ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
        {/* Action Dropdown */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              ref={actionsRef}
              style={{ transformOrigin: "top right" }}
              // Use "Filter Blur" to simulate motion blur—it hides frame gaps at high speeds
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, y: -2, filter: "blur(2px)" }}
              transition={{
                type: "spring",
                stiffness: 1500, // Extremely high stiffness for instant start
                damping: 55, // High damping to stop the movement instantly
                mass: 0.2, // Low mass makes the object feel "weightless"
              }}
              className="absolute top-3 right-0 min-w-[140px] overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-950/80 z-50"
            >
              <div className="flex flex-col">
                <button
                  onClick={onDelete}
                  className="group flex items-center gap-3 px-3 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40 whitespace-nowrap"
                >
                  <Icon
                    icon="heroicons:trash"
                    className="text-sm transition-transform group-hover:scale-110"
                  />
                  Delete Message
                </button>

                <div className="mx-2 h-px bg-gray-200/50 dark:bg-gray-800/50" />

                <button
                  onClick={() => setShowActions(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Icon icon="heroicons:x-mark" className="text-sm" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={moreBtnRef}
          className="opacity-0 group-hover/bubble:opacity-100 absolute -right-2 -top-2 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 p-1 transition-opacity hover:scale-110 z-10"
          onClick={toggleActions}
        >
          <Icon
            icon="fa7-solid:angle-down"
            className="text-gray-500 dark:text-gray-300 text-[11px]"
          />
        </button>

        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

        {/* Media Rendering */}
        {msg.mediaFiles && msg.mediaFiles.length > 0 && (
          <div className="mt-3 relative w-40 h-40 group/media">
            {msg.mediaFiles.map((file: any, i: number) => (
              <div
                key={file.mediaUrl || i}
                className={`absolute inset-0 cursor-pointer transition-all duration-500 ease-out ${getMediaCardStyle(i, msg.mediaFiles!.length)}`}
                onClick={() => setLightbox({ open: true, index: i })}
              >
                <img
                  src={file.mediaUrl}
                  alt="attachment"
                  className="w-full h-full object-cover rounded-xl border border-white/20 shadow-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div
          className={`text-[10px] mt-1 opacity-60 ${isOwnMessage ? "text-right" : "text-left"}`}
        >
          {timestamp}
        </div>
      </div>
    );

    return (
      <div
        className={`flex w-full mb-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        {isLast ? (
          <motion.div
            key={msg.id}
            layout
            // WhatsApp style: Pop from the side and slightly from below
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 4,
              // Origin ensures the 'pop' starts from the corner tail
              transformOrigin: isOwnMessage ? "bottom right" : "bottom left",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              // WhatsApp animations are very fast and tight
              type: "spring",
              stiffness: 1500, // Increased for speed
              damping: 35, // Balanced to prevent too much "bouncing"
              mass: 0.8, // Lighter mass makes it move quicker
            }}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} w-full origin-bottom`}
          >
            {BubbleContent}
          </motion.div>
        ) : (
          BubbleContent
        )}
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
