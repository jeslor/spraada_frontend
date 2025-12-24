import Sidebar from "@/components/Sidebar/Sidebar";
import { getSession, Session } from "@/lib/session/session";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: Session | null = await getSession();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar session={session} />
      <main className="flex-1 ml-20 xl:ml-64">{children}</main>
    </div>
  );
};

export default RootLayout;
