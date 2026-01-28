"use client";

import {
  Conversation,
  ProfileSummary,
  useConversations,
  useFetchConversations,
  useIsLoadingConversations,
  useProfile,
} from "@/store";
import ChatLeftUser from "./ChatLeftUser";
import MessageLeftChatSkeleton from "./MessageLeftChatSkeleton";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface ChatLeftProps {
  onSelectUser: (user: ProfileSummary) => void;
}

const ChatLeft = ({ onSelectUser }: ChatLeftProps) => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const conversations = useConversations();
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

  console.log(conversations);

  return isConversationsLoading ? (
    <MessageLeftChatSkeleton attachRef={false} />
  ) : (
    <div>
      {conversations.map((conversation: Conversation) => (
        // <ChatLeftUser
        //   unreadMessagesCounters={{}}
        //   unreadCount={0}
        //   key={conversation.id}
        //   profile={conversation.otherParticipant}
        //   selectedUser={null}
        //   onSelectUser={onSelectUser}
        // />
        <div key={conversation.id}>user</div>
      ))}
      {/* <MessageLeftChatSkeleton attachRef={true} ref={ref} /> */}
    </div>
  );
};

export default ChatLeft;
