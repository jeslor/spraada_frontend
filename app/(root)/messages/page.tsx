"use client";

import { useChatSocket } from "@/Hooks/InitializeMessageSocket";

import {
  ProfileSummary,
  useFetchMessages,
  useMessageActions,
  useMessages,
  useProfile,
  useSelectedUserToMessage,
} from "@/store";

import { useEffect, useState } from "react";
import ChatContainer from "@/components/Messages/ChatContainer";

export default function MessagesPage() {
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [hasFetchedProfiles, setHasFetchedProfiles] = useState(false);

  const fetchMessages = useFetchMessages();
  const messages = useMessages();

  const { userProfiles } = useMessageActions();
  const profile = useProfile();

  /* ✅ Hooks must be called at top-level */
  useChatSocket(profile?.id!);

  /* Fetch messages */
  useEffect(() => {
    if (profile?.id && !hasFetchedMessages) {
      fetchMessages(profile.id);
      setHasFetchedMessages(true);
    }
  }, [profile?.id, hasFetchedMessages, fetchMessages]);

  /* Build user profiles from messages */
  useEffect(() => {
    if (hasFetchedMessages && !hasFetchedProfiles && messages.length > 0) {
      userProfiles();
      setHasFetchedProfiles(true);
    }
  }, [hasFetchedMessages, hasFetchedProfiles, messages]);

  return hasFetchedMessages && hasFetchedProfiles ? (
    <ChatContainer />
  ) : (
    <div>Loading messages...</div>
  );
}
