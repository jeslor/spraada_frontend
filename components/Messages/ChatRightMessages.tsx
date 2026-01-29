"use client";

import {
  Message,
  useConversationStore,
  useFetchMoreMessages,
  useProfile,
  useSelectedConversation,
  useSelectedConversationMessages,
} from "@/store";
import EmptyChat from "./EmptyChat";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatMessageDeletedBubble from "./MessageDeletedBubble";
import MessageChatRightSkeleton from "./MessageChatRightSkeleton";
import MoreMessagesHereIndicator from "./MoreMessagesHereIndicator";
import { useInView } from "react-intersection-observer";

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
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mainMessageContainerRef = useRef<HTMLDivElement>(null);

  const [chatHeightLocked, setChatHeightLocked] = useState(false);

  const profile = useProfile();
  const fetchMoreMessages = useFetchMoreMessages();
  const selectedConversation = useSelectedConversation();
  const messages = useConversationStore(
    (state) => state.selectedConversation?.messages,
  );

  // check if component is unmounted
  useEffect(() => {
    setHasMounted(false);
  }, []);

  // Scroll to bottom logic
  useEffect(() => {
    // Only scroll if content is taller than container
    const container = messagesContainerRef.current;
    if (container && !isOnlyEdited) {
      if (hasMounted) {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
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

  // Load more messages when in view
  // useEffect(() => {
  //   if (inView && !selectedConversation.isAllMessagesLoaded) {
  //     fetchMoreMessages(selectedConversation.id);
  //   }
  // }, [inView, entry, selectedConversation]);

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    setIsOnlyEdited(true);
    // deleteMessage(messageId);
  };

  const isAllLoaded = useConversationStore(
    (state) => state.selectedConversation?.isAllMessagesLoaded,
  );

  // Update scroll effect to watch the actual messages array reference
  //  // Now watching the array itself

  const isLoadingChatSkeleton = false;

  const handleLoadMoreMessages = () => {
    if (selectedConversation && !isAllLoaded) {
      fetchMoreMessages(selectedConversation.id);
    }
  };

  return (
    <div
      ref={mainMessageContainerRef}
      className="flex-1 min-h-0 overflow-y-auto px-4 pt-6 pb-4 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 scrollbar-hide"
    >
      {isLoadingChatSkeleton ? (
        <MessageChatRightSkeleton />
      ) : !selectedConversation || messages?.length === 0 ? (
        <EmptyChat />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 scrollbar-hide "
        >
          {!isAllLoaded && (
            <MoreMessagesHereIndicator
              handleLoadMoreMessages={handleLoadMoreMessages}
            />
          )}
          {messages?.map((msg: Message, idx: number) =>
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
                isLast={idx === messages.length - 1}
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
