import Chat from "@/components/Messages/Chat";
import SideUsers from "@/components/Messages/SideUsers";
import { Icon } from "@iconify/react";

export default async function MessagesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-[300px_1fr] h-full  overflow-x-scroll">
      <div className="bg-primary-50 w-screen sm:w-[300px]">
        <SideUsers userId={Number(id)} />
      </div>
      <div className=" mx-auto px-4 py-8 overflow-y-scroll  flex-1 w-screen sm:w-auto  ">
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
              <Chat userId={Number(id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
