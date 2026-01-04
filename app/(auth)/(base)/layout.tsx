import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import React from "react";

const BaseAuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (session && session.user) {
    redirect("/");
  }
  return <>{children}</>;
};

export default BaseAuthLayout;
