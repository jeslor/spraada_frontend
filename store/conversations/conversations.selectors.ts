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
  useConversationStore((state: any) => state.selectedConversation);

export const useClearConversations = () =>
  useConversationStore((state: any) => state.clearConversations);
