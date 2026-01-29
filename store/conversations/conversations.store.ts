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
          if (!conversation) {
            state.selectedConversation = null;
            return;
          }
          // Always use the reference from the array if it exists
          const found = state.conversations.find(
            (c) => c.otherParticipant.id === conversation.otherParticipant.id,
          );
          state.selectedConversation = found || conversation;
          // add the conversation to the conversations array if it doesn't exist
          if (!found) {
            state.conversations.unshift(conversation);
          }
        });
      },

      //Add message to conversation
      addMessageToConversation: (
        conversationId: number,
        message: Message,
        otherParticipant?: ProfileSummary,
      ) => {
        set((state) => {
          let conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (conversation) {
            const exists = conversation.messages.some(
              (m) => m.id === message.id,
            );
            if (!exists) conversation.messages.push(message);
            // Always sync selectedConversation reference
            if (state.selectedConversation?.id === conversationId) {
              state.selectedConversation = conversation;
            }
          } else if (otherParticipant) {
            // New conversation: add to the beginning of the list
            const newConv = {
              id: conversationId,
              otherParticipant,
              messages: [message],
              currentPage: 1,
            };
            state.conversations.unshift(newConv);
            state.selectedConversation = newConv;
          }
        });
      },

      //remove message from conversation
      removeMessageFromConversation: (
        conversationId: number,
        messageId: string,
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (!conversation) return;
          conversation.messages = conversation.messages.filter(
            (m) => m.id !== messageId,
          );

          // Also update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            state.selectedConversation = {
              ...conversation,
              messages: conversation.messages,
            };
          }
        });
      },

      //add more messages to conversation
      addMoreMessagesToConversation: (
        conversationId: number,
        messages: Message[],
      ) => {
        set((state) => {
          // Find the index so we can update the array directly
          const idx = state.conversations.findIndex(
            (c) => c.id === conversationId,
          );
          if (idx === -1) return;

          const existingMessages = state.conversations[idx].messages;

          // Create a Map for deduplication
          const messageMap = new Map(existingMessages.map((m) => [m.id, m]));
          messages.forEach((m) => messageMap.set(m.id, m));

          // Sort messages
          const sorted = Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          // Update the conversation in the array
          state.conversations[idx].messages = sorted;

          // Update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            // Re-assigning the whole object ensures the Proxy registers a significant change
            state.selectedConversation = {
              ...state.conversations[idx],
              messages: sorted,
            };
          }
        });
      },

      addNewMessagesToConversation: (
        conversationId: number,
        messages: Message[],
      ) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );
          if (!conversation) return;

          const existingMessages = conversation.messages;

          // Create a Map for deduplication
          const messageMap = new Map(existingMessages.map((m) => [m.id, m]));
          messages.forEach((m) => messageMap.set(m.id, m));

          // Sort messages
          const sorted = Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          // Update the conversation's messages
          conversation.messages = sorted;

          // Update selectedConversation if it's the one we are viewing
          if (state.selectedConversation?.id === conversationId) {
            state.selectedConversation = {
              ...conversation,
              messages: sorted,
            };
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
            // Always set selectedConversation to the new reference from the array
            state.selectedConversation = state.conversations[conversationIdx];
          }
        });
      },

      replaceMessageInConversation: (
        conversationId: number,
        oldMessageId: string,
        updatedMessage: Message,
      ) => {
        set((state) => ({
          conversations: state.conversations.map((cv) => {
            // 1. Find the correct conversation
            if (cv.id !== conversationId) return cv;

            // 2. Return a new conversation object with updated messages array
            return {
              ...cv,
              messages: cv.messages.map((m) =>
                // 3. Replace only the specific message, keep others as they are
                m.id === oldMessageId ? updatedMessage : m,
              ),
            };
          }),
          // 4. Also update the 'selectedConversation' if it matches,
          // to ensure the active chat window reflects the change immediately.
          selectedConversation:
            state.selectedConversation?.id === conversationId
              ? {
                  ...state.selectedConversation,
                  messages: state.selectedConversation.messages.map((m) =>
                    m.id === oldMessageId ? updatedMessage : m,
                  ),
                }
              : state.selectedConversation,
        }));
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
        selectedConversation: state.selectedConversation,
      }),
      onRehydrateStorage: () => (state) => {
        state!._hasHydratedConversations = true;
      },
    },
  ),
);
