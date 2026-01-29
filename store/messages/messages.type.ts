import { Profile } from "../profile/profile.types";

export interface Message {
  id: string;
  content: string;
  senderId: number;
  conversationId?: number;
  deletedBySender?: boolean;
  deletedByReceiver?: boolean;
  mediaFiles?: {
    mediaUrl: string;
    mediaUrlKey: string;
  }[];
  blobFiles?: File[];
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface ProfileSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface MessageStore {
  // Socket logic
  initConversationSocketListeners: (profileId: number) => void;
  sendMessage: (
    msg: Message,
    otherParticipant: ProfileSummary,
    conversationId: number,
    userId: number,
  ) => Promise<void>;
  getOldestMessageId: (conversationId: number) => Message | null;
  getLatestMessageId: (conversationId: number) => Message | null;
  fetchMoreMessages: (conversationId: number) => Promise<void>;
  deleteMessage: (messageId: string, profileId: Profile) => Promise<void>;
}
