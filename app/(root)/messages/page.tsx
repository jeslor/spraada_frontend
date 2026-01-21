import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import Messages from "@/components/Messages/Messages";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.user?.isOnboarded) {
    redirect(`/profile/${session.user?.id}`);
  }

  return <Messages />;
}
