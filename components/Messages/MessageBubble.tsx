import React, { useEffect, useRef, useState } from "react";
import MessageBubbleeLightBox from "./MessageBubbleeLightBox";
import { Icon } from "@iconify/react";
import { Message } from "@/store";

interface messageBubbleProps {
  msg: Message;
  setChatHeightLocked?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteMessage: (messageId: string) => void;
  profileId: number | undefined;
  idx: number;
}

const MessageBubble = ({
  msg,
  setChatHeightLocked,
  handleDeleteMessage,
  profileId,
  idx,
}: messageBubbleProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [messageActions, setMessageActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () =>
    setLightboxIndex((prev) =>
      msg.mediaFiles && prev < msg.mediaFiles.length - 1 ? prev + 1 : prev
    );
  const prevImage = () =>
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const bubbleClass = `flex ${
    msg.senderId === profileId ? "justify-end" : "justify-start"
  }`;

  const getCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return `
        rotate-[-8deg] translate-x-[-6px] translate-y-[6px]
        group-hover:rotate-[-14deg]
        group-hover:translate-x-[-22px]
        group-hover:translate-y-[10px]
      `;
      case 1:
        return `
        z-20
        group-hover:-translate-y-1
        group-hover:scale-105
      `;
      case 2:
        return `
        rotate-[8deg] translate-x-[6px] translate-y-[6px]
        group-hover:rotate-[14deg]
        group-hover:translate-x-[22px]
        group-hover:translate-y-[10px]
        z-10
      `;
      default:
        return "";
    }
  };

  // Message Actions Handlers
  const handleOpenMessageActions = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessageActions(true);
  };

  const handleCloseMessageActions = () => {
    setMessageActions(false);
  };

  // Close message actions when clicking outside
  useEffect(() => {
    if (!messageActions) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        actionsRef.current &&
        !actionsRef.current.contains(target) &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(target)
      ) {
        setMessageActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [messageActions]);

  //prevent scroll when more actions is active
  useEffect(() => {
    if (setChatHeightLocked) {
      if (messageActions) {
        setChatHeightLocked(true);
      } else {
        setChatHeightLocked(false);
      }
    }
  }, [messageActions, setChatHeightLocked]);

  return (
    <div key={msg.id || idx} className={`${bubbleClass}`}>
      <pre
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word group/bubble relative ${
          msg.senderId === profileId
            ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
        {messageActions && (
          <div
            ref={actionsRef}
            className="absolute top-6 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md z-30 text-[12px] flex flex-col gap-y-0.5 py-2"
          >
            <button
              className="block w-full text-left px-4 py-0.5   text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
              onClick={() => {
                handleDeleteMessage(msg.id!);
                handleCloseMessageActions();
              }}
            >
              Delete Message
            </button>
          </div>
        )}
        <button
          ref={moreBtnRef}
          className="hidden bg-white group-hover/bubble:block absolute right-1 top-1 rounded text-[14px] p-0.5 hover:text-primary-50 hover:bg-primary-400 dark:hover:bg-primary-700"
          onClick={
            messageActions
              ? handleCloseMessageActions
              : handleOpenMessageActions
          }
          type="button"
        >
          <Icon icon="fa7-solid:angle-down" />
        </button>
        {msg.content}
        {msg.mediaFiles && msg.mediaFiles.length > 0 && (
          <div
            style={{ maxWidth: 180, maxHeight: 180 }}
            className="mt-2  relative w-44 h-44 group"
          >
            {msg.mediaFiles.map((file: any, index: number) => (
              <div
                key={index}
                className="absolute inset-0 cursor-pointer transition-all duration-500 ease-out"
                style={{ zIndex: index === 1 ? 20 : 10 }}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={file.mediaUrl}
                  alt="media"
                  className={`w-40 h-40 object-cover rounded-2xl 
                    border border-gray-200 dark:border-gray-700 
                    shadow-md transition-all duration-500 ease-out
                    ${msg.mediaFiles!.length > 1 ? getCardStyle(index) : ""}
                  `}
                  style={{ boxShadow: "0 6px 16px rgba(0,0,0,0.15)" }}
                />

                <span
                  className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded
      opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  View
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="text-[10px] text-right text-gray-400 mt-1">
          {msg.createdAt &&
            new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>
      </pre>
      {/* Lightbox */}
      {lightboxOpen && msg.mediaFiles && msg.mediaFiles.length > 0 && (
        <MessageBubbleeLightBox
          closeLightbox={closeLightbox}
          msg={msg}
          lightboxIndex={lightboxIndex}
          nextImage={nextImage}
          prevImage={prevImage}
        />
      )}
    </div>
  );
};

export default MessageBubble;
