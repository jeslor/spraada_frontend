export interface NavItem {
  name: string;
  href: string;
  icon: string;
  isProfile?: boolean;
  activeIcon: string;
}

const session: any = null; // Placeholder for session, replace with actual session retrieval logic

export const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: "solar:home-2-linear",
    activeIcon: "solar:home-2-bold",
  },
  {
    name: "My Toolbox",
    href: "/toolbox",
    icon: "solar:box-linear",
    activeIcon: "solar:box-bold",
  },
  {
    name: "My Rentals",
    href: "/rentals",
    icon: "solar:hand-shake-linear",
    activeIcon: "solar:hand-shake-bold",
  },
  {
    name: "Messages",
    href: "/messages",
    icon: "solar:chat-round-dots-linear",
    activeIcon: "solar:chat-round-dots-bold",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: "solar:bell-linear",
    activeIcon: "solar:bell-bold",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: "solar:card-transfer-linear",
    activeIcon: "solar:card-transfer-bold",
  },
  {
    name: "Add new tool",
    href: "/create",
    icon: "solar:add-square-linear",
    activeIcon: "solar:add-square-bold",
  },
  {
    name: "Profile",
    href: session?.user?.id ? `/profile/${session.user.id}` : "/profile/1",
    icon: "solar:user-circle-linear",
    isProfile: true,
    activeIcon: "solar:user-circle-bold",
  },
];
