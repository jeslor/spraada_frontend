"use client";

import { useEffect } from "react";
import {
  Conversation,
  useConversations,
  useFetchConversations,
  useIsAllConversationsLoaded,
  useIsLoadingConversations,
  useIsLoadingUnreadConversations,
  useProfile,
} from "@/store";
import ChatLeftUser from "./ChatLeftUser";
import MessageLeftChatSkeleton from "./MessageLeftChatSkeleton";
import { useInView } from "react-intersection-observer";

const ChatLeft = () => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const conversations = useConversations();
  const profile = useProfile();
  const fetchConversations = useFetchConversations();
  const isLoadingUnreadConversations = useIsLoadingUnreadConversations();
  const isLoadingConversations = useIsLoadingConversations();
  const isAllConversationsLoaded = useIsAllConversationsLoaded();

  // Load more conversations when the skeleton comes into view
  useEffect(() => {
    if (inView && !isLoadingConversations && !isAllConversationsLoaded) {
      if (profile) {
        fetchConversations(profile.id);
      }
    }
  }, [
    inView,
    entry,
    isLoadingConversations,
    isAllConversationsLoaded,
    profile,
  ]);

  return isLoadingUnreadConversations ? (
    <MessageLeftChatSkeleton attachRef={false} />
  ) : (
    <div>
      {conversations.length > 0 &&
        conversations.map((conversation: Conversation) => (
          <ChatLeftUser key={conversation.id} conversation={conversation} />
        ))}
      {!isAllConversationsLoaded && (
        <MessageLeftChatSkeleton attachRef={true} ref={ref} />
      )}
    </div>
  );
};

export default ChatLeft;
