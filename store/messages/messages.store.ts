import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageStore, Message, ProfileSummary } from "./messages.type";
import {
  fetchMessagesApi,
  fetchUnreadMessagesCountApi,
  saveMessageAPI,
  deleteMessageApi,
  updateUnreadMessagesCountApi,
} from "@/lib/actions/message.actions";
import { getSocket } from "@/lib/socket/socket";
import { useProfileStore } from "../profile/profile.store";
import { uploadResources } from "@/lib/actions/resources.actions";

const initialState = {
  messages: [],
  isMessagePage: false,
  isLoading: false,
  error: null,
  profiles: [],
  selectedUserToMessage: null,
  selectedUserMessages: [],
  unreadMessagesCount: {
    id: 0,
    profileId: 0,
    counters: {},
  },
};

export const useMessageStore = create<MessageStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setIsMessagePage: (isMessagePage: boolean) => {
        set((state) => {
          state.isMessagePage = isMessagePage;
        });
      },
      setMessages: (messages: Message[]) => {
        set((state) => {
          state.messages = messages;
          state.error = null;
        });
      },
      setSelectedUserMessages: (selectedUserId: number) => {
        const messages = useMessageStore.getState().messages;

        const filteredMessages = messages.filter(
          (msg) =>
            msg.senderId === selectedUserId || msg.receiverId === selectedUserId
        );

        set((state) => {
          state.selectedUserMessages = filteredMessages;
        });
      },

      setUnreadMessagesCount: async (unreadMessagesCount: {
        id: number;
        profileId: number;
        counters: { [key: number]: number };
      }) => {
        set((state) => {
          state.unreadMessagesCount = unreadMessagesCount;
        });
      },

      setProfiles: (profiles: ProfileSummary[]) => {
        set((state) => {
          state.profiles = profiles;
        });
      },
      updateProfiles: (profile: ProfileSummary) => {
        set((state) => {
          const index = state.profiles.findIndex((p) => p.id === profile.id);
          if (index !== -1) {
            state.profiles[index] = profile;
          } else {
            state.profiles.push(profile);
          }
        });
      },
      setSelectedUserToMessage: (profile: ProfileSummary | null) => {
        set((state) => {
          state.selectedUserToMessage = profile;
        });
      },
      setLoading: (isLoading: boolean) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },
      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      // ------------------ UNREAD MESSAGES COUNT ------------------ //
      fetchUnReadMessagesCount: async (profileId: number) => {
        try {
          const unReadMessages = await fetchUnreadMessagesCountApi(profileId);
          if (unReadMessages) {
            get().setUnreadMessagesCount(unReadMessages);
          }
        } catch (error) {
          throw error;
        }
      },
      updateUnreadMessagesCount: async (
        messageCounterId: number,
        profileId: number,
        counters: { [key: number]: number }
      ) => {
        try {
          if (!profileId) return;
          const updatedCount = await updateUnreadMessagesCountApi(
            messageCounterId,
            profileId,
            counters
          );
          if (updatedCount) {
            get().setUnreadMessagesCount(updatedCount);
          }
        } catch (error) {
          throw error;
        }
      },

      resetUserUnreadMessagesCount: (selectedUserId: number) => {
        get().updateUnreadMessagesCount(
          get().unreadMessagesCount.id,
          get().unreadMessagesCount.profileId,
          {
            ...get().unreadMessagesCount.counters,
            [selectedUserId]: 0,
          }
        );
      },

      /* ------------------ FETCH MESSAGES ------------------ */
      fetchMessages: async (profileId: number) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        try {
          const messages = await fetchMessagesApi(profileId);

          set((state) => {
            state.messages = messages || [];
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Failed to fetch messages";
            state.isLoading = false;
          });
        }
      },

      /* ------------------ UPDATE MESSAGES ------------------ */
      updateMessages: (updatedMessage: Message, localId?: string) => {
        set((state) => {
          const index = state.messages.findIndex((msg) =>
            localId ? msg.id === localId : msg.id === updatedMessage.id
          );

          if (index !== -1) {
            state.messages[index] = updatedMessage;
          } else {
            state.messages.push(updatedMessage);
          }
        });
      },

      /* ------------------ RECEIVE MESSAGE ------------------ */
      addIncomingMessage: (message: Message) => {
        set((state) => {
          const exists = state.messages.some((m) => m.id === message.id);
          if (!exists) {
            state.messages.push(message);
          }
        });
      },

      /* ------------------ SOCKET CHATS INIT ------------------ */
      initSChatSocketListeners: (profileId: number) => {
        const socket = getSocket(profileId);

        socket.off("chats"); // prevent duplicate listeners

        socket.on("chats", (incomingMessage: Message) => {
          // Check if message already exists and just update deletion status
          const messages = get().messages;
          let existingMessageIndex;
          const exists = messages.some((msg, idx) => {
            if (msg.id === incomingMessage.id) {
              existingMessageIndex = idx;
              return true;
            }
            return false;
          });
          const existingMessage =
            existingMessageIndex !== undefined
              ? messages[existingMessageIndex]
              : null;

          if (exists) {
            if (existingMessage && typeof existingMessage.id === "string") {
              get().updateMessages({
                ...existingMessage,
                deletedByReceiver: incomingMessage.deletedByReceiver,
                deletedBySender: incomingMessage.deletedBySender,
                id: existingMessage.id!, // ensure id is always present and string
              } as Message);
            }
            return;
          }

          // New incoming message that doesn't exist yet
          const activeChatUser = get().selectedUserToMessage;
          const isMessagePage = get().isMessagePage;
          get().addIncomingMessage(incomingMessage);

          if (
            !isMessagePage ||
            (activeChatUser && incomingMessage.senderId !== activeChatUser.id)
          ) {
            // Update unread messages count
            const unReadMessagesCounter = get().unreadMessagesCount;
            const profile = useProfileStore.getState().profile;
            const currentCounters = unReadMessagesCounter.counters || {};
            const senderId = incomingMessage.senderId;
            const newCount = (currentCounters[senderId] || 0) + 1;
            const updatedCounters = {
              ...currentCounters,
              [senderId]: newCount,
            };

            get().updateUnreadMessagesCount(
              unReadMessagesCounter.id,
              profile ? profile.id : profileId,
              updatedCounters
            );
          }
        });
      },

      /* ------------------ SEND MESSAGE ------------------ */
      sendMessage: async (msg: Message, profileId: number) => {
        const userId = useProfileStore.getState().profile?.userId;

        // Optimistically add the message locally
        set((state) => {
          const localMessage = { ...msg, id: msg.id };
          delete localMessage.blobFiles;
          state.messages.push(localMessage);
        });

        //Upload images to server/cloud here in real app
        let uploadedImages;
        const formData = new FormData();
        if (msg.blobFiles && msg.blobFiles.length) {
          msg.blobFiles.forEach((file) => {
            formData.append("images", file);
          });
        }
        try {
          uploadedImages = await uploadResources(
            userId!,
            formData,
            "chat_media"
          );

          if (!uploadedImages.success) {
            throw new Error(uploadedImages.error || "Image upload failed");
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }

        //save the message to database here in real app
        const savedMessage: Message = await saveMessageAPI({
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          mediaFiles:
            uploadedImages?.data.map((img: any) => ({
              mediaUrl: img.url,
              mediaUrlKey: img.key,
            })) || [],
        });

        // Update the message in the store with the saved message
        get().updateMessages(savedMessage, msg.id);

        //emit the message to socket server
        const socket = getSocket(profileId);
        socket.emit("chats", savedMessage);
      },

      /* ------------------ DELETE MESSAGE ------------------ */
      deleteMessage: async (messageId: string) => {
        const profile = useProfileStore.getState().profile;
        if (!profile) return;

        // 1. Get a clean, non-proxy copy of the message BEFORE the update
        const currentMessages = get().messages;
        const messageToUpdate = currentMessages.find(
          (msg) => msg.id === messageId
        );

        if (!messageToUpdate) return;

        // Create a plain object copy to send to the API and Socket
        const messageCopy = { ...messageToUpdate };

        // 2. Perform the state update
        set((state) => {
          const msg = state.messages.find((m) => m.id === messageId);
          if (!msg) return;
          //update message immediately in the store
          if (msg.senderId === profile.id) {
            msg.deletedBySender = true;
            msg.deletedByReceiver = true;
            state.updateMessages(msg);
          } else if (msg.receiverId === profile.id) {
            msg.deletedByReceiver = true;
            state.updateMessages(msg);
          }
        });

        // 3. Use the clean copy for Async/API calls
        try {
          // Update the local copy's status to match what was sent to DB
          messageCopy.deletedByReceiver = true;
          if (messageCopy.senderId === profile.id)
            messageCopy.deletedBySender = true;

          const messageDeleted = await deleteMessageApi(
            messageCopy,
            profile.id,
            profile.userId
          );

          if (messageDeleted.success && messageCopy.deletedBySender) {
            const socket = getSocket(profile.id);
            socket.emit("chats", messageCopy);
          }
        } catch (error) {
          console.error("Failed to delete message:", error);
        }
      },

      // ==================== Additional Actions ====================
      clearMessages: () => {
        localStorage.removeItem("spraadaSelectedChatUserId");
        set((state) => {
          state.messages = [];
          state.profiles = [];
          state.isLoading = false;
          state.error = null;
        });
      },
    })),

    {
      name: "messages-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        profiles: state.profiles,
      }),
    }
  )
);
