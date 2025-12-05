import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  // Load the onboarding component when the user is not onboarded
  const {
    user: { isOnboarded },
  } = session as any;

  return session ? (
    <div className="profile-layout min-h-screen bg-gray-50">
      {isOnboarded ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <OnboardingForm />
        </div>
      )}
    </div>
  ) : null;
};

export default ProfileLayout;
