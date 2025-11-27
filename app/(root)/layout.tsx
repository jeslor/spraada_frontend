import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default RootLayout;
