import Chat from "@/components/Messages/Chat";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.user?.isOnboarded) {
    redirect(`/profile/${session.user?.id}`);
  }
  return <Chat />;
};

export default page;
