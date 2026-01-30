import { navItems } from "@/lib/constants/navigation";
import SignOutOverlay from "./SignoutOverlay";
import Link from "next/dist/client/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
// Shadcn Drawer Imports
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  useProfile,
  useShowNotifications,
  useHasHydrated,
  useProfileInitials,
  useUser,
  useAllUnreadMessagesCount,
  useNotificationCounter,
} from "@/store";
import { Session } from "@/lib/session/session";
import { useEffect, useState } from "react";

interface MobileBottomBarProps {
  isSigningOut: boolean;
  isActive: (href: string) => boolean;
  handleSignOut: () => void;
  handleShowNotifications: () => void;
  handleRouteToPage: (href: string) => void;
  session: Session | null;
  isDrawerOpen?: boolean;
  setIsDrawerOpen?: (isOpen: boolean) => void;
}
const MobileBottomBar = ({
  isSigningOut,
  handleSignOut,
  isActive,
  handleShowNotifications,
  handleRouteToPage,
  session,
  isDrawerOpen,
  setIsDrawerOpen,
}: MobileBottomBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  //---localState---//
  const [animateBubble, setAnimateBubble] = useState(false);

  //----Store Hooks---//
  const profile = useProfile();
  const showNotifications = useShowNotifications();
  const user = useUser();
  const initials = useProfileInitials();
  const hasHydrated = useHasHydrated();
  const allUnreadMessagesCount = useAllUnreadMessagesCount();
  const notificationCounter = useNotificationCounter();

  useEffect(() => {
    // Animate bubble every time notification count changes
    setAnimateBubble(true);
    const timeout = setTimeout(() => setAnimateBubble(false), 350);
    return () => clearTimeout(timeout);
  }, [notificationCounter.count, allUnreadMessagesCount]);

  return (
    <>
      {isSigningOut && <SignOutOverlay />}

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around px-2 pb-safe">
        {/* Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === "/" ? "text-primary-600" : "text-gray-500",
          )}
        >
          <Icon
            icon={
              pathname === "/" ? "solar:home-2-bold" : "solar:home-2-linear"
            }
            className="text-2xl"
          />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Messages */}
        <Link
          href="/messages"
          className={cn(
            "flex flex-col items-center gap-1",
            isActive("/messages") ? "text-primary-600" : "text-gray-500",
          )}
        >
          <Icon
            icon={
              isActive("/messages")
                ? "solar:chat-round-dots-bold"
                : "solar:chat-round-dots-linear"
            }
            className="text-2xl"
          />
          <span className="text-[10px] font-medium">Messages</span>
        </Link>

        {/* Center Create Action */}
        <Link
          href="/create"
          className="flex flex-col items-center justify-center -translate-y-4"
        >
          <div className="bg-primary-600 p-3 rounded-full shadow-lg border-4 border-white text-white">
            <Icon icon="solar:add-square-bold" className="text-2xl" />
          </div>
        </Link>

        {/* Notifications */}
        <button
          onClick={handleShowNotifications}
          className={cn(
            "flex flex-col items-center gap-1 cursor-pointer",
            showNotifications ? "text-primary-600" : "text-gray-500",
          )}
        >
          <Icon
            icon={showNotifications ? "solar:bell-bold" : "solar:bell-linear"}
            className="text-2xl"
          />
          <span className="text-[10px] font-medium">Alerts</span>
        </button>

        {/* More / Profile Dropup (Drawer) */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 border border-primary-200">
                {profile ? (
                  <img
                    src={profile?.avatarUrl}
                    alt="profile"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <Icon icon="solar:user-circle-linear" />
                )}
              </div>
              <span className="text-[10px] font-medium">More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-8">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-left text-gray-400 text-xs font-bold uppercase tracking-widest">
                Menu
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-1">
              {navItems
                .filter(
                  (item) =>
                    ![
                      "Home",
                      "Messages",
                      "Notifications",
                      "Add new tool",
                    ].includes(item.name),
                )
                .map((item) => {
                  const href =
                    item.isProfile && user?.id
                      ? `/profile/${user.id}`
                      : item.href;
                  const active = isActive(href);
                  return !item.isProfile ? (
                    <button
                      key={item.name}
                      onClick={
                        item.name.toLowerCase() === "notifications"
                          ? handleShowNotifications
                          : () => handleRouteToPage(item.href)
                      }
                      className={cn(
                        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 font-medium relative cursor-pointer",
                        active
                          ? "bg-gray-100 text-gray-900 font-bold"
                          : "text-gray-700 hover:bg-gray-50",
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
                            : notificationCounter.count > 99
                              ? "99+"
                              : notificationCounter.count}
                        </span>
                      )}
                      <Icon
                        icon={active ? item.activeIcon : item.icon}
                        className="text-2xl shrink-0 text-primary-600 font-bold"
                      />

                      <span className="text-base whitespace-nowrap">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    hasHydrated && user && (
                      <button
                        key={item.name}
                        onClick={() => handleRouteToPage(item.href)}
                        className={cn(
                          "flex items-center justify-start gap-4 px-3 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer",
                          active
                            ? "bg-gray-100 text-gray-900 font-bold"
                            : "text-gray-700 hover:bg-gray-50",
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

                        <span className="text-base text-start truncate w-[162px] whitespace-nowrap">
                          {user.isOnboarded
                            ? `${profile?.firstName} ${initials.charAt(1) || ""}`
                            : item.name}
                        </span>
                      </button>
                    )
                  );
                })}
              <div className="h-px bg-gray-100 my-2" />
              <Link
                href="/settings"
                className="flex items-center gap-4 p-4 rounded-xl active:bg-gray-100 hover:bg-gray-200/60"
              >
                <Icon
                  icon="solar:settings-linear"
                  className="text-2xl text-gray-500"
                />
                <span className="text-gray-700 font-medium">Settings</span>
              </Link>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-4 p-4 rounded-xl text-red-600 w-full text-left active:bg-red-50 hover:bg-gray-200/60"
                >
                  <Icon icon="solar:logout-2-linear" className="text-2xl" />
                  <span className="font-semibold">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/signin")}
                  className="flex items-center gap-4 p-4 rounded-xl text-primary-600 w-full text-left"
                >
                  <Icon icon="solar:login-2-linear" className="text-2xl" />
                  <span className="font-semibold">Login</span>
                </button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </>
  );
};

export default MobileBottomBar;
