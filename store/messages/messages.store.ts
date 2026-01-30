import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { MessageStore, Message, ProfileSummary } from "./messages.type";
import { getSocket } from "@/lib/socket/socket";
import { useConversationStore } from "../conversations/conversations.store";
import {
  deleteMessageApi,
  fetchAllNewMessagesAPI,
  fetchMoreMessagesAPI,
  saveMessageAPI,
} from "@/lib/actions/message.actions";
import { Profile } from "../profile/profile.types";
import { uploadResources } from "@/lib/actions/resources.actions";
import toast from "react-hot-toast";
import { getPreviousMillisecondString } from "@/lib/helpers/dateHelpers";
import { useProfileStore } from "../profile/profile.store";
import { useConversationExists } from "../conversations/conversations.selectors";

const initialState = {
  isNewMessage: false,
  isFetchingNewMessages: false,
  showUnreadNotification: false,
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

      setIsFetchingNewMessages: (isFetching: boolean) => {
        set((state) => {
          state.isFetchingNewMessages = isFetching;
        });
      },
      setNewUnreadNotification: (show: boolean) => {
        set((state) => {
          state.showUnreadNotification = show;
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
        socket.off("conversation");
        socket.on(
          "conversation",
          (payload: {
            conversationId: number;
            otherParticipant: ProfileSummary;
            message: Message;
          }) => {
            const messageExists = useConversationStore
              .getState()
              .conversations.some((conv) =>
                conv.messages.some((msg) => msg.id === payload.message.id),
              );
            if (messageExists) {
              // just update the message in the conversation
              useConversationStore
                .getState()
                .replaceMessageInConversation(
                  payload.conversationId,
                  payload.message.id,
                  payload.message,
                );
              return;
            }

            get().setIsNewMessage(true);
            const conversationExists = useConversationStore
              .getState()
              .conversations.some((c) => c.id === payload.conversationId);
            //if conversation exists, add message to it
            if (conversationExists) {
              useConversationStore
                .getState()
                .addMessageToConversation(
                  payload.conversationId,
                  payload.message,
                  payload.otherParticipant,
                );
              const isSelected =
                useConversationStore.getState().selectedConversation?.id ===
                payload.conversationId;
              const isMessagePage =
                useConversationStore.getState().isMessagePage;
              //only show unread notification if we are not on message page or conversation is not selected
              if (!isSelected || !isMessagePage) {
                //increment unread count
                const conversation = useConversationStore
                  .getState()
                  .conversations.find((c) => c.id === payload.conversationId);
                const currentUnread = conversation?.unreadCount || 0;
                useConversationStore
                  .getState()
                  .updateUnreadCount(payload.conversationId, currentUnread + 1);
              }
            } else {
              //create a new conversation in the store
              useConversationStore.getState().setConversations([
                {
                  id: payload.conversationId,
                  otherParticipant: payload.otherParticipant,
                  messages: [payload.message],
                  currentPage: 1,
                },
                ...useConversationStore.getState().conversations,
              ]);
              useConversationStore
                .getState()
                .updateUnreadCount(payload.conversationId, 1);
            }
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

            //emit message via socket, we emphasise a number because we are sending special notification.
            // const profile = useProfileStore.getState().profile;
            // if (profile && profile.id) {
            //   const socket = getSocket(profile.id);
            //   const conversationToEmit = {
            //     receiverId: otherParticipant.id,
            //     conversationId: updatedConversationId,
            //     otherParticipant: {
            //       id: profile.id,
            //       firstName: profile.firstName,
            //       lastName: profile.lastName,
            //       avatarUrl: profile.avatarUrl,
            //     },
            //     message: savedMessage.data,
            //   };

            //   socket.emit("conversation", conversationToEmit);
            // }
          }
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      },

      // Hook to fetch more messages for a conversation
      fetchMoreMessages: async (conversationId: number) => {
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

      // Hook to fetch new messages for a conversation
      fetchNewMessages: async (conversationId: number) => {
        try {
          get().setIsFetchingNewMessages(true);
          const newestMessage = get().getLatestMessageId(conversationId);
          const cursor = newestMessage ? newestMessage.id : undefined;
          const result = await fetchAllNewMessagesAPI(conversationId, cursor);
          if (!result.success) {
            throw (
              ("error" in result && result.error) ||
              new Error("Failed to fetch new messages")
            );
          }
          if (result.data.length > 0) {
            useConversationStore
              .getState()
              .addNewMessagesToConversation(conversationId, result.data);
            get().setIsFetchingNewMessages(false);
            useConversationStore
              .getState()
              .addNewMessagesToConversation(conversationId, [
                {
                  id: `notification`,
                  content: `${result.data.length} new message(s)`,
                  isSpecialNotification: true,
                  senderId: result.data[0].senderId,
                  createdAt: getPreviousMillisecondString(
                    result.data[0].createdAt,
                  ),
                  sender: {
                    id: 0,
                    firstName: "System",
                    lastName: "",
                  },
                },
              ]);
          } else {
            useConversationStore
              .getState()
              .removeMessageFromConversation(conversationId, "notification");
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch new messages",
          );
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
            socket.emit("conversation", updatedMessage);
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to delete message on server",
          );
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
