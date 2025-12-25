"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ProfileAvatar from "@/components/Profile/ProfileAvatar";
import {
  useProfile,
  useUser,
  useProfileStats,
  useProfileActions,
  useHasHydrated,
} from "@/store";
import { User, Profile } from "@/store/profile/profile.types";
import { cn } from "@/lib/utils";

interface ProfileContentProps {
  initialUser: User;
  initialProfile: Profile;
  isOwnProfile: boolean;
}

export default function ProfileContent({
  initialUser,
  initialProfile,
  isOwnProfile,
}: ProfileContentProps) {
  const { setUser, setProfile } = useProfileActions();
  const hasHydrated = useHasHydrated();

  // Get data from store (will be hydrated from localStorage or initial data)
  const storeProfile = useProfile();
  const storeUser = useUser();
  const stats = useProfileStats();

  // Use store data if viewing own profile and store is hydrated, otherwise use initial data
  const profile =
    isOwnProfile && hasHydrated && storeProfile ? storeProfile : initialProfile;
  const user =
    isOwnProfile && hasHydrated && storeUser ? storeUser : initialUser;

  // Sync initial data to store if viewing own profile
  useEffect(() => {
    if (isOwnProfile && hasHydrated) {
      setUser(initialUser);
      setProfile(initialProfile);
    }
  }, [
    isOwnProfile,
    hasHydrated,
    initialUser,
    initialProfile,
    setUser,
    setProfile,
  ]);

  const displayStats = [
    {
      label: "My tools",
      value: isOwnProfile ? stats.listingsCount : profile.listings?.length || 0,
      icon: "solar:box-bold",
    },
    {
      label: "My Rentals",
      value: isOwnProfile ? stats.bookingsCount : profile.bookings?.length || 0,
      icon: "solar:hand-shake-bold",
    },
    {
      label: "Transactions",
      value: isOwnProfile
        ? stats.transactionsCount
        : profile.transactions?.length || 0,
      icon: "solar:card-transfer-bold",
    },
  ];

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
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-primary-300/20 shadow-sm">
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

  return (
    <div className=" mr-auto lg:px-4 py-8">
      {/* Hero Section with Cover, Avatar, Stats & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 md:h-56 bg-linear-to-br from-primary-600/20 via-primary-500/10 to-primary-400/5 w-full relative">
          {profile.coverUrl ? (
            <Image
              src={profile.coverUrl}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary-600/30 via-primary-500/20 to-transparent" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>

        {/* Profile Info Section */}
        <div className="px-6 md:px-10 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 mb-6">
            {/* Avatar with Edit Functionality */}
            <ProfileAvatar
              avatarUrl={profile.avatarUrl!}
              avatarUrlKey={profile.avatarUrlKey!}
              firstName={profile.firstName}
              lastName={profile.lastName}
              profileId={profile.id}
              userId={Number(user.id)}
              isEditable={isOwnProfile}
            />

            {/* Edit Button - Only show on own profile */}
            {isOwnProfile && (
              <button className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                <Icon icon="solar:pen-bold" className="text-base" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Name & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                <Icon icon="solar:shield-check-bold" className="text-sm" />
                {user.role || "USER"}
              </span>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              {profile.bio || "No bio added yet. Tell others about yourself!"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 md:gap-6 mt-6">
            {displayStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon icon={stat.icon} className="text-xl text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-200">
                    <Icon
                      icon="solar:star-bold"
                      className="text-xl text-white"
                    />
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
                  <div className="bg-linear-to-br from-white to-primary-50/50 rounded-2xl  shadow-sm shadow-primary-200/70 p-6 md:p-8">
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
                  <div className="bg-linear-to-br from-white to-primary-50/50 rounded-2xl  shadow-sm shadow-primary-200/70 p-6 md:p-8">
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
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
