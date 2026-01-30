"use client";

import React, { useEffect, useState } from "react";
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Tool, useProfile } from "@/store";
import { getToolById } from "@/lib/actions/tools.actions";
import LoadingUI from "@/components/ui/Loading";
import { cn } from "@/lib/utils";
import { useBookingToolBorrowerById } from "@/store/booking/booking.selectors";

// Use the profile type from Tool
type ToolOwnerProfile = NonNullable<Tool["profile"]>;

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

export default function ToolOwnerPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useProfile();
  const bookingId = useSearchParams().get("bookingId") as string | "";
  const borrower = useBookingToolBorrowerById(bookingId as string);
  const toolId = params.toolId as string;

  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tool to get owner profile
  useEffect(() => {
    const fetchTool = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedTool = await getToolById(toolId);
        if (!fetchedTool) {
          setError("Tool not found");
          return;
        }

        // If viewing own profile, redirect to profile page
        if (
          currentUser &&
          fetchedTool.profileId === currentUser.id &&
          !bookingId
        ) {
          router.replace(`/profile/${currentUser.id}`);
          return;
        }

        setTool(fetchedTool);
      } catch (err) {
        console.error("Failed to fetch tool:", err);
        setError("Failed to load owner profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (toolId) fetchTool();
  }, [toolId, currentUser, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingUI />
      </div>
    );
  }

  // Error state
  if (error || !tool) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Icon
              icon="solar:danger-triangle-bold-duotone"
              className="text-red-500"
              width={40}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Profile not found"}
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t load this profile. Please try again.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = bookingId
    ? (borrower as ToolOwnerProfile)
    : (tool.profile as ToolOwnerProfile);

  //Message tool owner
  const handleMessageOwner = () => {
    if (!tool?.profile) return;
    if (!profile) {
      redirect("/signin");
    }

    const { id, firstName, lastName, avatarUrl } = tool.profile;

    redirect(
      `/messages/?userId=${id}&firstName=${encodeURIComponent(
        firstName ?? "",
      )}&lastName=${encodeURIComponent(
        lastName ?? "",
      )}&avatarUrl=${encodeURIComponent(avatarUrl ?? "")}`,
    );
  };

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Icon
              icon="solar:user-bold-duotone"
              className="text-gray-400"
              width={40}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Unavailable
          </h2>
          <p className="text-gray-500 mb-6">
            Owner information is not available for this tool.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-4 lg:px-8">
      {/* Header - Back button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 -mx-4 px-4 lg:-mx-8 lg:px-8 py-3 mb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <Icon icon="solar:arrow-left-linear" width={18} />
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Back to Tool
            </span>
          </button>

          {/* View Tool Link */}
          <Link
            href={`/toolbox/view/${toolId}/owner`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Icon icon="solar:box-bold-duotone" width={18} />
            View Tool
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mr-auto lg:px-4 py-8 max-w-[1200px] w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 md:h-56 bg-linear-to-br from-primary-600/20 via-primary-500/10 to-primary-400/5 w-full relative">
            {profile.coverUrl ? (
              <img
                src={profile.coverUrl}
                alt="Cover"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-primary-600/30 via-primary-500/20 to-transparent" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile Info Section */}
          <div className="px-6 md:px-10 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-20 mb-6">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-linear-to-br from-primary-100 to-primary-200">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="solar:user-bold"
                      className="text-primary-500"
                      width={48}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Name & Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                  <Icon icon="solar:shield-check-bold" className="text-sm" />
                  Verified Member
                </span>
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="mt-6 bg-linear-to-br from-primary-50/50 to-white rounded-2xl border border-primary-100 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Icon
                      icon="solar:user-circle-bold"
                      className="text-xl text-primary-600"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      About {profile.firstName}
                    </h4>
                    <pre className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {profile.bio}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tool Listed By This Owner */}
            <div className="mt-8 p-4 bg-linear-to-br from-primary-50 to-white rounded-xl border border-primary-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                {bookingId ? "Tool Borrowed" : "Tool Listed"}
              </p>
              <Link
                href={`/toolbox/view/${toolId}`}
                className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-white transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {tool.toolPhotos && tool.toolPhotos.length > 0 ? (
                    <img
                      src={tool.toolPhotos[0].photoUrl}
                      alt={tool.name}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon
                        icon="solar:box-bold-duotone"
                        className="text-gray-400"
                        width={24}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {tool.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {tool.category}
                  </p>
                </div>
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0"
                  width={20}
                />
              </Link>
            </div>

            {/* Contact & Location Info */}
            <div className="mt-8 pt-6 border-t border-gray-100">
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
                      About {profile.firstName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Member information and location
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Location Info */}
                  <div className="bg-linear-to-br from-white to-primary-50/50 rounded-2xl shadow-sm shadow-primary-200/70 p-6 md:p-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <Icon
                        icon="solar:map-point-bold"
                        className="text-xl text-primary-600"
                      />
                      Location
                    </h4>

                    <div className="space-y-4">
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

                  {/* Member Details */}
                  <div className="bg-linear-to-br from-white to-primary-50/50 rounded-2xl shadow-sm shadow-primary-200/70 p-6 md:p-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <Icon
                        icon="solar:shield-check-bold"
                        className="text-xl text-primary-600"
                      />
                      Member Details
                    </h4>

                    <div className="space-y-4">
                      <InfoRow
                        icon="solar:verified-check-bold"
                        label="Status"
                        value="Verified Member"
                      />
                      <InfoRow
                        icon="solar:calendar-bold"
                        label="Member Since"
                        value={
                          profile.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Message Owner Button */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleMessageOwner}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Icon icon="solar:chat-round-line-bold" width={20} />
                    Message {profile.firstName}
                  </button>
                  <Link
                    href={`/toolbox/view/${toolId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    <Icon icon="solar:box-bold-duotone" width={20} />
                    View Tool Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
