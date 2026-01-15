import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageStore, Message, ProfileSummary } from "./messages.type";
import { fetchMessagesApi } from "@/lib/actions/message.actions";

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
      fetchMessages: async (userId: number) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        try {
          const messages = await fetchMessagesApi(userId);
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
      setUserProfiles: (userId: number) => {
        set((state) => {
          const userProfiles = state.messages.reduce(
            (profiles: ProfileSummary[], message) => {
              const otherUserId =
                message.fromUserId !== userId
                  ? message.fromUserId
                  : message.toUserId;
              if (!profiles.find((profile) => profile.id === otherUserId)) {
                profiles.push({
                  id: otherUserId,
                  firstName: `User${otherUserId}`,
                  lastName: "",
                  avatarUrl: "",
                });
              }
              return profiles;
            },
            []
          );
          state.profiles = userProfiles;
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
