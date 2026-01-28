"use client";

import {
  Conversation,
  useConversations,
  useIsLoadingConversations,
  useSelectedConversation,
} from "@/store";
import ChatLeftUser from "./ChatLeftUser";
import MessageLeftChatSkeleton from "./MessageLeftChatSkeleton";
import { memo, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const ChatLeft = () => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const conversations = useConversations();
  const selectedConversation = useSelectedConversation();
  const isConversationsLoading = useIsLoadingConversations();

  // useEffect(() => {
  //   if (inView && !isConversationsLoading && profile?.id) {
  //     fetchConversations(profile.id);
  //   }
  // }, [inView, entry]);

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
};

export default ChatLeft;
