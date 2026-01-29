import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { MessageStore, Message, ProfileSummary } from "./messages.type";
import { getSocket } from "@/lib/socket/socket";
import { useConversationStore } from "../conversations/conversations.store";
import {
  deleteMessageApi,
  fetchMoreMessagesAPI,
  saveMessageAPI,
} from "@/lib/actions/message.actions";
import { Profile } from "../profile/profile.types";
import { uploadResources } from "@/lib/actions/resources.actions";

const initialState = {
  isNewMessage: false,
};

export const useMessageStore = create<MessageStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setIsNewMessage: (isNew: boolean) => {
        set((state) => {
          state.isNewMessage = isNew;
        });
      },

      // Inside your store
      getOldestMessageId: (conversationId: number) => {
        const conversation = useConversationStore
          .getState()
          .conversations.find((c) => c.id === conversationId);

        if (!conversation || conversation.messages.length === 0) return null;

        // Assuming messages are sorted [oldest...newest]
        // The message at index 0 is the oldest one currently in your store
        return conversation.messages[0];
      },

      getLatestMessageId: (conversationId: number) => {
        const conversation = useConversationStore
          .getState()
          .conversations.find((c) => c.id === conversationId);

        if (!conversation || conversation.messages.length === 0) return null;

        // Assuming messages are sorted [oldest...newest]
        // The message at the last index is the latest one currently in your store
        return conversation.messages[conversation.messages.length - 1];
      },

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
        userId: number,
      ) => {
        const { blobFiles, ...msgWithoutBlob } = msg; // Exclude blobFiles from the message object
        try {
          get().setIsNewMessage(true);
          //add message to conversation store optimistically
          if (conversationId) {
            useConversationStore
              .getState()
              .addMessageToConversation(
                conversationId,
                msgWithoutBlob,
                otherParticipant,
              );
          }

          //saveImages if any and get their URLs
          if (blobFiles && blobFiles.length > 0) {
            const formData = new FormData();
            blobFiles.forEach((file) => {
              formData.append("images", file);
            });

            const uploadResponse = await uploadResources(
              userId,
              formData,
              "chat_media",
            );

            if (uploadResponse.success) {
              msg.mediaFiles = uploadResponse.data.map(
                (file: { url: string; key: string }) => ({
                  mediaUrl: file.url,
                  mediaUrlKey: file.key,
                }),
              );
            } else {
              throw new Error("Failed to upload media files");
            }
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

          get().setIsNewMessage(false);
          if (savedMessage.success) {
            let updatedConversationId = savedMessage.data.conversationId;
            //update message in conversation store with saved message data and also replace conversation id if it was created optimistically

            if (updatedConversationId !== conversationId) {
              useConversationStore
                .getState()
                .replaceConversation(conversationId, {
                  id: updatedConversationId!,
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
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      },

      // Hook to fetch more messages for a conversation
      fetchMoreMessages: async (conversationId: number) => {
        alert("this ran");
        try {
          const lastMessage = get().getOldestMessageId(conversationId);
          const cursor = lastMessage ? lastMessage.id : undefined;
          const result = await fetchMoreMessagesAPI(conversationId, cursor);
          if (!result.success) {
            throw (
              ("error" in result && result.error) ||
              new Error("Failed to fetch more messages")
            );
          }

          if (result.data.length === 0) {
            //mark all messages as loaded
            useConversationStore
              .getState()
              .setConversations(
                useConversationStore
                  .getState()
                  .conversations.map((conv) =>
                    conv.id === conversationId
                      ? { ...conv, isAllMessagesLoaded: true }
                      : conv,
                  ),
              );
          }

          useConversationStore
            .getState()
            .addMoreMessagesToConversation(conversationId, result.data);
        } catch (error) {
          console.error("Failed to fetch more messages:", error);
        }
      },

      // Delete message
      deleteMessage: async (messageId: string, profile: Profile) => {
        if (!profile.id || !messageId) return;
        //get the selected conversation
        const selectedConversation =
          useConversationStore.getState().selectedConversation;
        if (!selectedConversation) return;

        //get the message by id
        let updatedMessage = selectedConversation.messages.find(
          (msg) => msg.id === messageId,
        );

        if (!updatedMessage) return;

        // set a messages as deleted by both if sender. == profile id
        updatedMessage = {
          ...updatedMessage,
          deletedBySender:
            updatedMessage.senderId === profile.id
              ? true
              : updatedMessage.deletedBySender,
          deletedByReceiver: true,
        };

        //update the store optimistically
        useConversationStore
          .getState()
          .replaceMessageInConversation(
            selectedConversation.id,
            messageId,
            updatedMessage,
          );

        // send it to the backend
        try {
          const result = await deleteMessageApi(
            updatedMessage,
            profile.id,
            profile.userId,
          );
          if (!result.success) {
            throw result.message || new Error("Failed to delete message");
          }
          //emit via socket if sender deleted
          if (updatedMessage.deletedBySender) {
            const socket = getSocket(profile.id);
            socket.emit("conversation:delete_message", updatedMessage);
          }
        } catch (error) {
          console.error("Failed to delete message:", error);
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
