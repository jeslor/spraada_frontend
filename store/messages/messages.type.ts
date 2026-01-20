import { number } from "zod";

export interface Message {
  id: string;
  content: string;
  senderId: number;
  receiverId: number;
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
  receiver: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface UnReadMessagesCounterType {
  id: number;
  profileId: number;
  counters: { [key: number]: number };
}

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  profiles: ProfileSummary[];
  selectedUserToMessage: ProfileSummary | null;
  selectedUserMessages: Message[];
  unreadMessagesCount: {
    id: number;
    profileId: number;
    counters: { [key: number]: number };
  };
}

export interface ProfileSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface MessageActions {
  setMessages: (messages: Message[]) => void;
  setUnreadMessagesCount: (
    unreadMessagesCount: UnReadMessagesCounterType
  ) => void;
  fetchUnReadMessagesCount: (profileId: number) => Promise<void>;
  updateUnreadMessagesCount: (
    messageCounterId: number,
    profileId: number,
    counters: { [key: number]: number }
  ) => Promise<void>;
  addIncomingMessage: (message: Message) => void;
  setSelectedUserToMessage: (profile: ProfileSummary | null) => void;
  setSelectedUserMessages: (selectedUserId: number) => void;
  initSocketListeners: (profileId: number) => void;
  sendMessage: (msg: Message, profileId: number) => void;
  fetchMessages: (userId: number) => Promise<void>;
  updateMessages: (updatedMessage: Message) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProfiles: (profiles: ProfileSummary[]) => void;
  updateProfiles: (profile: ProfileSummary) => void;

  clearMessages: () => void;
}

export interface MessageStore extends MessageState, MessageActions {}
