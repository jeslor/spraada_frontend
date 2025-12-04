import { getSession } from "@/lib/session/session";

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  console.log("session in the sessionLayout", session);

  return <div className="profile-layout">{children}</div>;
};

export default ProfileLayout;
