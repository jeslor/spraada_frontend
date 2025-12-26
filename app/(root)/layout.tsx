import Sidebar from "@/components/Sidebar/Sidebar";
import { getSession, Session } from "@/lib/session/session";
import { getUser } from "@/lib/actions/Auth.actions";
import ProfileInitializer from "@/components/Profile/ProfileInitializer";
import ToastProvider from "@/components/Providers/ToastProvider";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: Session | null = await getSession();

  // Fetch user data server-side for store hydration
  const user = session?.user?.id ? await getUser(session.user.id) : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastProvider />
      <ProfileInitializer user={user} />
      <Sidebar session={session} />
      <main className="flex-1 ml-20 xl:ml-64">{children}</main>
    </div>
  );
};

export default RootLayout;
