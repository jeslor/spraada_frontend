"use client";

import { useEffect, useRef, useState, memo } from "react";
import {
  useDeleteMessage,
  useMessages,
  useProfile,
  useSelectedUserMessages,
  useSelectedUserToMessage,
  useSendMessage,
  useSetSelectedUserMessages,
} from "@/store";
import ChatForm from "./ChatForm";
import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";
import ChatMessageDeletedBubble from "./MessageDeletedBubble";

const MAX_IMAGE_PREVIEWS = 3;
export default memo(function ChatRight() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mainMessageContainerRef = useRef<HTMLDivElement>(null);

  const [isOnlyEdited, setIsOnlyEdited] = useState(false);
  const [chatHeightLocked, setChatHeightLocked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const messages = useMessages();
  const selectedUserToMessage = useSelectedUserToMessage();
  const selectedUserMessages = useSelectedUserMessages();
  const setSelectedUserMessages = useSetSelectedUserMessages();
  const deleteMessage = useDeleteMessage();
  const profile = useProfile();

  useEffect(() => {
    setHasMounted(false);
  }, []);

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

  //   ==========================Effects==========================
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
  }, [selectedUserMessages]); // Only when messages change

  // Set messages for selected user
  useEffect(() => {
    setHasMounted(true);
    if (selectedUserToMessage) {
      setSelectedUserMessages(selectedUserToMessage.id);
    }
  }, [selectedUserToMessage, messages]);

  //   ==========================Actions==========================
  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    setIsOnlyEdited(true);
    deleteMessage(messageId);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <div
        ref={mainMessageContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide"
      >
        {!selectedUserToMessage ? (
          <EmptyChat />
        ) : (
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-4 scrollbar-hide "
          >
            {selectedUserMessages.map((msg: Message, idx: number) =>
              (msg.senderId === profile?.id && msg.deletedBySender) ||
              (msg.receiverId === profile?.id && msg.deletedByReceiver) ? (
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
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Chat Form */}
      <ChatForm
        setIsOnlyEdited={setIsOnlyEdited}
        setHasMounted={setHasMounted}
      />
    </div>
  );
});
