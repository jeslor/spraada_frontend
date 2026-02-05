"use client";

import {
  Message,
  useConversationStore,
  useDeleteMessage,
  useFetchMoreMessages,
  useFetchNewMessages,
  useProfile,
  useSelectedConversation,
} from "@/store";
import EmptyChat from "./EmptyChat";
import { use, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatMessageDeletedBubble from "./MessageDeletedBubble";
import MessageChatRightSkeleton from "./MessageChatRightSkeleton";
import MoreMessagesHereIndicator from "./MoreMessagesHereIndicator";
import { useInView } from "react-intersection-observer";
import { getPreviousMillisecondString } from "@/lib/helpers/dateHelpers";

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
  const previousScrollHeightRef = useRef<number>(0);
  const previousMessageCountRef = useRef<number>(0);
  const skipScrollToBottomRef = useRef<boolean>(false);

  //--- Local State ---//
  const [chatHeightLocked, setChatHeightLocked] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [messagesToRender, setMessagesToRender] = useState<Message[] | []>([]);
  //---Store Hooks---//
  const profile = useProfile();
  const fetchMoreMessages = useFetchMoreMessages();
  const selectedConversation = useSelectedConversation();
  const deleteMessage = useDeleteMessage();
  const fetchNewMessages = useFetchNewMessages();
  const conversationUnreadNotifications = useConversationStore(
    (state) => state.conversationUnreadNotifications,
  );
  const messages = useConversationStore(
    (state) => state.selectedConversation?.messages,
  );

  const selectedConversationUnreadMessage =
    conversationUnreadNotifications.find(
      (notification) =>
        notification.conversationId === selectedConversation?.id,
    );

  const selectedConversationUnreadMessageIndex = messages?.findIndex(
    (msg) => msg.createdAt === selectedConversationUnreadMessage?.createdAt,
  );

  useEffect(() => {
    if (
      selectedConversationUnreadMessage?.hasNotification &&
      messages &&
      selectedConversationUnreadMessageIndex !== -1
    ) {
      const newMessages = [
        ...messages.slice(0, selectedConversationUnreadMessageIndex! + 1),
        {
          id: `notification`,
          content: `${selectedConversationUnreadMessage.unreadCount} unread messages below this point`,
          isSpecialNotification: true,
          senderId: 0,
          createdAt: getPreviousMillisecondString(
            selectedConversationUnreadMessage.createdAt!,
          ),
          sender: {
            id: 0,
            firstName: "System",
            lastName: "",
          },
        },
        ...messages.slice(selectedConversationUnreadMessageIndex! + 1),
      ];
      setMessagesToRender(newMessages);
    } else {
      setMessagesToRender(messages || []);
    }
  }, [selectedConversation?.id, conversationUnreadNotifications, messages]);

  const lastMessage = messages ? messages[messages.length - 1] : null;

  //LoadNewMessages
  useEffect(() => {
    if (selectedConversation) {
      fetchNewMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  // check if component is unmounted
  useEffect(() => {
    if (hasMounted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (
      !isLoadMoreMessages &&
      messages?.length &&
      messagesEndRef.current &&
      !skipScrollToBottomRef.current
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
    skipScrollToBottomRef.current = false;
    setHasMounted(false);
    return () => {
      setHasMounted(true);
    };
  }, [hasMounted, isLoadMoreMessages, messages?.length]);

  // Handle scroll position preservation when loading more messages
  useEffect(() => {
    const container = mainMessageContainerRef.current;
    if (!container) return;

    // Store scroll height when load more is initiated
    if (isLoadMoreMessages && previousMessageCountRef.current === 0) {
      previousScrollHeightRef.current = container.scrollHeight;
      previousMessageCountRef.current = messagesToRender?.length || 0;
    }

    // Restore scroll position when new messages are added
    if (
      isLoadMoreMessages &&
      messagesToRender &&
      messagesToRender.length > previousMessageCountRef.current
    ) {
      const newScrollHeight = container.scrollHeight;
      const scrollHeightDifference =
        newScrollHeight - previousScrollHeightRef.current;
      container.scrollTop += scrollHeightDifference;

      // Mark that we handled load more and should skip auto scroll to bottom
      skipScrollToBottomRef.current = true;

      // Reset refs and stop load more
      previousScrollHeightRef.current = 0;
      previousMessageCountRef.current = 0;
      setIsLoadMoreMessages(false);
    }
  }, [isLoadMoreMessages, messagesToRender?.length, setIsLoadMoreMessages]);

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
          {messagesToRender?.map((msg: Message, idx: number) =>
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
              className="fixed bottom-36 md:bottom-20 right-8 bg-primary-600 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-colors z-50"
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
