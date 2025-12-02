import AppBar from "@/components/AppBar";
import { getSession, Session } from "@/lib/session/session";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: Session | null = await getSession();
  return (
    <>
      <AppBar session={session} />
      {children}
    </>
  );
};

export default RootLayout;
