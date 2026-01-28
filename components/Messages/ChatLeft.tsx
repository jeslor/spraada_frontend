"use client";

import {
  Conversation,
  useConversations,
  useFetchConversations,
  useIsLoadingConversations,
  useProfile,
  useSelectedConversation,
} from "@/store";
import ChatLeftUser from "./ChatLeftUser";
import MessageLeftChatSkeleton from "./MessageLeftChatSkeleton";
import { memo, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { set } from "zod";

const ChatLeft = memo(() => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const conversations = useConversations();
  const selectedConversation = useSelectedConversation();
  const isConversationsLoading = useIsLoadingConversations();
  const fetchConversations = useFetchConversations();
  const profile = useProfile();

  useEffect(() => {
    if (conversations.length === 0 && profile?.id) {
      fetchConversations(profile.id);
      //load the messages and profiles
      //observe the MessageLeftChatSkeleton to load more profiles when it comes into view
    }
  }, [profile?.id]);

  useEffect(() => {
    if (inView && !isConversationsLoading && profile?.id) {
      fetchConversations(profile.id);
    }
  }, [inView, entry]);

  const selectedChatLeftUser = selectedConversation?.otherParticipant || null;

  return isConversationsLoading ? (
    <MessageLeftChatSkeleton attachRef={false} />
  ) : (
    <div>
      {conversations.length > 0 &&
        conversations.map((conversation: Conversation) => (
          <ChatLeftUser
            unreadMessagesCounters={{}}
            unreadCount={0}
            key={conversation.id}
            conversation={conversation}
            selectedUser={selectedChatLeftUser}
          />
        ))}
      {/* <MessageLeftChatSkeleton attachRef={true} ref={ref} /> */}
    </div>
  );
});

export default ChatLeft;
