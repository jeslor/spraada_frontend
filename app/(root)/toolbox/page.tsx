import ToolContent from "@/components/Tools/ToolContnet";
import { getSession } from "@/lib/session/session";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";

export default async function ToolboxPage() {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.user?.isOnboarded) {
    redirect(`/profile/${session.user?.id}`);
  }

  return (
    <div className=" mr-auto px-4 py-8 flex flex-col items-start">
      <div className="px-0 xl:px-10 flex flex-col w-full">
        <ToolContent type="owned" />
      </div>
    </div>
  );
}
