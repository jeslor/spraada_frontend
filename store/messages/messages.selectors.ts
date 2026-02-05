import { useMessageStore } from "./messages.store";

export const useInitConversationSocketListeners = () =>
  useMessageStore((state: any) => state.initConversationSocketListeners);
export const useSendMessage = () =>
  useMessageStore((state: any) => state.sendMessage);

export const useIsFetchingOlderMessages = () =>
  useMessageStore((state: any) => state.isFetchingOlderMessages);
export const useGetOldestMessageByConversationId = () =>
  useMessageStore((state: any) => state.getOldestMessageId);

export const useGetLatestMessageByConversationId = () =>
  useMessageStore((state: any) => state.getLatestMessageId);

export const useFetchMoreMessages = () =>
  useMessageStore((state: any) => state.fetchMoreMessages);

export const useDeleteMessage = () =>
  useMessageStore((state: any) => state.deleteMessage);

export const useFetchNewMessages = () =>
  useMessageStore((state: any) => state.fetchNewMessages);
