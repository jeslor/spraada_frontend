"use client";

import {
  Message,
  useConversationStore,
  useDeleteMessage,
  useFetchMoreMessages,
  useProfile,
  useSelectedConversation,
} from "@/store";
import EmptyChat from "./EmptyChat";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatMessageDeletedBubble from "./MessageDeletedBubble";
import MessageChatRightSkeleton from "./MessageChatRightSkeleton";
import MoreMessagesHereIndicator from "./MoreMessagesHereIndicator";
import { useInView } from "react-intersection-observer";

interface ChatRightMessagesProps {
  hasMounted: boolean;
  isLoadMoreMessages: boolean;
  setHasMounted: (hasMounted: boolean) => void;
  setIsLoadMoreMessages: (isLoadMore: boolean) => void;
}

const ChatRightMessages = ({
  hasMounted,
  isLoadMoreMessages,
  setIsLoadMoreMessages,
  setHasMounted,
}: ChatRightMessagesProps) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  //--- Refs ---//
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const mainMessageContainerRef = useRef<HTMLDivElement>(null);

  //--- Local State ---//
  const [chatHeightLocked, setChatHeightLocked] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  //---Store Hooks---//
  const profile = useProfile();
  const fetchMoreMessages = useFetchMoreMessages();
  const selectedConversation = useSelectedConversation();
  const deleteMessage = useDeleteMessage();
  const messages = useConversationStore(
    (state) => state.selectedConversation?.messages,
  );

  const lastMessage = messages ? messages[messages.length - 1] : null;

  // check if component is unmounted
  useEffect(() => {
    if (hasMounted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (!isLoadMoreMessages && messages?.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
    setHasMounted(false);
    return () => {
      setHasMounted(true);
    };
  }, [hasMounted, isLoadMoreMessages, messages?.length]);

  //useEffect to track scroll position
  useEffect(() => {
    const container = mainMessageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Show "Scroll to Bottom" button if not near bottom
      if (scrollHeight - scrollTop - clientHeight > 100) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to bottom logic
  // useEffect(() => {
  //   // Only scroll if content is taller than container
  //   const container = messagesContainerRef.current;
  //   if (container && !isOnlyEdited) {
  //     if (hasMounted) {
  //       messagesEndRef.current?.scrollIntoView();
  //     }
  //   }
  // }, []); // Only when messages change

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
    if (profile && selectedConversation) {
      deleteMessage(messageId, profile);
    }
  };

  const isAllLoaded = useConversationStore(
    (state) => state.selectedConversation?.isAllMessagesLoaded,
  );

  // Update scroll effect to watch the actual messages array reference
  //  // Now watching the array itself

  const isLoadingChatSkeleton = false;

  const handleLoadMoreMessages = () => {
    if (selectedConversation && !isAllLoaded) {
      setIsLoadMoreMessages(true);
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
                isLastMessage={lastMessage === msg}
              />
            ),
          )}
          {showScrollToBottom && (
            <div
              className="fixed bottom-20 right-8 bg-primary-600 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-colors z-50"
              onClick={() =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ↓
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatRightMessages;
