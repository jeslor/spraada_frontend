"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SpraadaButton } from "../ui/SpraadaButton";
import { Notification, useSetShowNotifications } from "@/store";
import { timeAgo } from "@/lib/helpers/dateHelpers";

const EachNotification = ({ notification }: { notification: Notification }) => {
  const Router = useRouter();
  const setShowNotifications = useSetShowNotifications();
  const handleNotificationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowNotifications(false);
    Router.push(`${notification.link}`);
  };

  const handleIsRead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Add your mark as read logic here to an independent notification
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`w-full ${
        notification.isRead ? "bg-white" : "bg-primary-100"
      }  hover:bg-gray-100 cursor-pointer`}
    >
      <div className="px-4 flex items-center justify-between gap-2 mb-2 hover:bg-primary-700/10 cursor-pointer rounded-md">
        {/* Profile images */}
        {(notification.profileMediaFiles?.length ?? 0) > 0 && (
          <div className="relative w-12 shrink-0 h-8 flex items-center">
            {notification.profileMediaFiles?.slice(0, 2).map((file, index) => (
              <img
                key={index}
                src={file.mediaUrl}
                alt="notification media"
                className="absolute w-8 h-8 rounded-full border border-white object-cover shadow-md"
                style={{
                  left: index * 12,
                  top: index * 2,
                  zIndex: (notification.profileMediaFiles?.length ?? 0) - index,
                }}
              />
            ))}
          </div>
        )}

        {/* TEXT AREA (important part) */}
        <div className="py-2 flex-1 min-w-0">
          <h3 className="font-semibold text-[14px] truncate text-primary-600">
            {notification.title}
          </h3>
          <div className="flex flex-wrap gap-x-2">
            <p className="text-[10px] text-gray-600 truncate ">
              {notification.content}
            </p>

            <span className="font-bold text-gray-900 text-[8px] -mt-0.2 block">
              {timeAgo(notification.createdAt!)}
            </span>
          </div>
        </div>

        {/* Right-side media */}
        {(notification.contentMediaFiles?.length ?? 0) > 0 ? (
          <div className="w-10 h-10 ">
            <img
              src={notification.contentMediaFiles?.[0].mediaUrl}
              alt="content media"
              className="w-10 h-10 object-cover rounded-md border border-gray-200"
            />
          </div>
        ) : (
          notification.isRead === false && (
            <div className="w-fit h-10  flex justify-end items-center">
              <SpraadaButton
                onClick={handleIsRead}
                className="text-[9px] text-nowrap h-5 px-2 py-3"
                variant="outline"
              >
                Mark as Read
              </SpraadaButton>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EachNotification;
