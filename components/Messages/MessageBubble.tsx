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
import { Message, useMessageStore } from "@/store";
import { useClickOutside } from "@/Hooks/useClickOutside";
import { formatMessageTimestamp } from "@/lib/helpers/dateHelpers";
import MessageBubbleeLightBox from "./MessageBubbleeLightBox";

interface MessageBubbleProps {
  msg: Message;
  setChatHeightLocked?: (locked: boolean) => void;
  handleDeleteMessage: (messageId: string) => void;
  profileId: number | undefined;
  idx: number;
  isLastMessage: boolean;
}

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
    isLastMessage,
  }: MessageBubbleProps) => {
    // --- State ---
    const [showActions, setShowActions] = useState(false);
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

    const actionsRef = useRef<HTMLDivElement>(null);
    const moreBtnRef = useRef<HTMLButtonElement>(null);
    const isOwnMessage = msg.senderId === profileId;

    // --- Handlers ---
    const openLightbox = useCallback((index: number) => {
      setLightbox({ isOpen: true, index });
    }, []);

    // ----Store Hooks---
    const isNewMessage = useMessageStore((state) => state.isNewMessage);

    const closeLightbox = useCallback(() => {
      setLightbox((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const navigateLightbox = useCallback(
      (direction: "next" | "prev") => {
        const count = msg.mediaFiles?.length || 0;
        if (count <= 1) return;
        setLightbox((prev) => {
          let nextIndex =
            direction === "next" ? prev.index + 1 : prev.index - 1;
          if (nextIndex >= count) nextIndex = 0;
          if (nextIndex < 0) nextIndex = count - 1;
          return { ...prev, index: nextIndex };
        });
      },
      [msg.mediaFiles],
    );

    const toggleActions = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setShowActions((prev) => !prev);
    }, []);

    const onDelete = useCallback(() => {
      if (msg.id) handleDeleteMessage(msg.id);
      setShowActions(false);
    }, [msg.id, handleDeleteMessage]);

    // --- Hooks ---
    useClickOutside(actionsRef, () => setShowActions(false), moreBtnRef);

    useEffect(() => {
      setChatHeightLocked?.(showActions);
      return () => setChatHeightLocked?.(false);
    }, [showActions, setChatHeightLocked]);

    const timestamp = useMemo(
      () => formatMessageTimestamp(msg.createdAt),
      [msg.createdAt],
    );

    const BubbleContent = (
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word group/bubble relative ${
          isOwnMessage
            ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
        <AnimatePresence>
          {showActions && (
            <motion.div
              ref={actionsRef}
              style={{
                transformOrigin: isOwnMessage ? "top right" : "top left",
              }}
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -2, filter: "blur(2px)" }}
              transition={{
                type: "spring",
                stiffness: 1500,
                damping: 55,
                mass: 0.2,
              }}
              className={`absolute top-3 ${isOwnMessage ? "right-0" : "left-0"} min-w-[140px] overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 p-1 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-950/80 z-50`}
            >
              <div className="flex flex-col">
                <button
                  onClick={onDelete}
                  className="group flex items-center gap-3 px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 whitespace-nowrap"
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
                  className="flex items-center gap-3 px-3 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
          className={`opacity-0 group-hover/bubble:opacity-100 absolute ${isOwnMessage ? "-right-2" : "-left-2"} -top-2 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 p-1 transition-all hover:scale-110 z-10`}
          onClick={toggleActions}
        >
          <Icon
            icon="fa7-solid:angle-down"
            className="text-gray-500 dark:text-gray-300 text-[11px]"
          />
        </button>

        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

        {msg.mediaFiles && msg.mediaFiles.length > 0 && (
          <div className="mt-3 relative w-40 h-40 group/media">
            {msg.mediaFiles.map((file, i) => (
              <div
                key={file.mediaUrl || i}
                className={`absolute inset-0 cursor-pointer transition-all duration-500 ease-out ${getMediaCardStyle(i, msg.mediaFiles!.length)}`}
                onClick={() => openLightbox(0)}
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
        {isNewMessage && isLastMessage ? (
          <motion.div
            key={msg.id}
            layout
            initial={{
              opacity: 0,
              scale: 0.4,
              y: 10,
              transformOrigin: isOwnMessage ? "bottom right" : "bottom left",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 1200,
              damping: 40,
              mass: 0.8,
            }}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} w-full`}
          >
            {BubbleContent}
          </motion.div>
        ) : (
          BubbleContent
        )}

        {lightbox.isOpen && msg.mediaFiles && (
          <MessageBubbleeLightBox
            msg={msg}
            lightboxIndex={lightbox.index}
            closeLightbox={closeLightbox}
            nextImage={() => navigateLightbox("next")}
            prevImage={() => navigateLightbox("prev")}
          />
        )}
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
