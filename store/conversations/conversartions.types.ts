import { ProfileSummary } from "../messages/messages.type";
import { Message } from "../messages/messages.type";

export interface Conversation {
  id: number;
  otherParticipant: ProfileSummary;
  messages: Message[];
  currentPage: number;
  isAllMessagesLoaded?: boolean;
  unreadCount?: number;
}

export interface ConversationState {
  isMessagePage: boolean;
  conversations: Conversation[];
  isLoadingConversations: boolean;
  isLoadingUnreadConversations: boolean;
  error: string | null;
  currentConversationPage: number;
  selectedConversation: Conversation | null;
  _hasHydratedConversations: boolean;
  _hasFetchedConversationsWithUnreadFirst: boolean;
  isAllConversationsLoaded: boolean;
  conversationUnreadNotifications: {
    conversationId: number;
    hasNotification: boolean;
    createdAt?: string;
    unreadCount?: number;
  }[];
}

export interface ConversationActions {
  setIsMessagePage: (isMessagePage: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
  setConversationUnreadNotifications: (
    notifications: {
      conversationId: number;
      hasNotification: boolean;
      createdAt?: string;
    }[],
  ) => void;
  removeConversationUnreadNotification: (conversationId: number) => void;
  setIsLoadingConversations: (isLoading: boolean) => void;
  setIsLoadingUnreadConversations: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentConversationPage: (page: number) => void;
  addMessageToConversation: (
    conversationId: number,
    message: Message,
    otherParticipant?: ProfileSummary,
  ) => void;
  addMoreMessagesToConversation: (
    conversationId: number,
    messages: Message[],
  ) => void;
  addNewMessagesToConversation: (
    conversationId: number,
    messages: Message[],
  ) => void;
  replaceConversation: (
    oldConversationId: number,
    newConversation: Conversation,
  ) => void;
  replaceMessageInConversation: (
    conversationId: number,
    oldMessageId: string,
    updatedMessage: Message,
  ) => void;
  removeMessageFromConversation: (
    conversationId: number,
    messageId: string,
  ) => void;
  replaceConversationId: (oldId: number, newId: number) => void;
  fetchConversationsWithUnreadFirst: (profileId: number) => Promise<void>;
  fetchConversations: (profileId: number, limit?: number) => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
  updateUnreadCount: (conversationId: number, count: number) => void;

  clearConversations: () => void;
}

export interface ConversationStore
  extends ConversationState, ConversationActions {}
