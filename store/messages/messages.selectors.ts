import { useMessageStore } from "./messages.store";
import { Message, ProfileSummary } from "./messages.type";

// ==================== Basic Selectors ====================
export const useMessages = (): Message[] =>
  useMessageStore((state) => state.messages);

export const useMessagesLoading = (): boolean =>
  useMessageStore((state) => state.isLoading);

export const useMessagesError = (): string | null =>
  useMessageStore((state) => state.error);

export const useUserProfiles = (): ProfileSummary[] =>
  useMessageStore((state) => state.profiles);

export const useFetchMessages = () =>
  useMessageStore((state) => state.fetchMessages);

export const useSetMessages = () =>
  useMessageStore((state) => state.setMessages);

export const useSetUserProfiles = () =>
  useMessageStore((state) => state.setUserProfiles);

export const useUpdateMessages = () =>
  useMessageStore((state) => state.updateMessages);

// ==================== Derived Selectors ====================
export const getLastMessagePreview = (profileId: number): string => {
  const messages = useMessageStore.getState().messages;
  const lastMessage = messages
    .filter((msg) => msg.senderId === profileId || msg.receiverId === profileId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  return lastMessage
    ? `${lastMessage.content
        .slice(0, 1)
        .toLocaleUpperCase()}${lastMessage.content.slice(1, 100)}`
    : "";
};

export const getSelectedUserMessages = (selectedUserId: number): Message[] => {
  const messages = useMessageStore.getState().messages;
  return messages.filter(
    (msg) =>
      msg.senderId === selectedUserId || msg.receiverId === selectedUserId
  );
};

export const useMessageActions = () => ({
  getLastMessage: getLastMessagePreview,
  selectedUserMessages: getSelectedUserMessages,
});
