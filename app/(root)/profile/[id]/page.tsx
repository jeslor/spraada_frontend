import { getUser } from "@/lib/actions/Auth.actions";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import ProfileContent from "@/components/Profile/ProfileContent";

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

  const isOwnProfile = session.user.id === id;

  // Layout handles onboarding form for non-onboarded users
  // This page only renders for onboarded users or when viewing others' profiles

  // For users without a profile viewing someone else's incomplete profile
  if (!user.profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-gray-500">This profile is not yet complete.</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileContent
      initialUser={user}
      initialProfile={user.profile}
      isOwnProfile={isOwnProfile}
    />
  );
}
