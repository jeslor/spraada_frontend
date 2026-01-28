import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ConversationStore, Conversation } from "./conversartions.types";
import { fetchConversationsAPI } from "@/lib/actions/conversations.actions";
import { Message, ProfileSummary } from "@/store/messages/messages.type";

const initialState = {
  conversations: [] as Conversation[],
  isLoadingConversations: false,
  error: null as string | null,
  currentConversationPage: 1,
  selectedConversation: null as Conversation | null,
  _hasHydratedConversations: false,
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Logic: Merge new data with old data, prioritizing new data for duplicates
      setConversations: (incoming: Conversation[]) => {
        set((state) => {
          const conversationMap = new Map(
            state.conversations.map((c) => [c.id, c]),
          );

          incoming.forEach((conv) => {
            conversationMap.set(conv.id, conv);
          });

          state.conversations = Array.from(conversationMap.values());
        });
      },

      //fetch conversations from backend
      fetchConversations: async (profileId: number) => {
        // Guard: Prevent double-fetching the same page
        if (get().isLoadingConversations) return;

        set((state) => {
          state.isLoadingConversations = true;
          state.error = null;
        });

        const result = await fetchConversationsAPI(
          profileId,
          get().currentConversationPage,
        );

        if (result.success) {
          set((state) => {
            const incoming = result.data;
            // Filter out any items that already exist in state to avoid duplicates
            const existingIds = new Set(state.conversations.map((c) => c.id));
            const uniqueNew = incoming.filter((c) => !existingIds.has(c.id));

            state.conversations.push(...uniqueNew);
            state.currentConversationPage += 1;
            state.isLoadingConversations = false;
          });
        } else {
          set((state) => {
            state.isLoadingConversations = false;
            state.error =
              result.data instanceof Error ? result.data.message : "Failed";
          });
        }
      },

      // Add new conversation
      setSelectedConversation: (conversation: Conversation | null) => {
        set((state) => {
          state.selectedConversation = conversation;
        });
      },

      //Add message to conversation
      addMessageToConversation: (
        conversationId: number,
        message: Message,
        otherParticipant?: ProfileSummary,
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );

          if (conversation) {
            // Deduplicate messages within the conversation
            const exists = conversation.messages.some(
              (m) => m.id === message.id,
            );
            if (!exists) conversation.messages.push(message);
          } else if (otherParticipant) {
            // New conversation: add to the beginning of the list
            state.conversations.unshift({
              id: conversationId,
              otherParticipant,
              messages: [message],
              currentPage: 1,
            });
          }
        });
      },

      replaceConversationId: (oldId: number, newId: number) => {
        set((state) => {
          const conversation = state.conversations.find((c) => c.id === oldId);
          if (conversation) {
            conversation.id = newId;
          }
        });
      },

      replaceConversation: (
        oldConversationId: number,
        newConversation: Conversation,
      ) => {
        set((state) => {
          const conversationIdx = state.conversations.findIndex(
            (c) => c.id === oldConversationId,
          );
          if (conversationIdx !== -1) {
            state.conversations[conversationIdx] = newConversation;
            state.selectedConversation = newConversation;
          }
        });
      },

      replaceMessageInConversation: (
        conversationId: number,
        oldMessageId: string,
        updatedMessage: Message,
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (conversation) {
            const messageIdx = conversation.messages.findIndex(
              (m) => m.id === oldMessageId,
            );
            if (messageIdx !== -1) {
              conversation.messages[messageIdx] = updatedMessage;
            }
          }
        });
      },

      clearConversations: () => {
        set(() => ({
          ...initialState,
        }));
      },
    })),
    {
      name: "conversation-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationPage: state.currentConversationPage,
      }),
      onRehydrateStorage: () => (state) => {
        state!._hasHydratedConversations = true;
      },
    },
  ),
);
