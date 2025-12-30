import { Icon } from "@iconify/react";
import AddToolForm from "@/components/Tools/AddToolForm";
import { getSession, Session } from "@/lib/session/session";
import { redirect } from "next/navigation";

export default async function AddToolPage() {
  const session: Session | null = await getSession();
  const profileComplete = session?.user?.isOnboarded;

  if (!profileComplete) {
    redirect(`/profile/${session?.user?.id}`);
  }
  return (
    <div className="mr-auto lg:px-4 myContainer mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-xl">
            <Icon
              icon="solar:add-square-bold"
              className="text-primary-600 dark:text-primary-400"
              width={32}
            />
          </div>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-primary-800 dark:text-primary-100">
              Add New Tool
            </h1>
            <p className="text-primary-600 dark:text-primary-400 mt-1">
              List your tool and start earning from rentals
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-700 rounded-xl p-4 flex items-start gap-3">
          <Icon
            icon="solar:info-circle-bold"
            className="text-primary-500 dark:text-primary-400 shrink-0 mt-0.5"
            width={20}
          />
          <div className="text-sm text-primary-700 dark:text-primary-300">
            <p className="font-medium mb-1">Tips for a great listing:</p>
            <ul className="list-disc list-inside space-y-1 text-primary-600 dark:text-primary-400">
              <li>Use clear, well-lit photos from multiple angles</li>
              <li>Be specific about the tool&apos;s condition and features</li>
              <li>
                Set competitive pricing based on similar tools in your area
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <AddToolForm />
    </div>
  );
}
