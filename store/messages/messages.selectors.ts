import { useMessageStore } from "./messages.store";

export const useInitConversationSocketListeners = () =>
  useMessageStore((state: any) => state.initConversationSocketListeners);
export const useSendMessage = () =>
  useMessageStore((state: any) => state.sendMessage);

export const useGetLastMessageByConversationId = () =>
  useMessageStore((state: any) => state.getLastMessageByConversationId);
