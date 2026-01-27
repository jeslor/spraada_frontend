import Sidebar from "@/components/Sidebar/Sidebar";
import { getSession, Session } from "@/lib/session/session";
import { getUser } from "@/lib/actions/Auth.actions";
import ProfileInitializer from "@/components/Profile/ProfileInitializer";
import ToastProvider from "@/components/Providers/ToastProvider";
import Notifications from "@/components/Notifications/Notifications";
import SmoothScrollHash from "@/components/ui/smoothScrollHash";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: Session | null = await getSession();

  // Fetch user data server-side for store hydration
  const user = session?.user?.id ? await getUser(session.user.id) : null;

  // Sync session data with DB
  if (
    user &&
    user.isOnboarded !== session?.user.isOnboarded &&
    user.isOnboarded === true
  ) {
    await fetch(
      `${
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
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
    <div className="flex min-h-screen bg-gray-50">
      <SmoothScrollHash />
      <Notifications />
      <ToastProvider />
      <ProfileInitializer user={user} />
      <Sidebar session={session} />
      <main className="flex-1 ml-20 xl:ml-64 min-w-0">{children}</main>
    </div>
  );
};

export default RootLayout;
