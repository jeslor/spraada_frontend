import {
  Conversation,
  ConversationState,
  ConversationStore,
} from "./conversartions.types";
import { useConversationStore } from "./conversations.store";

export const useSetIsMessagePage = () =>
  useConversationStore((state: ConversationStore) => state.setIsMessagePage);
export const useFetchConversationsWithUnreadFirst = () =>
  useConversationStore(
    (state: ConversationStore) => state.fetchConversationsWithUnreadFirst,
  );
export const useIsAllConversationsLoaded = () =>
  useConversationStore(
    (state: ConversationState) => state.isAllConversationsLoaded,
  );
export const useConversations = () =>
  useConversationStore((state: any) => state.conversations);
export const useIsLoadingConversations = () =>
  useConversationStore((state: any) => state.isLoadingConversations);
export const useIsLoadingUnreadConversations = () =>
  useConversationStore((state: any) => state.isLoadingUnreadConversations);
export const useCurrentConversationPage = () =>
  useConversationStore((state: any) => state.currentConversationPage);
export const useFetchConversations = () =>
  useConversationStore((state: any) => state.fetchConversations);
export const useAddMessageToConversation = () =>
  useConversationStore((state: any) => state.addMessageToConversation);
export const useSetSelectedConversation = () =>
  useConversationStore((state: any) => state.setSelectedConversation);
export const useHasFetchedConversationsWithUnreadFirst = () =>
  useConversationStore(
    (state: any) => state._hasFetchedConversationsWithUnreadFirst,
  );
export const useSelectedConversation = () =>
  useConversationStore((state: any) => {
    const selected = state.selectedConversation;
    if (!selected) return null;
    // Always resolve the latest reference from the array
    return (
      state.conversations.find((c: Conversation) => c.id === selected.id) ||
      selected
    );
  });
export const useSelectedConversationMessages = () =>
  useConversationStore((state: ConversationState) => {
    const selectedConversation = state.selectedConversation;
    return selectedConversation ? selectedConversation.messages : [];
  });

export const useClearConversations = () =>
  useConversationStore((state: ConversationStore) => state.clearConversations);

export const useHasHydratedConversations = () =>
  useConversationStore(
    (state: ConversationState) => state._hasHydratedConversations,
  );

// =======================Drives Hooks =============================
export const useConversationExists = (conversationId: number) => {
  return useConversationStore((state: ConversationState) => {
    return state.conversations.some(
      (c: Conversation) => c.id === conversationId,
    );
  });
};

export const useAllUnreadMessagesCount = () => {
  return useConversationStore((state: ConversationState) => {
    return state.conversations.reduce(
      (total: number, conv: Conversation) => total + (conv.unreadCount || 0),
      0,
    );
  });
};
