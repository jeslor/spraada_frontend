import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageStore, Message, ProfileSummary } from "./messages.type";
import {
  fetchMessagesApi,
  fetchUnreadMessagesCountApi,
  updateUnreadMessagesCountApi,
} from "@/lib/actions/message.actions";
import { getSocket } from "@/lib/socket/socket";
import { useProfileStore } from "../profile/profile.store";

const initialState = {
  messages: [],
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

      // ------------------ FETCH MESSAGES ------------------ //
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

      updateMessages: (updatedMessage: Message) => {
        set((state) => {
          const index = state.messages.findIndex(
            (msg) => msg.id === updatedMessage.id
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

      /* ------------------ SOCKET INIT ------------------ */
      initSocketListeners: (profileId: number) => {
        const socket = getSocket(profileId);

        socket.off("chats"); // prevent duplicate listeners

        socket.on("chats", (incomingMessage: Message) => {
          const activeChatUser = get().selectedUserToMessage;

          get().addIncomingMessage(incomingMessage);
          if (
            activeChatUser &&
            (incomingMessage.senderId !== activeChatUser.id ||
              incomingMessage.receiverId !== activeChatUser.id)
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
      sendMessage: (msg: Message, profileId: number) => {
        set((state) => {
          state.messages.push(msg);
        });

        const socket = getSocket(profileId);
        socket.emit("chats", {
          userId: msg.receiverId,
          content: msg.content,
          mediaUrl: msg.mediaFiles?.[0]?.mediaUrl,
        });
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
