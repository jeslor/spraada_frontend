"use client";

import { deleteSession, Session } from "@/lib/session/session";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useState, useEffect, use } from "react";
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
  useSetShowNotifications,
  useGetNotificationCounter,
  useClearNotifications,
  useClearConversations,
} from "@/store";
import { useAppSocket } from "@/Hooks/InitializeAppSocket";
// Import EachSidebar component (adjust the path as needed)
import EachSidebar from "./EachSidebar";

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
  const [isSigningOut, setIsSigningOut] = useState(false);
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

  const clearProfile = useClearProfile();
  const clearTools = useClearTools();
  const clearBookings = useClearBookings();
  const clearNotifications = useClearNotifications();
  const clearConversationStore = useClearConversations();
  const initials = useProfileInitials();
  const hasHydrated = useHasHydrated();
  const getNotificationCounter = useGetNotificationCounter();

  // On desktop, always expanded. On smaller screens, expand on hover.
  const isExpanded = isDesktop || isHovered;

  useEffect(() => {
    if (profile) {
      getNotificationCounter(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => setShowLabels(true), 100);
    } else {
      // Delay hiding labels for smooth transition
      const timeout = setTimeout(() => setShowLabels(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    clearProfile();
    clearTools();
    clearBookings();
    clearNotifications();
    clearConversationStore();
    await deleteSession();
    window.location.href = "/signin";

    // const response = fetch("/api/auth/signout", { method: "GET" });
  };

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

  useEffect(() => {
    if (isSigningOut) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }, [isSigningOut]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col justify-between",
        isExpanded ? "w-64" : "w-20",
      )}
      onMouseEnter={() => !isDesktop && setIsHovered(true)}
      onMouseLeave={() => !isDesktop && setIsHovered(false)}
    >
      {isSigningOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
            {/* Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 " />

            {/* Text */}
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">
                Signing you out
              </p>
              <p className="mt-1 text-sm text-gray-500">
                See you again soon <span className="text-[20px]">👋🏾</span>
              </p>
            </div>
          </div>
        </div>
      )}
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
        {navItems.map((item: NavItem) => (
          <EachSidebar
            key={item.name}
            item={item}
            isActive={isActive}
            handleShowNotifications={handleShowNotifications}
            handleRouteToPage={handleRouteToPage}
            showLabels={showLabels}
            hasHydrated={hasHydrated}
            initials={initials}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 p-3 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
            pathname === "/settings"
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-700 hover:bg-gray-50",
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
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
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
