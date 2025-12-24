"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

/* =========================
   Types
========================= */

interface Profile {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  country?: string;
  address?: string;
  city?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  dailyPriceCents: number;
  city: string;
  country: string;
}

interface Booking {
  id: string;
  start: string;
  end: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface ProfileTabsProps {
  listings: Listing[];
  bookings: Booking[];
  profile: Profile;
  user: {
    role?: string;
    createdAt?: string;
  };
}

type TabId = "profile" | "listings" | "bookings" | "transactions";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "solar:user-circle-bold" },
  { id: "listings", label: "My Listings", icon: "solar:clipboard-list-bold" },
  { id: "bookings", label: "My Bookings", icon: "solar:calendar-mark-bold" },
  { id: "transactions", label: "Transactions", icon: "solar:card-bold" },
];

/* =========================
   Component
========================= */

export default function ProfileTabs({
  listings,
  bookings,
  profile,
  user,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div>
      {/* ================= Tab Navigation ================= */}
      <div className="flex gap-1 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === tab.id
                ? "text-primary-900 shadow-md shadow-primary-100 bg-primary-200"
                : "text-gray-600 hover:text-primary-600 hover:bg-white/50"
            )}
          >
            <Icon
              icon={tab.icon}
              className={cn(
                "text-lg transition-colors",
                activeTab === tab.id && "text-primary-900"
              )}
            />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= Tab Content ================= */}
      <div className="mt-8">
        {/* ================= Profile ================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-200">
                <Icon icon="solar:star-bold" className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Profile Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Your personal information and account details
                </p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="bg-linear-to-br from-primary-50/50 to-white rounded-2xl border border-primary-100 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Icon
                      icon="solar:user-circle-bold"
                      className="text-xl text-primary-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      About Me
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ================= Contact Info ================= */}
              <div className="bg-linear-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Icon
                    icon="solar:letter-bold"
                    className="text-xl text-primary-600"
                  />
                  Contact Information
                </h4>

                <div className="space-y-4">
                  <InfoRow
                    icon="solar:letter-bold"
                    label="Email Address"
                    value={profile.email ?? "Not provided"}
                  />
                  <InfoRow
                    icon="solar:phone-bold"
                    label="Phone Number"
                    value={profile.phone ?? "Not provided"}
                  />
                  <InfoRow
                    icon="solar:home-bold"
                    label="Street Address"
                    value={profile.address ?? "Not provided"}
                  />
                  <InfoRow
                    icon="solar:map-point-bold"
                    label="City & Country"
                    value={
                      profile.city || profile.country
                        ? [profile.city, profile.country]
                            .filter(Boolean)
                            .join(", ")
                        : "Not provided"
                    }
                  />
                </div>
              </div>

              {/* ================= Account Details ================= */}
              <div className="bg-linear-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Icon
                    icon="solar:shield-check-bold"
                    className="text-xl text-primary-600"
                  />
                  Account Details
                </h4>

                <div className="space-y-4">
                  <InfoRow
                    icon="solar:shield-check-bold"
                    label="Account Type"
                    value={user.role?.toLowerCase() ?? "user"}
                  />
                  <InfoRow
                    icon="solar:calendar-bold"
                    label="Member Since"
                    value={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"
                    }
                  />
                  <InfoRow
                    icon="solar:global-bold"
                    label="Profile Updated"
                    value={
                      profile.updatedAt
                        ? new Date(profile.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Never"
                    }
                  />
                  <InfoRow
                    icon="solar:user-id-bold"
                    label="Profile ID"
                    value={profile.id ? `#${profile.id}` : "N/A"}
                    mono
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= Listings ================= */}
        {activeTab === "listings" && (
          <Section
            icon="solar:clipboard-list-bold"
            title="My Listings"
            emptyText="No listings yet"
            hasData={listings.length > 0}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-4 bg-gray-50 rounded-xl border hover:border-primary-200 transition"
                >
                  <h4 className="font-medium text-gray-900">{listing.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="text-xs text-gray-400 mt-3 flex gap-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      ${(listing.dailyPriceCents / 100).toFixed(2)}/day
                    </span>
                    <span>
                      {listing.city}, {listing.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ================= Bookings ================= */}
        {activeTab === "bookings" && (
          <Section
            icon="solar:calendar-mark-bold"
            title="My Bookings"
            emptyText="No bookings yet"
            hasData={bookings.length > 0}
          >
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Booking #{booking.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.start).toLocaleDateString()} –{" "}
                      {new Date(booking.end).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      booking.status === "confirmed" &&
                        "bg-green-100 text-green-700",
                      booking.status === "pending" &&
                        "bg-yellow-100 text-yellow-700",
                      booking.status === "cancelled" &&
                        "bg-gray-200 text-gray-700"
                    )}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ================= Transactions ================= */}
        {activeTab === "transactions" && (
          <Section
            icon="solar:card-bold"
            title="My Transactions"
            emptyText="No transactions yet"
            hasData={false}
          />
        )}
      </div>
    </div>
  );
}

/* =========================
   Helper Components
========================= */

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border">
      <Icon icon={icon} className="text-lg text-primary-600" />
      <div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p className={cn("text-gray-900", mono && "font-mono text-sm")}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  hasData,
  emptyText,
}: {
  icon: string;
  title: string;
  children?: React.ReactNode;
  hasData: boolean;
  emptyText: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon icon={icon} className="text-xl text-primary-600" />
        {title}
      </h3>

      {hasData ? (
        children
      ) : (
        <p className="text-center py-16 text-gray-500">{emptyText}</p>
      )}
    </div>
  );
}
