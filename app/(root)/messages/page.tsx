import { Icon } from "@iconify/react";

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon
            icon="solar:chat-round-dots-bold"
            className="text-5xl text-blue-600"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Messages
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Chat with tool owners and renters. Your conversations will appear
          here.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
            No messages yet. Start a conversation by renting a tool!
          </div>
        </div>
      </div>
    </div>
  );
}
