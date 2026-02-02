"use client";

import { useEffect } from "react";
import {
  Conversation,
  useConversations,
  useFetchConversations,
  useIsAllConversationsLoaded,
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
  const isAllConversationsLoaded = useIsAllConversationsLoaded();

  useEffect(() => {
    if (inView) {
      console.log("this ran");

      // Load more conversations when the sentinel comes into view
      if (profile) {
        fetchConversations(profile.id);
      }
      // You can call your load more function here
    }
  }, [inView, entry]);

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
