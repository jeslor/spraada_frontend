import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import { getUser } from "@/lib/actions/Auth.actions";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  // No session → redirect early
  if (!session || !session.user) {
    redirect("/signin");
  }

  const userId = session.user.id;
  const user = await getUser(userId);

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
    <div className="profile-layout min-h-screen bg-gray-50">
      {user.isOnboarded ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <OnboardingForm userRole={user.role} />
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;
