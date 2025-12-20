import { Icon } from "@iconify/react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="solar:settings-bold" className="text-5xl text-gray-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Settings
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Manage your account preferences, notifications, and privacy settings.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                Account Settings
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-gray-400" />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                Notification Preferences
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-gray-400" />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                Privacy & Security
              </span>
              <Icon icon="solar:arrow-right-linear" className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
