"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, List, Calendar, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      title: "My Profile",
      href: `/profile/${userId}`,
      icon: User,
    },
    {
      title: "My Listings",
      href: `/profile/${userId}/listings`,
      icon: List,
    },
    {
      title: "My Bookings",
      href: `/profile/${userId}/bookings`,
      icon: Calendar,
    },
    {
      title: "My Transactions",
      href: `/profile/${userId}/transactions`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="w-full md:w-64 bg-white h-fit md:min-h-[calc(100vh-100px)] rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  isActive
                    ? "text-primary-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
