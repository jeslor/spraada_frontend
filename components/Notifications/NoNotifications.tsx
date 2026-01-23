import React from "react";

const NoNotifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 48 48"
        className="w-16 h-16 mb-4 text-gray-300"
      >
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 14v10m0 4h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-lg font-semibold mb-1">No Notifications</div>
      <div className="text-sm">You're all caught up!</div>
    </div>
  );
};

export default NoNotifications;
