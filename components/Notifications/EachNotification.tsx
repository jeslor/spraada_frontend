import React from "react";

interface EachNotificationProps {
  id: string;
  title: string;
  profileMediaFiles?: string[];
  contentMediaFiles?: string[];
  content: string;
  read: boolean;
  createdAt: string;
}

const EachNotification = ({
  notification,
}: {
  notification: EachNotificationProps;
}) => {
  const handleNotificationClick = () => {
    // Add your click handling logic here
  };
  return (
    <div onClick={handleNotificationClick} className="w-full">
      <div
        className={`px-4  flex items-center gap-1 mb-1  hover:bg-primary-700/10 cursor-pointer rounded-md `}
      >
        <div className="relative w-12 h-full flex">
          {notification.profileMediaFiles &&
            notification.profileMediaFiles.slice(0, 2).map((file, index) => (
              <img
                key={index}
                src={file}
                alt="notification media"
                className={` w-8 h-8  inline-block rounded-full border border-white object-cover shadow-md`}
                style={{
                  marginTop: `-${index * 6}px`,
                  marginLeft: `-${index * 20}px`,
                  zIndex: notification.profileMediaFiles!.length - index,
                }}
              />
            ))}
        </div>
        <div className="flex-1 py-2">
          <h3 className="font-semibold text-[14px]">{notification.title}</h3>
          <p className="text-[10px] text-gray-600">
            {notification.content}{" "}
            <span className="font-bold  text-gray-900">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EachNotification;
