import OnboardingForm from "@/components/Onboarding/OnboardingForm";
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
  if (session.user.id !== id) {
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
    <div className="profile-layout min-h-screen bg-gray-50 py-8">
      <div className="myContainer">
        {user.isOnboarded ? (
          <main>{children}</main>
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
