"use client";

import {
  Conversation,
  useGetLatestMessageByConversationId,
  useSelectedConversation,
  useSetSelectedConversation,
} from "@/store";
import { Icon } from "@iconify/react";

interface EachSideUserProps {
  unreadCount: number;
  conversation: Conversation;
  selectedUser: {
    id: number;
  } | null;
  unreadMessagesCounters: Record<number, number>;
}

const ChatLeftUser = ({
  unreadCount,
  conversation,
  unreadMessagesCounters,
}: EachSideUserProps) => {
  const selectedConversation = useSelectedConversation();
  const setSelectedConversation = useSetSelectedConversation();
  const getLatestMessageByConversationId =
    useGetLatestMessageByConversationId();

  const profile = conversation.otherParticipant;
  const userLatestMessage = getLatestMessageByConversationId(conversation.id);

  const handleSelectConversation = () => {
    setSelectedConversation(conversation);
  };

  const isDeletedForMe = (message: any, userId: number) => {
    return message.deletedFor?.includes(userId);
  };

  return (
    <div
      onClick={handleSelectConversation}
      key={profile.id}
      className={`p-2  cursor-pointer hover:bg-primary/10  ${
        selectedConversation?.otherParticipant.id === profile.id
          ? "bg-primary/10"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={profile.avatarUrl || "/default-avatar.png"}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <p className="m-0 p-0 font-semibold text-[12px]">{`${profile.firstName} ${profile.lastName}`}</p>
          <div
            className={`m-0 p-0 text-[11px] text-gray-500 font-medium truncate max-w-[180px] ${
              unreadCount > 0 ? "font-bold text-primary-600" : ""
            }`}
          >
            {userLatestMessage && userLatestMessage.mediaFiles?.length ? (
              <Icon
                icon="famicons:camera"
                className="inline-block mr-1 text-[18px]"
              />
            ) : null}
            {userLatestMessage &&
            isDeletedForMe(userLatestMessage, profile.id) ? (
              <em>Message deleted</em>
            ) : (
              userLatestMessage?.content
            )}
          </div>
        </div>
        <div className="ml-auto">
          {unreadCount > 0 && (
            <div className="bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLeftUser;
