import dynamic from "next/dynamic";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";
import LoadingUI from "@/components/ui/Loading";

const Chat = dynamic(() => import("@/components/Messages/Chat"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingUI />
    </div>
  ),
});

const page = async () => {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.user?.isOnboarded) {
    redirect(`/profile/${session.user?.id}`);
  }
  return <Chat />;
};

export default page;
