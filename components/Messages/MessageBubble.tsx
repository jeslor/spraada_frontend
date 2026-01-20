import React, { useState } from "react";
import MessageBubbleeLightBox from "./MessageBubbleeLightBox";

const MessageBubble = ({
  msg,
  profileId,
  idx,
}: {
  msg: any;
  profileId: number | undefined;
  idx: number;
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  return (
    <div key={msg.id || idx} className={bubbleClass}>
      <pre
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word ${
          msg.senderId === profileId
            ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
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
      ${getCardStyle(index)}
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
