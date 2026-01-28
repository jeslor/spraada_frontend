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
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      //set conversations
      setConversations: (conversations: Conversation[]) => {
        set((state) => {
          state.conversations = [
            ...conversations,
            ...state.conversations.filter(
              (c) => !conversations.some((newC) => newC.id === c.id),
            ),
          ];
        });
      },
      //fetch conversations from backend
      fetchConversations: async (profileId: number) => {
        const page = get().currentConversationPage;
        set((state) => {
          state.isLoadingConversations = true;
          state.error = null;
        });
        const conversation = await fetchConversationsAPI(profileId, page);
        if (conversation.success) {
          set((state) => {
            state.conversations = [
              ...conversation.data,
              ...state.conversations,
            ];
            state.currentConversationPage += 1;
            state.isLoadingConversations = false;
          });
        } else {
          set((state) => {
            state.isLoadingConversations = false;
            state.error =
              conversation.data instanceof Error
                ? conversation.data.message
                : "failed to fetch conversations";
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
            conversation.messages.push(message);
          }
          if (!conversation && otherParticipant) {
            state.conversations.unshift({
              id: conversationId,
              otherParticipant: otherParticipant,
              messages: [message],
              currentPage: 1,
            });
            // get the conversation from backend if not found
          }
        });
      },
    })),
    {
      name: "conversation-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
