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

  return (
    <div className="profile-layout min-h-screen bg-gray-50 py-8">
      <div className="myContainer">
        {session.user.isOnboarded ? (
          <main>{children}</main>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <OnboardingForm userRole={session.user.role} userId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
