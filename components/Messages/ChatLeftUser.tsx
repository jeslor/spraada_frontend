"use client";

import {
  Conversation,
  Message,
  useGetLatestMessageByConversationId,
  useProfile,
  useSelectedConversation,
  useSetSelectedConversation,
} from "@/store";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface EachSideUserProps {
  conversation: Conversation;
  index: number;
}

const ChatLeftUser = ({ conversation, index }: EachSideUserProps) => {
  const selectedConversation = useSelectedConversation();
  const setSelectedConversation = useSetSelectedConversation();
  const getLatestMessageByConversationId =
    useGetLatestMessageByConversationId();
  const mainProfile = useProfile();

  const profile = conversation.otherParticipant;
  const userLatestMessage = getLatestMessageByConversationId(conversation.id);

  const handleSelectConversation = () => {
    setSelectedConversation(conversation);
  };

  const isDeletedForMe = (
    message: Partial<Message>,
    currentProfileId: number,
  ) => {
    let isDeleted = false;
    if (currentProfileId === message.senderId) {
      isDeleted = message.deletedBySender || false;
    } else {
      isDeleted = message.deletedByReceiver || message.deletedBySender || false;
    }

    return isDeleted;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.03 * index, ease: "easeOut" }}
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
              conversation.unreadCount && conversation.unreadCount > 0
                ? "font-bold text-primary-600"
                : ""
            }`}
          >
            {userLatestMessage && userLatestMessage.mediaFiles?.length ? (
              <Icon
                icon="famicons:camera"
                className="inline-block mr-1 text-[18px]"
              />
            ) : null}
            {userLatestMessage &&
            isDeletedForMe(userLatestMessage, mainProfile?.id!) ? (
              <em>Message deleted</em>
            ) : (
              userLatestMessage?.content
            )}
          </div>
        </div>
        <div className="ml-auto">
          {conversation.unreadCount && conversation.unreadCount > 0 ? (
            <div className="bg-primary-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {conversation.unreadCount > 0 ? conversation.unreadCount : ""}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatLeftUser;
