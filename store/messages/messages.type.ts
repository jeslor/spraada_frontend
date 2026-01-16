export interface Message {
  id: string;
  content: string;
  senderId: number;
  receiverId: number;
  mediaFiles?: { mediaUrl: string }[];
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

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  profiles: ProfileSummary[];
}

export interface ProfileSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface MessageActions {
  setMessages: (messages: Message[]) => void;
  fetchMessages: (userId: number) => Promise<void>;
  updateMessages: (updatedMessage: Message) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setUserProfiles: (userId: number) => void;
}

export interface MessageStore extends MessageState, MessageActions {}
