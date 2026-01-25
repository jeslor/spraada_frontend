"use client";

import {
  useFetchMessages,
  useMessageActions,
  useMessages,
  useProfile,
  useSelectedUserToMessage,
} from "@/store";

import { useEffect, useState } from "react";
import Chat from "@/components/Messages/Chat";
import ChatLoading from "@/components/Messages/ChatLoading";

export default function Messages() {
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);
  const [hasFetchedProfiles, setHasFetchedProfiles] = useState(false);

  const fetchMessages = useFetchMessages();
  const selectedUserToMessage = useSelectedUserToMessage();
  const messages = useMessages();

  const { userProfiles } = useMessageActions();
  const profile = useProfile();

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

  return hasFetchedMessages ? <Chat /> : <ChatLoading />;
}
