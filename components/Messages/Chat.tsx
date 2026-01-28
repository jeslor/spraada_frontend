"use client";

import React, { useEffect, memo } from "react";

import {
  Conversation,
  ProfileSummary,
  useConversations,
  useSelectedConversation,
  useSetSelectedConversation,
} from "@/store";
import { useSearchParams } from "next/navigation";
import ChatLeft from "./ChatLeft";
import ChatRight from "./ChatRight";

const Chat = () => {
  const searchParams = useSearchParams();
  const [otherParticipant, setOtherParticipant] =
    React.useState<ProfileSummary | null>(null);

  const selectedConversation = useSelectedConversation();
  const setSelectedConversation = useSetSelectedConversation();
  const conversations = useConversations();

  /* Handle URL params & localStorage */
  useEffect(() => {
    const userId = searchParams.get("userId");
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const avatarUrl = searchParams.get("avatarUrl") || undefined;

    if (userId && firstName && lastName) {
      //check if conversation with this user already exists
      const existingConversation = conversations.find(
        (conv: Conversation) => conv.otherParticipant.id === Number(userId),
      );
      // If exists, set it as selected conversation
      if (existingConversation) {
        setSelectedConversation(existingConversation);
        return;
      }

      // If not, create a new conversation object
      const newParticipant: ProfileSummary = {
        id: Number(userId),
        firstName,
        lastName,
        avatarUrl,
      };
      // Set selected conversation to a new conversation with this user
      setSelectedConversation({
        id: Math.random() + Date.now(), // Temporary ID, replace with real one when creating conversation
        otherParticipant: newParticipant,
        lastMessage: null,
        messages: [],
      });
      return;
    }
  }, [searchParams, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const { otherParticipant } = selectedConversation;
      setOtherParticipant(otherParticipant);
    }
  }, [selectedConversation]);

  return (
    <div className="flex h-dvh min-h-0 fixed w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)]">
      <div className="bg-primary-50 w-[80vw] max-w-[300px] min-w-[220px] h-full border-r border-gray-200">
        <ChatLeft />
      </div>

      <div className="flex-1 flex flex-col h-full min-h-0 p-0 m-0">
        <ChatRight />
      </div>
    </div>
  );
};

export default Chat;
