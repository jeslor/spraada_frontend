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

  const profile = user.profile || user;
  const isOwnProfile = session.user.id === id;

  return (
    <ProfileContent
      initialUser={user}
      initialProfile={profile}
      isOwnProfile={isOwnProfile}
    />
  );
}
