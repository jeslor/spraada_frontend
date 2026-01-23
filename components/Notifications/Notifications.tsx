"use client";
import React, { useEffect, useRef } from "react";
import {
  useShowNotifications,
  useSetShowNotifications,
  useProfile,
  useGetNotifications,
  useNotifications,
  useUpdateNotificationsAndCounterAsRead,
} from "@/store";
import { Icon } from "@iconify/react";
import EachNotification from "./EachNotification";
import NoNotifications from "./NoNotifications";

const Notifications = () => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const showNotifications = useShowNotifications();
  const setShowNotifications = useSetShowNotifications();
  const getNotifications = useGetNotifications();
  const notifications = useNotifications();
  const profile = useProfile();
  const updateNotificationsAndCounterAsRead =
    useUpdateNotificationsAndCounterAsRead();

  useEffect(() => {
    return () => {
      // Mark notifications as read when component unmounts
      if (showNotifications && notifications.length > 0) {
        updateNotificationsAndCounterAsRead();
      }
    };
  }, [showNotifications, notifications.length]);
  const closeNotifications = () => {
    setShowNotifications(false);
  };

  //fetch notifications when the panel is opened
  useEffect(() => {
    if (showNotifications && profile?.id) {
      getNotifications(profile?.id!);
    }
  }, [showNotifications, profile?.id]);

  // close the notifications panel when clicking outside
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
          {notifications &&
            notifications.map((notification) => (
              <EachNotification
                key={notification.id}
                notification={notification}
              />
            ))}
          {notifications.length === 0 && <NoNotifications />}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
