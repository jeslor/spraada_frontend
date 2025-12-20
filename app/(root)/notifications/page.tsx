import { Icon } from "@iconify/react";

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <Icon icon="solar:bell-bold" className="text-5xl text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Notifications
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Stay updated with booking requests, messages, and important updates.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
            No new notifications. You're all caught up!
          </div>
        </div>
      </div>
    </div>
  );
}
