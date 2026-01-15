export interface Message {
  id: string;
  text: string;
  fromUserId: number;
  toUserId: number;
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
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setUserProfiles: (userId: number) => void;
}

export interface MessageStore extends MessageState, MessageActions {}
