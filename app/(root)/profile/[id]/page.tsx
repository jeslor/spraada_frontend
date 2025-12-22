import { getUser } from "@/lib/actions/Auth.actions";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import { Shield, List, CalendarCheck, Edit3 } from "lucide-react";
import Image from "next/image";
import ProfileTabs from "@/components/Profile/ProfileTabs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/signin");

  const { id } = await params;
  const user = await getUser(id);
  if (!user) redirect("/signin");

  const profile = user.profile || user;

  const stats = [
    {
      label: "Listings",
      value: profile.listings?.length || 0,
      icon: List,
    },
    {
      label: "Bookings",
      value: profile.bookings?.length || 0,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Cover, Avatar, Stats & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
            {/* Avatar */}
            <div className="relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-xl relative ring-4 ring-white">
                {profile.avatarUrl ? (
                  <img
                    src="https://spraada.s3.eu-north-1.amazonaws.com/profile-images/968203d3-845f-4d22-a90b-a85e5ae0d46a-IMG_5013.HEIC.jpg"
                    alt={profile.firstName || "User"}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-100 to-primary-200 text-primary-600 text-4xl md:text-5xl font-bold">
                    {profile.firstName?.[0]}
                    {profile.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-sm" />
            </div>

            {/* Edit Button */}
            <button className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          {/* Name & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                <Shield size={12} />
                {user.role || "USER"}
              </span>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              {profile.bio || "No bio added yet. Tell others about yourself!"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 md:gap-6 mt-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <stat.icon size={20} className="text-primary-600" />
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
            <ProfileTabs
              listings={profile.listings || []}
              bookings={profile.bookings || []}
              profile={profile}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
