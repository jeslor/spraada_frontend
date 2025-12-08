import { getUser } from "@/lib/actions/Auth.actions";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-primary-600/10 w-full relative">
          {user.coverUrl && (
            <Image
              src={user.coverUrl}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm relative">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.firstName || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-2xl font-bold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 mt-1">
              {user.bio || "No bio added yet."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} className="text-gray-400" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} className="text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {(user.city || user.country) && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-gray-400" />
                    <span>
                      {[user.city, user.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={18} className="text-gray-400" />
                  <span>
                    Joined{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
