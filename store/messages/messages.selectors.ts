import { useMessageStore } from "./messages.store";

export const useInitConversationSocketListeners = () =>
  useMessageStore((state: any) => state.initConversationSocketListeners);
export const useSendMessage = () =>
  useMessageStore((state: any) => state.sendMessage);

export const useGetOldestMessageByConversationId = () =>
  useMessageStore((state: any) => state.getOldestMessageId);

export const useFetchMoreMessages = () =>
  useMessageStore((state: any) => state.fetchMoreMessages);
