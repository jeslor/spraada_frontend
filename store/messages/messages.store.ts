import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageStore, Message, ProfileSummary } from "./messages.type";
import { fetchMessagesApi } from "@/lib/actions/message.actions";
import { getSocket } from "@/lib/socket/socket";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  profiles: [],
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
      setProfiles: (profiles: ProfileSummary[]) => {
        set((state) => {
          state.profiles = profiles;
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
          get().addIncomingMessage(incomingMessage);
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
