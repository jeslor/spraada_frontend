"use client";
import { NavItem } from "@/lib/constants/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  useAllUnReadMessagesCount,
  useNotificationCounter,
  useProfile,
  useUser,
} from "@/store";
import { useEffect, useState } from "react";

interface EachSidebarProps {
  item: NavItem;
  isActive: (href: string) => boolean;
  handleShowNotifications: () => void;
  handleRouteToPage: (href: string) => void;
  showLabels: boolean;
  hasHydrated: boolean;
  initials: string;
}

const EachSidebar = ({
  item,
  isActive,
  handleShowNotifications,
  handleRouteToPage,
  showLabels,
  hasHydrated,
  initials,
}: EachSidebarProps) => {
  const [animateBubble, setAnimateBubble] = useState(false);
  const notificationCounter = useNotificationCounter();
  const allUnreadMessagesCount = useAllUnReadMessagesCount();
  const profile = useProfile();
  const user = useUser();

  useEffect(() => {
    // Animate bubble every time notification count changes
    setAnimateBubble(true);
    const timeout = setTimeout(() => setAnimateBubble(false), 350);
    return () => clearTimeout(timeout);
  }, [notificationCounter.count, allUnreadMessagesCount]);

  const href = item.isProfile && user?.id ? `/profile/${user.id}` : item.href;
  const active = isActive(href);
  return !item.isProfile ? (
    <button
      key={item.name}
      onClick={
        item.name.toLowerCase() === "notifications"
          ? handleShowNotifications
          : () => handleRouteToPage(href)
      }
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 font-medium relative cursor-pointer",
        active
          ? "bg-gray-100 text-gray-900 font-bold"
          : "text-gray-700 hover:bg-gray-50"
      )}
    >
      {((item.name.toLowerCase() === "messages" &&
        allUnreadMessagesCount > 0) ||
        (item.name.toLowerCase() === "notifications" &&
          notificationCounter.count > 0)) && (
        <span
          className={`absolute bg-red-700 text-white text-[10px] font-semibold right-3 px-1 py-0.5 rounded-full min-w-[15px] h-4 flex items-center justify-center${
            animateBubble ? " animate-pop-bubble" : ""
          }`}
        >
          {item.name.toLowerCase() === "messages"
            ? allUnreadMessagesCount > 99
              ? "99+"
              : allUnreadMessagesCount
            : notificationCounter.count}
        </span>
      )}
      <Icon
        icon={active ? item.activeIcon : item.icon}
        className="text-2xl shrink-0 text-primary-600 font-bold"
      />
      {showLabels && (
        <span className="text-base whitespace-nowrap">{item.name}</span>
      )}
    </button>
  ) : (
    hasHydrated && user && (
      <button
        key={item.name}
        onClick={() => handleRouteToPage(href)}
        className={cn(
          "flex items-center justify-start gap-4 px-3 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer",
          active
            ? "bg-gray-100 text-gray-900 font-bold"
            : "text-gray-700 hover:bg-gray-50"
        )}
      >
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <Icon
            icon={active ? item.activeIcon : item.icon}
            className="text-2xl shrink-0"
          />
        )}
        {showLabels && (
          <span className="text-base text-start truncate w-[162px] whitespace-nowrap">
            {user.isOnboarded
              ? `${profile?.firstName} ${initials.charAt(1) || ""}`
              : item.name}
          </span>
        )}
      </button>
    )
  );
};

export default EachSidebar;
