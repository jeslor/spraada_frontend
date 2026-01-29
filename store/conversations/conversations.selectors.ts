import { useConversationStore } from "./conversations.store";

export const useConversations = () =>
  useConversationStore((state: any) => state.conversations);
export const useIsLoadingConversations = () =>
  useConversationStore((state: any) => state.isLoadingConversations);
export const useCurrentConversationPage = () =>
  useConversationStore((state: any) => state.currentConversationPage);
export const useFetchConversations = () =>
  useConversationStore((state: any) => state.fetchConversations);
export const useAddMessageToConversation = () =>
  useConversationStore((state: any) => state.addMessageToConversation);
export const useSetSelectedConversation = () =>
  useConversationStore((state: any) => state.setSelectedConversation);
export const useSelectedConversation = () =>
  useConversationStore((state: any) => {
    const selected = state.selectedConversation;
    if (!selected) return null;
    // Always resolve the latest reference from the array
    return (
      state.conversations.find((c: any) => c.id === selected.id) || selected
    );
  });
export const useSelectedConversationMessages = () =>
  useConversationStore((state: any) => {
    const selectedConversation = state.selectedConversation;
    return selectedConversation ? selectedConversation.messages : [];
  });

export const useClearConversations = () =>
  useConversationStore((state: any) => state.clearConversations);

export const useHasHydratedConversations = () =>
  useConversationStore((state: any) => state._hasHydratedConversations);
