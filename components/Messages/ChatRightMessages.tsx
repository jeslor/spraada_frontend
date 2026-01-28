"use client";

import { Message, useProfile, useSelectedConversation } from "@/store";
import EmptyChat from "./EmptyChat";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatMessageDeletedBubble from "./MessageDeletedBubble";
import MessageChatRightSkeleton from "./MessageChatRightSkeleton";
import MoreMessagesHereIndicator from "./MoreMessagesHereIndicator";

const ChatRightMessages = ({
  setHasMounted,
  setIsOnlyEdited,
  isOnlyEdited,
  hasMounted,
}: {
  hasMounted: boolean;
  isOnlyEdited: boolean;
  setHasMounted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOnlyEdited: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mainMessageContainerRef = useRef<HTMLDivElement>(null);

  const [chatHeightLocked, setChatHeightLocked] = useState(false);

  const profile = useProfile();
  const selectedConversation = useSelectedConversation();
  // const resetUserUnreadMessagesCount = useResetUserUnreadMessagesCount();

  useEffect(() => {
    setHasMounted(false);
  }, []);

  // Scroll to bottom logic
  useEffect(() => {
    // Only scroll if content is taller than container
    const container = messagesContainerRef.current;
    if (container && !isOnlyEdited) {
      if (hasMounted) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        messagesEndRef.current?.scrollIntoView();
      }
    }
  }, [selectedConversation?.messages.length]); // Only when messages change

  //prevent scroll when action menu is open
  useEffect(() => {
    const container = mainMessageContainerRef.current;
    if (container) {
      if (chatHeightLocked) {
        container.style.overflowY = "hidden";
      } else {
        container.style.overflowY = "auto";
      }
    }
    return () => {
      if (container) {
        container.style.overflowY = "auto";
      }
    };
  }, [chatHeightLocked]);

  // reset conversation count
  useEffect(() => {
    if (selectedConversation?.otherParticipant) {
      // resetUserUnreadMessagesCount(selectedConversation.otherParticipant.id);
    }
  }, [selectedConversation]);

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    setIsOnlyEdited(true);
    // deleteMessage(messageId);
  };

  const isLoadingChatSkeleton = false;

  return (
    <div
      ref={mainMessageContainerRef}
      className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide"
    >
      {isLoadingChatSkeleton ? (
        <MessageChatRightSkeleton />
      ) : !selectedConversation ||
        selectedConversation.messages.length === 0 ? (
        <EmptyChat />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 scrollbar-hide "
        >
          <MoreMessagesHereIndicator />
          {selectedConversation.messages.map((msg: Message, idx: number) =>
            (profile?.id && msg.deletedBySender) ||
            (profile?.id && msg.deletedByReceiver) ? (
              <ChatMessageDeletedBubble
                key={msg.id || idx}
                isFromCurrentUser={msg.senderId === profile?.id}
              />
            ) : (
              <MessageBubble
                handleDeleteMessage={handleDeleteMessage}
                setChatHeightLocked={setChatHeightLocked}
                key={msg.id || idx}
                msg={msg}
                profileId={profile?.id!}
                idx={idx}
              />
            ),
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatRightMessages;
