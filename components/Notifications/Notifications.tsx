"use client";
import React, { useEffect, useRef } from "react";
import { useShowNotifications, useSetShowNotifications } from "@/store";
import { Icon } from "@iconify/react";

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
      <button
        onClick={closeNotifications}
        className="absolute top-0 right-0 cursor-pointer text-[18px]"
      >
        <Icon icon="ic:round-close" className="m-4" />
      </button>
    </div>
  );
};

export default Notifications;
