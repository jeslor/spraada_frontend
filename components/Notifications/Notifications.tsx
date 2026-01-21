"use client";
import { useShowNotifications, useSetShowNotifications } from "@/store";
import { Icon } from "@iconify/react";

const Notifications = () => {
  const showNotifications = useShowNotifications();
  const setShowNotifications = useSetShowNotifications();

  const closeNotifications = () => {
    setShowNotifications(false);
  };
  return (
    <>
      {showNotifications && (
        <div className="absolute h-screen max-w-[500px] w-full top-0 left-0 z-60 bg-white shadow-lg border border-gray-200 rounded-md  ">
          <button
            onClick={closeNotifications}
            className="absolute top-0 right-0 cursor-pointer text-[18px]"
          >
            <Icon icon="ic:round-close" className="m-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
