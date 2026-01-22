import { useProfileStore } from "../profile/profile.store";
import { useMessageStore } from "./messages.store";
import {
  Message,
  ProfileSummary,
  UnReadMessagesCounterType,
} from "./messages.type";

// ==================== Basic Selectors ====================

export const useInitializeChatSocket = () =>
  useMessageStore((state) => state.initSChatSocketListeners);
export const useSetSelectedUserToMessage = () =>
  useMessageStore((state) => state.setSelectedUserToMessage);
export const useSelectedUserToMessage = (): ProfileSummary | null =>
  useMessageStore((state) => state.selectedUserToMessage);

export const useSetSelectedUserMessages = () =>
  useMessageStore((state) => state.setSelectedUserMessages);
export const useSelectedUserMessages = (): Message[] =>
  useMessageStore((state) => state.selectedUserMessages);

export const useSetMessages = () =>
  useMessageStore((state) => state.setMessages);
export const useMessages = (): Message[] =>
  useMessageStore((state) => state.messages);

export const useDeleteMessage = () =>
  useMessageStore((state) => state.deleteMessage);

export const useUnreadMessagesCount = (): UnReadMessagesCounterType =>
  useMessageStore((state) => state.unreadMessagesCount);
export const useSetUnreadMessagesCount = () =>
  useMessageStore((state) => state.setUnreadMessagesCount);
export const useFetchUnreadMessagesCount = () =>
  useMessageStore((state) => state.fetchUnReadMessagesCount);
export const useUpdateUnreadMessagesCount = () =>
  useMessageStore((state) => state.updateUnreadMessagesCount);

export const useSendMessage = () =>
  useMessageStore((state) => state.sendMessage);
export const useMessagesLoading = (): boolean =>
  useMessageStore((state) => state.isLoading);
export const useMessagesError = (): string | null =>
  useMessageStore((state) => state.error);
export const useFetchMessages = () =>
  useMessageStore((state) => state.fetchMessages);
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
    if (!message.sender || !message.sender.id || !message.receiver) return acc;
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

export const getLastMessagePreview = (profileId: number): Message => {
  const messages = useMessageStore.getState().messages;
  const lastMessage = messages
    .filter((msg) => msg.senderId === profileId || msg.receiverId === profileId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  return lastMessage;
};

export const useAllUnReadMessagesCount = (): number => {
  const unreadMessagesCount = useMessageStore(
    (state) => state.unreadMessagesCount.counters
  );
  return Object.values(unreadMessagesCount).reduce(
    (total, count) => total + count,
    0
  );
};

// ==================== Combined Selectors ====================
export const useMessageActions = () => ({
  getLastMessage: getLastMessagePreview,
  userProfiles: useUserProfiles,
});
