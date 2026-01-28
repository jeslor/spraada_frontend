import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { MessageStore, Message, ProfileSummary } from "./messages.type";
import { getSocket } from "@/lib/socket/socket";
import { useConversationStore } from "../conversations/conversations.store";
import { saveMessageAPI } from "@/lib/actions/message.actions";

const initialState = {
  messages: [] as Message[],
};

export const useMessageStore = create<MessageStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Socket: listen for new conversation messages
      initConversationSocketListeners: (profileId: number) => {
        const socket = getSocket(profileId);
        socket.off("conversation:new_message");
        socket.on(
          "conversation:new_message",
          (payload: { conversationId: number; message: Message }) => {
            useConversationStore
              .getState()
              .addMessageToConversation(
                payload.conversationId,
                payload.message,
              );
          },
        );
      },

      // Send message: save, emit, and handoff to conversation store
      sendMessage: async (
        msg: Message,
        otherParticipant: ProfileSummary,
        conversationId: number,
      ) => {
        //add message to conversation store optimistically
        if (conversationId) {
          useConversationStore
            .getState()
            .addMessageToConversation(conversationId, msg, otherParticipant);
        }

        //save message to backend
        const savedMessage = await saveMessageAPI(
          {
            mediaFiles: msg.mediaFiles,
            content: msg.content,
            senderId: msg.senderId,
          },
          otherParticipant.id,
        );

        if (savedMessage.success) {
          let updatedConversationId = savedMessage.data.conversationId;
          //update message in conversation store with saved message data and also replace conversation id if it was created optimistically

          if (updatedConversationId !== conversationId) {
            useConversationStore
              .getState()
              .replaceConversation(conversationId, {
                id: updatedConversationId,
                otherParticipant: otherParticipant,
                messages: [savedMessage.data],
                currentPage: 1,
              });
          } else {
            //update only the message in the conversations
            useConversationStore
              .getState()
              .replaceMessageInConversation(
                updatedConversationId,
                msg.id,
                savedMessage.data,
              );
          }

          //emit message via socket
          const socket = getSocket(msg.senderId);
          socket.emit("conversation:send_message", {
            conversationId: updatedConversationId,
            message: savedMessage.data,
          });
        }
      },
    })),
    {
      name: "messages-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: MessageStore) => ({}),
    },
  ),
);
