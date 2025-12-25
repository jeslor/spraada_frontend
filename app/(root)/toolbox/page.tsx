import { Icon } from "@iconify/react";

export default function ToolboxPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
          <Icon icon="solar:box-bold" className="text-5xl text-amber-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          My Toolbox
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Tools you've acquired or are currently renting from others will appear
          here.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
            Your toolbox is empty. Browse listings to rent your first tool!
          </div>
        </div>
      </div>
    </div>
  );
}
