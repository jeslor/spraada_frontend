"use client";

import { useState } from "react";
import {
  List,
  CalendarCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Calendar,
  Shield,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ProfileTabsProps {
  listings: any[];
  bookings: any[];
  profile: Profile;
  user: {
    role?: string;
    createdAt?: string;
  };
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "listings", label: "My Listings", icon: List },
  { id: "bookings", label: "My Bookings", icon: CalendarCheck },
  { id: "transactions", label: "Transactions", icon: CreditCard },
];

export default function ProfileTabs({
  listings,
  bookings,
  profile,
  user,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer",
              activeTab === tab.id
                ? " text-primary-900 shadow-md shadow-primary-100 bg-primary-200"
                : "text-gray-600 hover:text-primary-600 hover:bg-white/50"
            )}
          >
            <tab.icon
              size={18}
              className={cn(
                "transition-colors",
                activeTab === tab.id ? "text-primary-900" : ""
              )}
            />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Overview Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-200">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="py-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Profile Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Your personal information and account details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information Card */}
              <div className="bg-linear-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-linear-to-br from-primary-50 to-primary-100 rounded-xl">
                      <Mail size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Contact Information
                      </h4>
                      <p className="text-xs text-gray-500">
                        How others can reach you
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Mail size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Email Address
                        </p>
                        <p className="text-gray-900 font-medium truncate">
                          {profile.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Phone size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Phone Number
                        </p>
                        <p className="text-gray-900 font-medium">
                          {profile.phone || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Home size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Street Address
                        </p>
                        <p className="text-gray-900 font-medium">
                          {profile.address || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <MapPin size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          City & Country
                        </p>
                        <p className="text-gray-900 font-medium">
                          {profile.city || profile.country ? (
                            [profile.city, profile.country]
                              .filter(Boolean)
                              .join(", ")
                          ) : (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-linear-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-linear-to-br from-primary-50 to-primary-100 rounded-xl">
                      <Shield size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Account Details
                      </h4>
                      <p className="text-xs text-gray-500">
                        Your account status and activity
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Account Type */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Shield size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Account Type
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium capitalize">
                            {user.role?.toLowerCase() || "User"}
                          </span>
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Calendar size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Member Since
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <Globe size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Profile Updated
                        </p>
                        <p className="text-gray-900 font-medium">
                          {profile.updatedAt
                            ? new Date(profile.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Never"}
                        </p>
                      </div>
                    </div>

                    {/* Profile ID */}
                    <div className="group/item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                      <div className="p-2.5 bg-primary-50 group-hover/item:bg-primary-100 rounded-lg transition-colors">
                        <User size={18} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                          Profile ID
                        </p>
                        <p className="text-gray-900 font-mono text-sm">
                          #{profile.id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="bg-linear-to-br from-primary-50/50 to-white rounded-2xl border border-primary-100 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <User size={20} className="text-primary-600" />
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
          </div>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <List size={20} className="text-primary-600" />
              </div>
              My Listings
            </h3>
            {listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing: any) => (
                  <div
                    key={listing.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-primary-50/50 hover:border-primary-200 border border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900">
                      {listing.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                        ${(listing.dailyPriceCents / 100).toFixed(2)}/day
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {listing.city}, {listing.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <List size={32} className="text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No listings yet
                </p>
                <p className="text-gray-500 mb-6">
                  Start sharing your items with others
                </p>
                <button className="px-6 py-3 bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-primary-300">
                  Create Your First Listing
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <CalendarCheck size={20} className="text-primary-600" />
              </div>
              My Bookings
            </h3>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-primary-50/50 border border-transparent hover:border-primary-200 transition-all duration-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        Booking #{booking.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(booking.start).toLocaleDateString()} -{" "}
                        {new Date(booking.end).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarCheck size={32} className="text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No bookings yet
                </p>
                <p className="text-gray-500 mb-6">
                  Start exploring listings to make your first booking
                </p>
                <button className="px-6 py-3 bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-primary-300">
                  Browse Listings
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <CreditCard size={20} className="text-primary-600" />
              </div>
              My Transactions
            </h3>
            <div className="text-center py-16 text-gray-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard size={32} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                No transactions yet
              </p>
              <p className="text-gray-500">
                Your transaction history will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
