import { Icon } from "@iconify/react";

export default function RentalsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <Icon
            icon="solar:hand-shake-bold"
            className="text-5xl text-green-600"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          My Rentals
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Tools you're renting out to others. Track bookings and manage your
          listings.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
            No active rentals. List a tool to start earning!
          </div>
        </div>
      </div>
    </div>
  );
}
