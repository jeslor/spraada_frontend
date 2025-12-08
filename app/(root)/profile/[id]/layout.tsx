import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import Sidebar from "@/components/Profile/Sidebar";
import { getUser } from "@/lib/actions/Auth.actions";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const ProfileLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const session = await getSession();
  const { id } = await params;

  // No session → redirect early
  if (!session || !session.user) {
    redirect("/signin");
  }

  // Ensure the user is accessing their own profile for the dashboard layout
  // Or if we want to allow viewing other profiles, we might need to adjust the sidebar logic.
  // For now, assuming this layout is for the logged-in user's dashboard.
  // If the ID in the URL doesn't match the session ID, we might want to redirect or show a different layout.
  // However, the prompt implies "My Profile", so let's stick to that.
  if (session.user.id !== id) {
    // If trying to access someone else's dashboard, maybe redirect to their public profile (if that exists) or home.
    // For now, let's just redirect to the correct profile URL for the logged-in user.
    redirect(`/profile/${session.user.id}`);
  }

  const user = await getUser(id);

  // If no user record in database → redirect
  if (!user) {
    redirect("/signin");
  }

  // Sync session data with DB
  if (
    user.isOnboarded !== session.user.isOnboarded &&
    user.isOnboarded === true
  ) {
    await fetch(
      `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/api/session/update-user-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRole: user.role,
          UserOnboarded: user.isOnboarded,
        }),
      }
    );
  }

  return (
    <div className="profile-layout min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {user.isOnboarded ? (
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 flex-shrink-0">
              <Sidebar userId={id} />
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <OnboardingForm userRole={user.role} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
