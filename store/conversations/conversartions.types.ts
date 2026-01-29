import { ProfileSummary } from "../messages/messages.type";
import { Message } from "../messages/messages.type";

export interface Conversation {
  id: number;
  otherParticipant: ProfileSummary;
  messages: Message[];
  currentPage: number;
  isAllMessagesLoaded?: boolean;
}

export interface ConversationState {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  error: string | null;
  currentConversationPage: number;
  selectedConversation: Conversation | null;
  _hasHydratedConversations: boolean;
}

export interface ConversationActions {
  setConversations: (conversations: Conversation[]) => void;
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
  fetchConversations: (profileId: number) => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
  clearConversations: () => void;
}

export interface ConversationStore
  extends ConversationState, ConversationActions {}
