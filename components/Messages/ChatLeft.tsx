"use client";

import { use, useEffect, useState } from "react";
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

  //--- Local State ---//
  const [localConversations, setLocalConversations] = useState<Conversation[]>(
    [],
  );

  //--- Store Hooks ---//
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
    isLoadingConversations,
    isAllConversationsLoaded,
    profile?.id,
    fetchConversations,
  ]);

  useEffect(() => {
    const sortedConversations = [...conversations].sort((a, b) => {
      //sort by last message timestamp, if no messages sort by conversation created at timestamp
      const aLastMessageTimestamp =
        a.messages?.[a.messages.length - 1]?.createdAt || a.createdAt;
      const bLastMessageTimestamp =
        b.messages?.[b.messages.length - 1]?.createdAt || b.createdAt;
      return (
        new Date(bLastMessageTimestamp).getTime() -
        new Date(aLastMessageTimestamp).getTime()
      );
    });
    setLocalConversations(sortedConversations);
  }, [conversations]);

  return isLoadingUnreadConversations ? (
    <MessageLeftChatSkeleton attachRef={false} />
  ) : (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 md:pb-4">
        {localConversations.length > 0 &&
          localConversations.map(
            (conversation: Conversation, index: number) => (
              <ChatLeftUser
                key={conversation.id}
                conversation={conversation}
                index={index}
              />
            ),
          )}
        {!isAllConversationsLoaded && (
          <MessageLeftChatSkeleton attachRef={true} ref={ref} />
        )}
      </div>
    </div>
  );
};

export default ChatLeft;
