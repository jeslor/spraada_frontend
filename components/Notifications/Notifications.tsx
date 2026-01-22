"use client";
import React, { useEffect, useRef } from "react";
import { useShowNotifications, useSetShowNotifications } from "@/store";
import { Icon } from "@iconify/react";
import EachNotification from "./EachNotification";

const notifications = [
  {
    id: "1",
    title: "New Message",
    content: "You have received a new message from John.",
    read: false,
    createdAt: "2024-06-01T10:00:00Z",
    profileMediaFiles: [
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
    ],
    contentMediaFiles: [
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Friend Request",
    content: "Anna has sent you a friend request.",
    read: true,
    createdAt: "2024-05-30T14:30:00Z",
  },
  {
    id: "3",
    title: "Event Reminder",
    content: "Don't forget the meeting tomorrow at 3 PM.",
    read: false,
    createdAt: "2024-05-29T09:15:00Z",
    profileMediaFiles: [
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
      {
        mediaUrl:
          "https://spraada.s3.eu-north-1.amazonaws.com/chat_media/012dabdd-4fff-4886-9965-4a46fbfb0c61-ezgif-3cbdfb24fb0eea27.jpg",
      },
    ],
  },
];

const Notifications = () => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const showNotifications = useShowNotifications();
  const setShowNotifications = useSetShowNotifications();

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ left: showNotifications ? "0" : "-100%" }}
      ref={notificationRef}
      className={`absolute h-screen max-w-[500px] w-full top-0 left-0 z-60 bg-white shadow-lg border border-gray-200 rounded-md transition-left duration-300 overflow-y-auto`}
    >
      <div className="relative h-full flex flex-col scrollbar-hide">
        <div className="sticky top-0 bg-white border-b  z-10">
          <h2 className="text-xl font-semibold p-4  ">Notifications</h2>
          <button
            onClick={closeNotifications}
            className="absolute top-0 right-0 cursor-pointer text-[18px]"
          >
            <Icon icon="ic:round-close" className="m-4" />
          </button>
        </div>
        <div className="flex-1   px-4 py-2 text-primary overflow-y-auto scrollbar-hide">
          {/* Notifications content goes here */}
          {notifications.map((notification) => (
            <EachNotification
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
