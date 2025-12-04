import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/Onboarding/OnboardingForm";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  // Assuming isOnboarded is available on the user object in the session
  // If TypeScript complains, we might need to update the Session type definition
  const {
    user: { isOnboarded },
  } = session as any;

  return (
    <div className="profile-layout min-h-screen bg-gray-50">
      {isOnboarded ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <OnboardingForm />
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;
