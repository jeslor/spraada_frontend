import AppBar from "@/components/AppBar";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar />
      {children}
    </>
  );
};

export default RootLayout;
