import ToolContent from "@/components/Tools/ToolContnet";
import { getSession } from "@/lib/session/session";
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Toolbox
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tools you&apos;ve added to your toolbox
          </p>
        </div>
        <ToolContent type="owned" />
      </div>
    </div>
  );
}
