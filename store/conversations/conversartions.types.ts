import { ProfileSummary } from "../messages/messages.type";
import { Message } from "../messages/messages.type";

export interface Conversation {
  id: number;
  otherParticipant: ProfileSummary;
  messages: Message[];
  currentPage: number;
}

export interface ConversationState {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  error: string | null;
  currentConversationPage: number;
  selectedConversation: Conversation | null;
}

export interface ConversationActions {
  setConversations: (conversations: Conversation[]) => void;
  addMessageToConversation: (
    conversationId: number,
    message: Message,
    otherParticipant?: ProfileSummary,
  ) => void;
  fetchConversations: (profileId: number) => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
}

export interface ConversationStore
  extends ConversationState, ConversationActions {}
