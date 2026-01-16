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
