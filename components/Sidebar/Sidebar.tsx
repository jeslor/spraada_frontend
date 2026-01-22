"use client";

import { Session } from "@/lib/session/session";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { NavItem, navItems } from "@/lib/constants/navigation";
import {
  useProfile,
  useUser,
  useShowNotifications,
  useHasHydrated,
  useClearProfile,
  useProfileInitials,
  useClearTools,
  useClearBookings,
  useClearMessages,
  useSetShowNotifications,
  useFetchUnreadMessagesCount,
  useAllUnReadMessagesCount,
} from "@/store";
import { useAppSocket } from "@/Hooks/InitializeAppSocket";
import Notifications from "../Notifications/Notifications";

interface SidebarProps {
  session: Session | null;
}

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const Sidebar = ({ session }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  // Get profile from Zustand store
  const profile = useProfile();

  /* ✅ Hooks must be called at top-level */
  useAppSocket(profile?.id!);
  const setShowNotifications = useSetShowNotifications();
  const showNotifications = useShowNotifications();

  const user = useUser();
  const clearProfile = useClearProfile();
  const clearTools = useClearTools();
  const clearBookings = useClearBookings();
  const clearMessages = useClearMessages();
  const initials = useProfileInitials();
  const hasHydrated = useHasHydrated();
  const fetchUnreadMessagesCount = useFetchUnreadMessagesCount();
  const allUnreadMessagesCount = useAllUnReadMessagesCount();

  // On desktop, always expanded. On smaller screens, expand on hover.
  const isExpanded = isDesktop || isHovered;

  useEffect(() => {
    if (profile) {
      fetchUnreadMessagesCount(profile.id);
    }
  }, [profile, fetchUnreadMessagesCount]);

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", { method: "GET" });
    if (!response.ok) {
      console.error("Sign out failed:", await response.text());
      return;
    } else {
      // Clear profile and tools from Zustand store
      clearProfile();
      clearTools();
      clearBookings();
      clearMessages();
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => setShowLabels(true), 100);
    } else {
      // Delay hiding labels for smooth transition
      const timeout = setTimeout(() => setShowLabels(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleRouteToPage = (href: string) => {
    router.push(href);
  };
  const handleShowNotifications = () => {
    showNotifications
      ? setShowNotifications(false)
      : setShowNotifications(true);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col justify-between",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => !isDesktop && setIsHovered(true)}
      onMouseLeave={() => !isDesktop && setIsHovered(false)}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/spraada_logo.webp"
            alt="Spraada"
            className="w-8 h-8 object-contain"
          />
          {isExpanded && (
            <span className="text-2xl font-bold text-gray-900 whitespace-nowrap">
              Spraada
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col justify-start py-4 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item: NavItem) => {
          // Use profile userId for the profile link
          const href =
            item.isProfile && user?.id ? `/profile/${user.id}` : item.href;
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
              {item.name.toLowerCase() === "messages" &&
                allUnreadMessagesCount > 0 && (
                  <span className="absolute bg-red-700 text-white text-[10px] font-semibold  right-3 px-1 py-0.5 rounded-full min-w-[15px] h-4 flex items-center justify-center">
                    {allUnreadMessagesCount > 99
                      ? "99+"
                      : allUnreadMessagesCount}
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
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 p-3 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
            pathname === "/settings"
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <Icon
            icon={
              pathname === "/settings"
                ? "solar:settings-bold"
                : "solar:settings-linear"
            }
            className="text-2xl shrink-0"
          />
          {showLabels && (
            <span className="text-base whitespace-nowrap">Settings</span>
          )}
        </Link>

        {session ? (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gray-50"
          >
            <Icon icon="solar:logout-2-linear" className="text-2xl shrink-0" />
            {isExpanded && (
              <span className="text-base whitespace-nowrap">Logout</span>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gray-50"
          >
            <Icon icon="solar:login-2-linear" className="text-2xl shrink-0" />
            {showLabels && (
              <span className="text-base whitespace-nowrap">Login</span>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
