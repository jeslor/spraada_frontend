import Chat from "@/components/Messages/Chat";
import SideUsers from "@/components/Messages/SideUsers";
import { Icon } from "@iconify/react";

export default async function MessagesPage({
  params,
}: {
  params: { profileId: string };
}) {
  const { profileId } = await params;

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)] ">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <SideUsers profileId={Number(profileId)} />
      </div>
      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        <Chat profileId={Number(profileId)} />
      </div>
    </div>
  );
}
