"use client";

import { deleteSession, Session } from "@/lib/session/session";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { NavItem, navItems } from "@/lib/constants/navigation";
import {
  useProfile,
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
  useUser,
} from "@/store";
import { useAppSocket } from "@/Hooks/InitializeAppSocket";
import EachSidebar from "./EachSidebar";

import SignOutOverlay from "./SignoutOverlay";
import MobileBottomBar from "./MobileBottomBar";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 768px)"); // Adjusted for better mobile/tablet toggle

  const profile = useProfile();
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

  const isExpanded = isDesktop || isHovered;

  useEffect(() => {
    if (profile) getNotificationCounter(profile.id);
  }, [profile]);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => setShowLabels(true), 100);
    } else {
      setShowLabels(false);
    }
  }, [isExpanded]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    clearProfile();
    clearTools();
    clearBookings();
    clearNotifications();
    clearConversationStore();
    deleteSession();
    window.location.href = "/signin";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleRouteToPage = (href: string) => {
    setIsHovered(false);
    setIsDrawerOpen(false);
    router.push(href);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    if (isSigningOut) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSigningOut]);

  // --- UI COMPONENTS ---

  // MOBILE BOTTOM BAR
  if (isMobile)
    return (
      <MobileBottomBar
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        session={session}
        isSigningOut={isSigningOut}
        isActive={isActive}
        handleSignOut={handleSignOut}
        handleShowNotifications={handleShowNotifications}
        handleRouteToPage={handleRouteToPage}
      />
    );

  // DESKTOP ASIDE
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 md:flex flex-col justify-between hidden ",
        isExpanded ? "w-64" : "w-20",
      )}
      onMouseEnter={() => !isDesktop && setIsHovered(true)}
      onMouseLeave={() => !isDesktop && setIsHovered(false)}
    >
      {isSigningOut && <SignOutOverlay />}

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
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Icon icon="solar:logout-2-linear" className="text-2xl shrink-0" />
            {isExpanded && (
              <span className="text-base whitespace-nowrap">Logout</span>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
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
