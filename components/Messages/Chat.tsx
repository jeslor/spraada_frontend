"use client";

import React, { useEffect } from "react";

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
import { Icon } from "@iconify/react";

const Chat = () => {
  const searchParams = useSearchParams();
  const selectedConversation = useSelectedConversation();
  const setSelectedConversation = useSetSelectedConversation();
  const conversations = useConversations();

  // ====================consider removing this since we load the conversations with unread first
  // const fetchConversations = useFetchConversations();
  // const hasHydratedConversations = useHasHydratedConversations();
  // const profile = useProfile();

  // /* Fetch conversations on mount if not already fetched */
  // useEffect(() => {
  //   if (hasHydratedConversations && profile?.id && conversations.length === 0) {
  //     fetchConversations(profile.id);
  //   }
  // }, [hasHydratedConversations, profile?.id, conversations.length]);
  // ===================================================================================================

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
  }, [searchParams]);

  const handleBackToChats = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-dvh min-h-0 fixed w-full md:w-[calc(100vw-79px)] xl:w-[calc(100vw-250px)]">
      <div className="bg-primary-50 w-full md:max-w-[300px] min-w-[220px] h-dvh border-r border-gray-200">
        <ChatLeft />
      </div>

      <div
        className={`flex-1 flex flex-col  min-h-0 p-0 m-0 fixed ${selectedConversation ? "left-0" : "left-full"} h-[calc(100dvh-64px)] md:h-full md:left-0 md:relative w-full transition-left duration-220 ease-in-out`}
      >
        <div className="md:hidden h-12 bg-primary-600 flex items-center gap-4 px-4 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div
            onClick={handleBackToChats}
            className="w-fit rotate-90 bg-primary-500 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-colors z-50"
          >
            ↓
          </div>
          <div className="flex justify-items-start items-center font-semibold gap-2 m-0 p-0 h-full">
            <img
              src={
                selectedConversation?.otherParticipant.avatarUrl ||
                "/default-avatar.png"
              }
              alt={`${selectedConversation?.otherParticipant.firstName} ${selectedConversation?.otherParticipant.lastName}`}
              className="w-8 h-8 rounded-full inline-block border-2 border-white"
            />
            <span className="text-primary-50 text-sm block">
              {selectedConversation
                ? `${selectedConversation.otherParticipant.firstName} ${selectedConversation.otherParticipant.lastName}`
                : "Select a conversation"}
            </span>
          </div>
        </div>
        <ChatRight />
      </div>
    </div>
  );
};

export default Chat;
