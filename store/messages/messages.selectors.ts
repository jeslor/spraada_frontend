import { useProfileStore } from "../profile/profile.store";
import { useMessageStore } from "./messages.store";
import { Message, ProfileSummary } from "./messages.type";

// ==================== Basic Selectors ====================

export const useInitializeChatSocket = () =>
  useMessageStore((state) => state.initSocketListeners);
export const useMessages = (): Message[] =>
  useMessageStore((state) => state.messages);

export const useSetSelectedUserToMessage = () =>
  useMessageStore((state) => state.setSelectedUserToMessage);
export const useSelectedUserToMessage = (): ProfileSummary | null =>
  useMessageStore((state) => state.selectedUserToMessage);

export const useSendMessage = () =>
  useMessageStore((state) => state.sendMessage);

export const useMessagesLoading = (): boolean =>
  useMessageStore((state) => state.isLoading);

export const useMessagesError = (): string | null =>
  useMessageStore((state) => state.error);

export const useFetchMessages = () =>
  useMessageStore((state) => state.fetchMessages);

export const useSetMessages = () =>
  useMessageStore((state) => state.setMessages);

export const useUpdateMessages = () =>
  useMessageStore((state) => state.updateMessages);

export const useProfiles = (): ProfileSummary[] =>
  useMessageStore((state) => state.profiles);

export const useSetProfiles = () =>
  useMessageStore((state) => state.setProfiles);
export const useUpdateProfiles = () =>
  useMessageStore((state) => state.updateProfiles);

export const useClearMessages = () =>
  useMessageStore((state) => state.clearMessages);

// ==================== Derived Selectors ====================

export const useUserProfiles = () => {
  const messages = useMessageStore.getState().messages;
  const profileId = useProfileStore.getState().profile?.id;

  const profiles: ProfileSummary[] = messages.reduce((acc, message) => {
    const otherProfile =
      message.sender.id === profileId ? message.receiver : message.sender;

    if (!acc.some((p) => p.id === otherProfile.id)) {
      acc.push({
        id: otherProfile.id,
        firstName: otherProfile.firstName,
        lastName: otherProfile.lastName,
        avatarUrl: otherProfile.avatarUrl,
      });
    }

    return acc;
  }, [] as ProfileSummary[]);

  useMessageStore.getState().setProfiles(profiles);
};

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

// ==================== Combined Selectors ====================
export const useMessageActions = () => ({
  getLastMessage: getLastMessagePreview,
  selectedUserMessages: getSelectedUserMessages,
  userProfiles: useUserProfiles,
});
