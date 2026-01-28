"use client";

import { useState } from "react";
import { Conversation, useProfile, useSelectedConversation } from "@/store";
import ChatForm from "./ChatForm";

import ChatRightMessages from "./ChatRightMessages";

export default function ChatRight() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isOnlyEdited, setIsOnlyEdited] = useState(false);

  const selectedConversation = useSelectedConversation();

  //   ==========================Effects==========================

  // Reset unread messages count when viewing messages

  // // Set messages for selected user
  // useEffect(() => {
  //   setHasMounted(true);
  //   if (selectedUserToMessage) {
  //     setSelectedUserMessages(selectedUserToMessage.id);
  //   }
  // }, [selectedUserToMessage, messages]);

  //   ==========================Actions==========================

  return (
    <div className="flex flex-col flex-1 h-full w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages */}
      <ChatRightMessages
        setHasMounted={setHasMounted}
        setIsOnlyEdited={setIsOnlyEdited}
        hasMounted={hasMounted}
        isOnlyEdited={isOnlyEdited}
      />
      {/* Chat Form */}
      <ChatForm
        otherParticipant={selectedConversation?.otherParticipant || null}
        setIsOnlyEdited={setIsOnlyEdited}
        setHasMounted={setHasMounted}
      />
    </div>
  );
}
