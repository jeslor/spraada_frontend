import React from "react";

const MessageBubble = ({
  msg,
  profileId,
  idx,
}: {
  msg: any;
  profileId: number | undefined;
  idx: number;
}) => {
  return (
    <div
      key={msg.id || idx}
      className={`flex ${
        msg.senderId === profileId ? "justify-end" : "justify-start"
      }`}
    >
      <pre
        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm font-medium wrap-break-word ${
          msg.senderId === profileId
            ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
        }`}
      >
        {msg.content}
        {msg.mediaFiles && msg.mediaFiles.length > 0 && (
          <div className="mt-2">
            {msg.mediaFiles.map((media: any, i: number) => (
              <img
                key={i}
                src={media.mediaUrl}
                alt="attachment"
                className="rounded-lg max-h-48 border mt-1"
              />
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
    </div>
  );
};

export default MessageBubble;
